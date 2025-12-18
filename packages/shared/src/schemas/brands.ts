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

export const createBrandSchema = brandSchema.pick({
    name: true,
    description: true,
    website: true,
    isActive: true,
}).extend({
    logoUrl: z.string().url().optional(),
});
