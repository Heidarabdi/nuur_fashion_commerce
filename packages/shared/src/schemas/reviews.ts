import { z } from "zod";

export const createReviewSchema = z.object({
    productId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    title: z.string().max(255).optional(),
    content: z.string().optional(),
});

export const updateReviewSchema = z.object({
    title: z.string().max(255).optional(),
    content: z.string().optional(),
    rating: z.number().int().min(1).max(5).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
