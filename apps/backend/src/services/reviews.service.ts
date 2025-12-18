import { db } from "../db";
import { reviews, users } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { CreateReviewInput } from "@nuur-fashion-commerce/shared";

export const reviewsService = {
    async create(userId: string, data: CreateReviewInput) {
        // Check if user already reviewed this product? (Optional policy)

        const [review] = await db.insert(reviews).values({
            userId,
            productId: data.productId,
            rating: data.rating,
            title: data.title,
            content: data.content,
            status: "pending", // Default to pending moderation
        }).returning();
        return review;
    },

    async getByProduct(productId: string) {
        return await db.query.reviews.findMany({
            where: and(
                eq(reviews.productId, productId),
                eq(reviews.status, "approved")
            ),
            orderBy: desc(reviews.createdAt),
            with: {
                user: {
                    columns: {
                        firstName: true,
                        lastName: true,
                        avatarUrl: true
                    }
                }
            }
        });
    },

    // Admin methods
    async approve(id: string) {
        const [updated] = await db.update(reviews)
            .set({ status: "approved" })
            .where(eq(reviews.id, id))
            .returning();
        return updated;
    },

    async reject(id: string) {
        const [updated] = await db.update(reviews)
            .set({ status: "rejected" })
            .where(eq(reviews.id, id))
            .returning();
        return updated;
    }
};
