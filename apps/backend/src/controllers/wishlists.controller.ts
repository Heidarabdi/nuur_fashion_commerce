import { Context } from "hono";
import { wishlistsService } from "../services/wishlists.service";
import { response } from "../utils/response";
import { addToWishlistSchema } from "@nuur-fashion-commerce/shared";

export const wishlistsController = {
    async getMyWishlist(c: Context) {
        const user = c.get("user");
        const wishlist = await wishlistsService.getForUser(user.id);
        return response.success(c, wishlist);
    },

    async addItem(c: Context) {
        const user = c.get("user");
        const body = await c.req.json();

        const validated = addToWishlistSchema.safeParse(body);
        if (!validated.success) {
            return response.error(c, "Invalid input", 400, validated.error);
        }

        const item = await wishlistsService.addItem(user.id, validated.data);
        return response.created(c, item);
    },

    async removeItem(c: Context) {
        const user = c.get("user");
        const productId = c.req.param("productId");

        const result = await wishlistsService.removeItem(user.id, productId);
        if (!result) return response.notFound(c, "Item not found in wishlist");

        return response.success(c, { success: true });
    }
};
