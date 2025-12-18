import { Context } from "hono";
import { cartsService } from "../services/carts.service";
import { response } from "../utils";
import { addToCartSchema, updateCartItemSchema } from "@nuur-fashion-commerce/shared";
import { getCookie } from "hono/cookie";

// Helper to extract IDs
const getContextIds = (c: Context) => {
    const user = c.get("user");
    const userId = user?.id; // From Auth Middleware
    // Frontend should send guestId in header or cookie usually, or body for first request
    // For now, let's look at a custom header or query param for simplicity in API
    const guestId = c.req.header("X-Guest-Id");
    return { userId, guestId };
};

export const cartsController = {
    async getCart(c: Context) {
        const { userId, guestId } = getContextIds(c);
        if (!userId && !guestId) return response.error(c, "No user or guest ID provided", 400);

        const data = await cartsService.getCart(userId, guestId);
        return response.success(c, data || { items: [] }); // Return empty if no cart yet
    },

    async addItem(c: Context) {
        const { userId, guestId } = getContextIds(c);
        const body = await c.req.json();

        // Allow guestId in body override if header missing
        const finalGuestId = guestId || body.guestId;

        if (!userId && !finalGuestId) return response.error(c, "No user or guest ID provided", 400);

        const validation = addToCartSchema.safeParse(body);
        if (!validation.success) {
            return response.error(c, "Validation failed", 400, validation.error.format());
        }

        const cart = await cartsService.addItem(userId, finalGuestId, validation.data);
        return response.success(c, cart);
    },

    async updateItem(c: Context) {
        const { userId, guestId } = getContextIds(c);
        const itemId = c.req.param("itemId");
        const body = await c.req.json();

        const validation = updateCartItemSchema.safeParse(body);
        if (!validation.success) {
            return response.error(c, "Validation failed", 400, validation.error.format());
        }

        // Security: Verify cart belongs to user/guest first? 
        // For MVP rely on service finding the cart by ID later or assuming ID valid if known
        // Proper way: Get Cart -> Check Ownership -> Update.
        // Simplifying:
        const cart = await cartsService.getCart(userId, guestId);
        if (!cart) return response.notFound(c, "Cart not found");

        await cartsService.updateItem(cart.id, itemId, validation.data);
        return response.success(c, null, "Item updated");
    },

    async removeItem(c: Context) {
        const { userId, guestId } = getContextIds(c);
        const itemId = c.req.param("itemId");

        const cart = await cartsService.getCart(userId, guestId);
        if (!cart) return response.notFound(c, "Cart not found");

        await cartsService.removeItem(cart.id, itemId);
        return response.success(c, null, "Item removed");
    }
};
