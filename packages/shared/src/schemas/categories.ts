import { z } from "zod";

export const categorySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().nullable(),
    imageUrl: z.string().url().nullable(),
    parentId: z.string().uuid().nullable(),
    position: z.number().int().default(0),
    isActive: z.boolean().default(true),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const createCategorySchema = categorySchema.pick({
    name: true,
    description: true,
    parentId: true,
    position: true,
    isActive: true,
}).extend({
    imageUrl: z.string().url().optional(),
});
