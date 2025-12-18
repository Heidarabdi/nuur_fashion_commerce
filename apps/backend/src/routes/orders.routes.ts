import { Hono } from "hono";
import { ordersController } from "../controllers/orders.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { Context, Next } from "hono";
import { clerkService } from "../services/external/clerk.service";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

// Reusing Optional Auth logic (Should be shared middleware ideally)
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
        } catch (e) { }
    }
    await next();
}

const ordersRoutes = new Hono();

// Create order can be Guest or User
ordersRoutes.post("/", optionalAuth, ordersController.create);

// Listing orders is strictly protected
ordersRoutes.get("/", authMiddleware, ordersController.getMyOrders);
ordersRoutes.get("/:id", authMiddleware, ordersController.getById);

export default ordersRoutes;
