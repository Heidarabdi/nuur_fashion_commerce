import { db } from "../db";
import { carts, cartItems, products } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { addToCartSchema, updateCartItemSchema } from "@nuur-fashion-commerce/shared";
import { z } from "zod";

type AddToCartInput = z.infer<typeof addToCartSchema>;
type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

export const cartsService = {
    async getCart(userId?: string, guestId?: string) {
        if (!userId && !guestId) return null;

        const whereClause = userId
            ? eq(carts.userId, userId)
            : eq(carts.guestId, guestId!);

        const cart = await db.query.carts.findFirst({
            where: whereClause,
            with: {
                items: {
                    with: {
                        product: {
                            with: {
                                images: true
                            }
                        },
                        variant: true
                    }
                }
            }
        });

        return cart;
    },

    async getOrCreateCart(userId?: string, guestId?: string) {
        let cart = await this.getCart(userId, guestId);

        if (!cart) {
            const [newCart] = await db.insert(carts).values({
                userId,
                guestId,
                status: "active"
            }).returning();

            // Return structured object matching getCart query result shape
            return {
                ...newCart,
                items: []
            };
        }

        return cart;
    },

    async addItem(userId: string | undefined, guestId: string | undefined, data: AddToCartInput) {
        const cart = await this.getOrCreateCart(userId, guestId);

        // Check if item exists
        const existingItem = await db.query.cartItems.findFirst({
            where: and(
                eq(cartItems.cartId, cart.id),
                eq(cartItems.productId, data.productId),
                data.variantId ? eq(cartItems.variantId, data.variantId) : undefined
            )
        });

        if (existingItem) {
            await db.update(cartItems)
                .set({ quantity: existingItem.quantity + data.quantity })
                .where(eq(cartItems.id, existingItem.id));
        } else {
            await db.insert(cartItems).values({
                cartId: cart.id,
                productId: data.productId,
                variantId: data.variantId,
                quantity: data.quantity
            });
        }

        return await this.getCart(userId, guestId);
    },

    async updateItem(cartId: string, itemId: string, data: UpdateCartItemInput) {
        await db.update(cartItems)
            .set({ quantity: data.quantity })
            .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)));

        return true;
    },

    async removeItem(cartId: string, itemId: string) {
        await db.delete(cartItems)
            .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)));
        return true;
    },

    async clearCart(cartId: string) {
        await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
        return true;
    }
};
