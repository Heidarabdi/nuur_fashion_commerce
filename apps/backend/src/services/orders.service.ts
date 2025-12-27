import { db } from "../db";
import { orders, orderItems, carts, cartItems } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { createOrderSchema } from "@nuur-fashion-commerce/shared";
import { z } from "zod";
import { cartsService } from "./carts.service";

type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const ordersService = {
    async createFromCart(userId: string | undefined, guestId: string | undefined, data: CreateOrderInput) {
        const cart = await cartsService.getCart(userId, guestId);

        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        // 1. Calculate Total (in real app, re-verify prices from DB, assume cart.items has fresh data)
        let totalAmount = 0;
        cart.items.forEach((item: any) => {
            // Price logic: usage of variant price vs product price
            // item.price is not stored in cartItems, we must take it from product relation
            // Basic logic:
            const price = item.product.price; // or variant price
            totalAmount += Number(price) * item.quantity;
        });

        // 2. Create Order
        // Using 'any' for tx to avoid complex Drizzle type inference issues during build
        return await db.transaction(async (tx: any) => {
            const [newOrder] = await tx.insert(orders).values({
                userId,
                addressId: data.addressId,
                totalAmount: totalAmount.toString(),
                status: "pending",
                guestId,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                street: data.street,
                city: data.city,
                state: data.state,
                zip: data.zip,
                country: data.country,
            }).returning();

            // 3. Create Order Items (Snapshot)
            const itemsToInsert = cart.items.map((item: any) => ({
                orderId: newOrder.id,
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                priceAtPurchase: item.product.price, // Snapshot!
            }));

            await tx.insert(orderItems).values(itemsToInsert);

            // 4. Mark Cart as Converted (or delete items)
            await tx.update(carts).set({ status: "converted" }).where(eq(carts.id, cart.id));
            // Optional: clear items to keep cart clean
            await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));

            return newOrder;
        });
    },

    async getMyOrders(userId: string) {
        return await db.query.orders.findMany({
            where: eq(orders.userId, userId),
            orderBy: desc(orders.createdAt),
            with: {
                items: {
                    with: {
                        product: true
                    }
                }
            }
        });
    },

    async getById(orderId: string, userId: string) {
        // Ensure user owns it
        const order = await db.query.orders.findFirst({
            where: eq(orders.id, orderId),
            with: {
                items: {
                    with: {
                        product: true
                    }
                }
            }
        });
        if (order && order.userId !== userId) return null;
        return order;
    },

    // Admin Methods
    async getAll() {
        return await db.query.orders.findMany({
            orderBy: desc(orders.createdAt),
            with: {
                user: true,
                items: true,
            }
        });
    },

    async updateStatus(id: string, status: "pending" | "processing" | "shipped" | "delivered" | "cancelled") {
        const [updatedOrder] = await db.update(orders)
            .set({
                status,
                updatedAt: new Date(),
                // If status is shipped/delivered/cancelled, update those timestamps too?
                // For now, simple status update.
            })
            .where(eq(orders.id, id))
            .returning();
        return updatedOrder;
    }
};
