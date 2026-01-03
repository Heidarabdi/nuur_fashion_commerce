import { z } from "zod";

export const brandSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().nullable(),
    logoUrl: z.string().url().nullable(),
    website: z.string().url().nullable(),
    isActive: z.boolean().default(true),
    createdAt: z.date(),
});

// Schema for creating a brand - only name is required
export const createBrandSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1).optional().or(z.literal('')), // Optional or empty - auto-generated if not provided
    description: z.string().optional().nullable(),
    logoUrl: z.string().url().optional().or(z.literal('')).nullable(),
    website: z.string().url().optional().or(z.literal('')).nullable(),
    isActive: z.coerce.boolean().optional().default(true),
});
