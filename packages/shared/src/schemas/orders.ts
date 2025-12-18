import { z } from "zod";

export const createOrderSchema = z.object({
    addressId: z.string().uuid(),
    // In a real app, we might accept cartId explicitly or infer active cart
});

export const orderSchema = z.object({
    id: z.string(),
    status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
    totalAmount: z.number(),
    createdAt: z.date(),
    items: z.array(z.object({
        id: z.string(),
        quantity: z.number(),
        price: z.number(),
        productName: z.string(),
    })).optional()
});
