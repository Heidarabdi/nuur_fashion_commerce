import { Context, Next } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { response } from "../utils";
import { clerkService } from "../services/external/clerk.service";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger";

// Extend Hono Context to include user
declare module "hono" {
    interface ContextVariableMap {
        user: typeof users.$inferSelect;
    }
}

/**
 * Helper to sync user from Clerk to our DB
 */
const syncUser = async (clerkUserId: string) => {
    let user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkUserId)
    });

    if (!user) {
        try {
            const clerkUser = await clerkService.getUser(clerkUserId);
            const email = clerkUser.emailAddresses[0]?.emailAddress;

            if (email) {
                [user] = await db.insert(users).values({
                    clerkId: clerkUserId,
                    email: email,
                    firstName: clerkUser.firstName,
                    lastName: clerkUser.lastName,
                    avatarUrl: clerkUser.imageUrl,
                    role: "customer",
                }).onConflictDoUpdate({
                    target: users.clerkId,
                    set: { email: email }
                }).returning();

                logger.info({ userId: user.id }, "User lazy-synced in middleware");
            }
        } catch (syncError) {
            logger.error({ syncError }, "Failed to lazy sync user");
        }
    }
    return user;
};

/**
 * Strict Auth Middleware
 * Blocks request if user is not authenticated
 */
export const authMiddleware = async (c: Context, next: Next) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
        return response.error(c, "Unauthorized", 401);
    }

    try {
        const user = await syncUser(auth.userId);

        if (!user) {
            return response.error(c, "Unauthorized: User account not ready", 401);
        }

        c.set("user", user);
        await next();
    } catch (error) {
        logger.error({ error }, "Auth Middleware Internal Error");
        return response.error(c, "Internal Server Error", 500);
    }
};

/**
 * Optional Auth Middleware
 * Sets user in context if authenticated, but continues if guest
 */
export const optionalAuthMiddleware = async (c: Context, next: Next) => {
    const auth = getAuth(c);

    if (auth?.userId) {
        try {
            const user = await syncUser(auth.userId);
            if (user) {
                c.set("user", user);
            }
        } catch (error) {
            logger.error({ error }, "Optional Auth Middleware Sync Error");
        }
    }

    await next();
};


