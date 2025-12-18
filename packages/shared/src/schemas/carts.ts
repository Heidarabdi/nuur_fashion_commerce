import { z } from "zod";

export const addToCartSchema = z.object({
    productId: z.string().uuid(),
    variantId: z.string().uuid().optional(),
    quantity: z.number().int().min(1).default(1),
    guestId: z.string().optional(), // For guest carts
});

export const updateCartItemSchema = z.object({
    quantity: z.number().int().min(1),
});

export const cartItemSchema = z.object({
    id: z.string(),
    productId: z.string(),
    variantId: z.string().nullable(),
    quantity: z.number(),
    price: z.number(), // Calculated at runtime
    name: z.string(),
    image: z.string().optional(),
});
