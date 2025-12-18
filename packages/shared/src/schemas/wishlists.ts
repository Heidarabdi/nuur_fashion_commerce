import { z } from "zod";

export const createWishlistSchema = z.object({
    name: z.string().min(1).max(100).default("My Wishlist"),
    isPublic: z.boolean().default(false),
});

export const addToWishlistSchema = z.object({
    productId: z.string().uuid(),
    wishlistId: z.string().uuid().optional(), // If not provided, add to default
});

export type CreateWishlistInput = z.infer<typeof createWishlistSchema>;
export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>;
