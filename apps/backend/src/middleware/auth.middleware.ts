import { Context, Next } from "hono";
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
        clerkUserId: string;
    }
}

export const authMiddleware = async (c: Context, next: Next) => {
    try {
        const authHeader = c.req.header("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return response.error(c, "Unauthorized: No token provided", 401);
        }

        const token = authHeader.split(" ")[1];
        const payload = await clerkService.verifyToken(token);

        if (!payload) {
            return response.error(c, "Unauthorized: Invalid token", 401);
        }

        const clerkUserId = payload.sub;

        // Check if user exists in our DB, if not sync (Lazy Sync)
        // Or normally we rely on Webhooks to create users, but for robustness:
        let user = await db.query.users.findFirst({
            where: eq(users.clerkId, clerkUserId)
        });

        if (!user) {
            // Option A: Reject (Wait for webhook) -> stricter
            // Option B: Lazy Create -> better UX if webhook delayed
            // For now, let's reject to enforce proper Webhook flow, OR fetch from Clerk and create.
            // Let's do a quick fetch sync for robustness since webhooks can fail locally.
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
                        set: { email: email } // safe update
                    }).returning();

                    logger.info({ userId: user.id }, "User lazy-synced in middleware");
                }
            } catch (syncError) {
                logger.error({ syncError }, "Failed to lazy sync user");
            }
        }

        if (!user) {
            return response.error(c, "Unauthorized: User not found", 401);
        }

        c.set("user", user);
        c.set("clerkUserId", clerkUserId);

        await next();
    } catch (error) {
        return response.error(c, "Unauthorized", 401);
    }
};
