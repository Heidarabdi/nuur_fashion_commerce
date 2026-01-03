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

// Schema for creating a category - only name is required
export const createCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1).optional().or(z.literal('')), // Optional or empty - auto-generated if not provided
    description: z.string().optional().nullable(),
    imageUrl: z.string().url().optional().or(z.literal('')).nullable(),
    parentId: z.string().uuid().optional().nullable(),
    position: z.coerce.number().int().optional().default(0),
    isActive: z.coerce.boolean().optional().default(true),
});
