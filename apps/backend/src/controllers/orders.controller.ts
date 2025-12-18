import { Context } from "hono";
import { ordersService } from "../services/orders.service";
import { response } from "../utils";
import { createOrderSchema } from "@nuur-fashion-commerce/shared";

// Helper to extract IDs (copied from carts controller)
const getContextIds = (c: Context) => {
    const user = c.get("user");
    const userId = user?.id;
    const guestId = c.req.header("X-Guest-Id");
    return { userId, guestId };
};

export const ordersController = {
    async create(c: Context) {
        const { userId, guestId } = getContextIds(c);
        const body = await c.req.json();

        // Auth Check: For now, let's require User Login for checkout to keep it simple?
        // Or allow Guest functionality. The Schema supports both.
        if (!userId && !guestId) return response.error(c, "No user ID provided", 401);

        const validation = createOrderSchema.safeParse(body);
        if (!validation.success) {
            return response.error(c, "Validation failed", 400, validation.error.format());
        }

        try {
            const order = await ordersService.createFromCart(userId, guestId, validation.data);
            return response.created(c, order);
        } catch (error: any) {
            return response.error(c, error.message || "Order creation failed", 500);
        }
    },

    async getMyOrders(c: Context) {
        const user = c.get("user");
        // Strict Auth required for "My Orders"
        if (!user) return response.error(c, "Unauthorized", 401);

        const orders = await ordersService.getMyOrders(user.id);
        return response.success(c, orders);
    },

    async getById(c: Context) {
        const user = c.get("user");
        const id = c.req.param("id");
        if (!user) return response.error(c, "Unauthorized", 401);

        const order = await ordersService.getById(id, user.id);
        if (!order) return response.notFound(c, "Order not found");

        return response.success(c, order);
    },

    // Admin Controllers
    async adminGetAll(c: Context) {
        const orders = await ordersService.getAll();
        return response.success(c, orders);
    },

    async adminUpdateStatus(c: Context) {
        const id = c.req.param("id");
        const body = await c.req.json();
        const { status } = body;

        // Basic validation
        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return response.error(c, "Invalid status", 400);
        }

        const order = await ordersService.updateStatus(id, status);
        if (!order) return response.notFound(c, "Order not found");
        return response.success(c, order);
    }
};
