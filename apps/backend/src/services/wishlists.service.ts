import { db } from "../db";
import { wishlists, wishlistItems, products } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { AddToWishlistInput } from "@nuur-fashion-commerce/shared";

export const wishlistsService = {
    async getForUser(userId: string) {
        // For now, assume single wishlist per user logic mostly
        let wishlist = await db.query.wishlists.findFirst({
            where: eq(wishlists.userId, userId),
            with: {
                items: {
                    with: {
                        product: true // Eager load products
                    },
                    orderBy: desc(wishlistItems.addedAt)
                }
            }
        });

        if (!wishlist) {
            // Auto-create default wishlist
            [wishlist] = await db.insert(wishlists).values({
                userId,
                name: "My Wishlist",
                isPublic: false
            }).returning();
            // Re-fetch to match structure (empty items) or just return custom object
            return { ...wishlist, items: [] as any[] };
        }

        return wishlist;
    },

    async addItem(userId: string, data: AddToWishlistInput) {
        let wishlistId = data.wishlistId;

        if (!wishlistId) {
            const defaultWishlist = await this.getForUser(userId);
            wishlistId = defaultWishlist!.id;
        }

        const finalWishlistId = wishlistId!;

        // Check if item exists
        const existing = await db.query.wishlistItems.findFirst({
            where: and(
                eq(wishlistItems.wishlistId, finalWishlistId),
                eq(wishlistItems.productId, data.productId)
            )
        });

        if (existing) return existing;

        const [item] = await db.insert(wishlistItems).values({
            wishlistId: finalWishlistId,
            productId: data.productId
        }).returning();

        return item;
    },

    async removeItem(userId: string, productId: string) {
        // Find user's wishlist
        const wishlist = await db.query.wishlists.findFirst({
            where: eq(wishlists.userId, userId)
        });

        if (!wishlist) return null;

        const [deleted] = await db.delete(wishlistItems)
            .where(and(
                eq(wishlistItems.wishlistId, wishlist.id),
                eq(wishlistItems.productId, productId)
            ))
            .returning();

        return deleted;
    }
};
