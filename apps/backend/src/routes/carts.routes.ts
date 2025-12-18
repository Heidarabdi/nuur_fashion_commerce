import { Hono } from "hono";
import { cartsController } from "../controllers/carts.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const cartsRoutes = new Hono();

// Auth is Optional here! We handle both.
// BUT `authMiddleware` throws 401 if token invalid. 
// We need a "soft" auth or handle it in controller. 
// Since authMiddleware is strict, we will NOT apply it globally here.
// Instead, we can apply it conditionally or checking headers manually in controller 
// OR simpler: Use a wrapper that tries auth but doesn't fail.
// For now, let's manually extract in controller or use a dedicated "OptionalAuth" middleware if needed.
// Given our 'authMiddleware' is strict, we skip it for routes that support Guest.
// BUT if they SEND a token, we want to know who they are.

import { Context, Next } from "hono";
import { clerkService } from "../services/external/clerk.service";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const optionalAuth = async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
        try {
            const token = authHeader.split(" ")[1];
            const payload = await clerkService.verifyToken(token);
            if (payload) {
                const clerkUserId = payload.sub;
                const user = await db.query.users.findFirst({ where: eq(users.clerkId, clerkUserId) });
                if (user) {
                    c.set("user", user);
                    c.set("clerkUserId", clerkUserId);
                }
            }
        } catch (e) {
            // Ignore auth errors in optional mode
        }
    }
    await next();
}

cartsRoutes.use("*", optionalAuth);

cartsRoutes.get("/", cartsController.getCart);
cartsRoutes.post("/items", cartsController.addItem);
cartsRoutes.patch("/items/:itemId", cartsController.updateItem);
cartsRoutes.delete("/items/:itemId", cartsController.removeItem);

export default cartsRoutes;
