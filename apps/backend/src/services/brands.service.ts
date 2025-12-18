import { db } from "../db";
import { brands, products } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { createBrandSchema } from "@nuur-fashion-commerce/shared";
import { z } from "zod";

type CreateBrandInput = z.infer<typeof createBrandSchema>;

export const brandsService = {
    async getAll() {
        return await db.query.brands.findMany({
            orderBy: desc(brands.createdAt),
        });
    },

    async getBySlug(slug: string) {
        return await db.query.brands.findFirst({
            where: eq(brands.slug, slug),
        });
    },

    async getById(id: string) {
        return await db.query.brands.findFirst({
            where: eq(brands.id, id),
        });
    },

    async getProductsByBrand(slug: string) {
        const brand = await this.getBySlug(slug);
        if (!brand) return null;

        return await db.query.products.findMany({
            where: eq(products.brandId, brand.id),
            with: {
                images: true,
                variants: true,
                category: true
            }
        });
    },

    async create(data: CreateBrandInput, slug: string) {
        const [newBrand] = await db.insert(brands).values({
            ...data,
            slug,
            isActive: data.isActive ?? true,
        }).returning();
        return newBrand;
    },

    async update(id: string, data: Partial<CreateBrandInput>) {
        const [updatedBrand] = await db.update(brands)
            .set({
                ...data,
                // updatedAt? Brands table doesn't have updatedAt in schema provided earlier?
                // Checking schema... "created_at default now".
                // I should verify if I added updatedAt to brands.
                // Looking at file 616 (brands.service), it queries brands.
                // Let's check brands schema view or assume it might not have it.
                // If I am unsafe, I will omit updatedAt.
                // Step 616 shows: `orderBy: desc(brands.createdAt)`.
                // Let's avoid updatedAt for now to be safe.
            })
            .where(eq(brands.id, id))
            .returning();
        return updatedBrand;
    },

    async delete(id: string) {
        const [deletedBrand] = await db.delete(brands)
            .where(eq(brands.id, id))
            .returning();
        return deletedBrand;
    }
};
