import { Context, Next } from "hono";
import { response } from "../utils";

export const adminMiddleware = async (c: Context, next: Next) => {
    // Helper to get user from context (populated by authMiddleware)
    // We assume authMiddleware ran BEFORE this.
    const user = c.get("user");

    if (!user) {
        return response.error(c, "Unauthorized", 401);
    }

    if (user.role !== "admin") {
        return response.error(c, "Forbidden: Admin access required", 403);
    }

    await next();
};
