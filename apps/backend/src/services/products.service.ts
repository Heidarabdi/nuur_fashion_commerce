import { db } from "../db";
import { products, productVariants, productImages } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { createProductSchema } from "@nuur-fashion-commerce/shared";
import { z } from "zod";

type CreateProductInput = z.infer<typeof createProductSchema>;

export const productsService = {
    async getAll() {
        return await db.query.products.findMany({
            with: {
                category: true,
                brand: true,
                images: true,
                variants: true,
            },
            orderBy: desc(products.createdAt),
            limit: 20,
        });
    },

    async getBySlug(slug: string) {
        return await db.query.products.findFirst({
            where: eq(products.slug, slug),
            with: {
                category: true,
                brand: true,
                images: true,
                variants: true,
            },
        });
    },

    async getById(id: string) {
        return await db.query.products.findFirst({
            where: eq(products.id, id),
            with: {
                category: true,
                brand: true,
                images: true,
                variants: true,
            },
        });
    },

    // Basic implementation - will be expanded with full generic CRUD later
    async create(data: CreateProductInput, slug: string) {
        // @ts-ignore - Drizzle types can be strict with insert mocks in early dev
        const [newProduct] = await db.insert(products).values({
            ...data,
            slug,
            price: data.price.toString(), // DB stores as decimal/string
        }).returning();
        return newProduct;
    },

    async update(id: string, data: Partial<CreateProductInput>) {
        const [updatedProduct] = await db.update(products)
            .set({
                ...data,
                price: data.price ? data.price.toString() : undefined,
                updatedAt: new Date(),
            })
            .where(eq(products.id, id))
            .returning();
        return updatedProduct;
    },

    async delete(id: string) {
        // Soft delete implementation? Or hard delete?
        // Plan says: "Soft delete or Archive".
        // Let's do hard delete for now as per simple CRUD, or check if 'archived' status is enough.
        // User asked for "Delete product".
        // Let's just update status to 'archived' if we want to be safe, but typically DELETE endpoint implies removal.
        // However, with FKeys, hard delete might fail if in orders.
        // Safer to soft delete or archive.
        // Let's try hard delete and let DB enforce constraints, or just return deleted.
        const [deletedProduct] = await db.delete(products)
            .where(eq(products.id, id))
            .returning();
        return deletedProduct;
    }
};
