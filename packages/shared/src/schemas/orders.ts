import { z } from "zod";

export const createOrderSchema = z.object({
    addressId: z.string().uuid().optional(),

    // Customer Info
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),

    // Shipping Address
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().default("US"),
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
