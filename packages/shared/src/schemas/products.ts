import { z } from "zod";

export const productStatusSchema = z.enum(["draft", "active", "archived"]);

export const productSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().nullable(),
    shortDescription: z.string().nullable(),
    price: z.string().transform((val) => parseFloat(val)), // Decimal comes as string often
    compareAtPrice: z.string().nullable().transform((val) => val ? parseFloat(val) : null),
    costPrice: z.string().nullable().transform((val) => val ? parseFloat(val) : null),
    sku: z.string().nullable(),
    barcode: z.string().nullable(),
    categoryId: z.string().uuid().nullable(),
    brandId: z.string().uuid().nullable(),
    status: productStatusSchema,
    isFeatured: z.boolean(),
    isNew: z.boolean(),
    weight: z.string().nullable().transform((val) => val ? parseFloat(val) : null),
    metaTitle: z.string().nullable(),
    metaDescription: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const createProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().min(0),
    categoryId: z.string().uuid().optional(),
    brandId: z.string().uuid().optional(),
    status: productStatusSchema.default("draft"),
});

export const updateProductSchema = createProductSchema.partial();
