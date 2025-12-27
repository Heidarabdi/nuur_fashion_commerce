import { Context, Next } from "hono";
import { response } from "../utils";
import { auth } from "../lib/auth";
import { logger } from "../utils/logger";
import { users } from "../db/schema";

// Extend Hono Context to include user and session
declare module "hono" {
    interface ContextVariableMap {
        user: typeof users.$inferSelect;
        session: any;
    }
}

/**
 * Strict Auth Middleware
 * Blocks request if user is not authenticated
 */
export const authMiddleware = async (c: Context, next: Next) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    });

    if (!session) {
        return response.error(c, "Unauthorized", 401);
    }

    try {
        c.set("user", session.user as any);
        c.set("session", session.session);
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
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    });

    if (session) {
        c.set("user", session.user as any);
        c.set("session", session.session);
    }

    await next();
};


