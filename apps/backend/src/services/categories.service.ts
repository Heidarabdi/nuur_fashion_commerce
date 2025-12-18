import { db } from "../db";
import { categories, products } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";
import { createCategorySchema } from "@nuur-fashion-commerce/shared";
import { z } from "zod";

type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const categoriesService = {
    async getAll() {
        return await db.query.categories.findMany({
            orderBy: desc(categories.createdAt),
            with: {
                parent: true,
            }
        });
    },

    async getBySlug(slug: string) {
        return await db.query.categories.findFirst({
            where: eq(categories.slug, slug),
            with: {
                parent: true,
            }
        });
    },

    async getById(id: string) {
        return await db.query.categories.findFirst({
            where: eq(categories.id, id),
        });
    },

    async getProductsByCategory(slug: string) {
        const category = await this.getBySlug(slug);
        if (!category) return null;

        // This is a simple query, in reality we might want recursive CTE for subcategories
        return await db.query.products.findMany({
            where: eq(products.categoryId, category.id),
            with: {
                images: true,
                variants: true,
                brand: true
            }
        });
    },

    async create(data: CreateCategoryInput, slug: string) {
        const [newCategory] = await db.insert(categories).values({
            ...data,
            slug,
            isActive: data.isActive ?? true,
        }).returning();
        return newCategory;
    },

    async update(id: string, data: Partial<CreateCategoryInput>) {
        const [updatedCategory] = await db.update(categories)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(categories.id, id))
            .returning();
        return updatedCategory;
    },

    async delete(id: string) {
        const [deletedCategory] = await db.delete(categories)
            .where(eq(categories.id, id))
            .returning();
        return deletedCategory;
    }
};
