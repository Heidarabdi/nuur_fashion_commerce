import { db } from "../db";
import { products, productVariants, productImages } from "../db/schema";
import { eq, desc, asc, and, gte, lte, like, or, sql } from "drizzle-orm";
import { createProductSchema } from "@nuur-fashion-commerce/shared";
import { z } from "zod";

type CreateProductInput = z.infer<typeof createProductSchema>;

// Filter options for products
interface ProductFilters {
    categoryId?: string;
    brandId?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'oldest' | 'popular' | 'name-asc' | 'name-desc';
    limit?: number;
    offset?: number;
}

export const productsService = {
    async getAll(filters?: ProductFilters) {
        const conditions = [];

        // Category filter
        if (filters?.categoryId) {
            conditions.push(eq(products.categoryId, filters.categoryId));
        }

        // Brand filter
        if (filters?.brandId) {
            conditions.push(eq(products.brandId, filters.brandId));
        }

        // Price range filter
        if (filters?.minPrice !== undefined) {
            conditions.push(gte(products.price, filters.minPrice.toString()));
        }
        if (filters?.maxPrice !== undefined) {
            conditions.push(lte(products.price, filters.maxPrice.toString()));
        }

        // Search filter (name or description)
        if (filters?.search) {
            const searchTerm = `%${filters.search}%`;
            conditions.push(
                or(
                    like(products.name, searchTerm),
                    like(products.description, searchTerm)
                )
            );
        }

        // Note: Status filter disabled for now since seed data uses 'draft'
        // Re-enable when product publishing workflow is implemented
        // conditions.push(eq(products.status, 'active'));

        // Determine sort order
        let orderBy;
        switch (filters?.sortBy) {
            case 'price-asc':
                orderBy = asc(products.price);
                break;
            case 'price-desc':
                orderBy = desc(products.price);
                break;
            case 'oldest':
                orderBy = asc(products.createdAt);
                break;
            case 'name-asc':
                orderBy = asc(products.name);
                break;
            case 'name-desc':
                orderBy = desc(products.name);
                break;
            case 'popular':
                // For now, sort by rating or default to newest
                orderBy = desc(products.createdAt);
                break;
            case 'newest':
            default:
                orderBy = desc(products.createdAt);
        }

        return await db.query.products.findMany({
            where: conditions.length > 0 ? and(...conditions) : undefined,
            with: {
                category: true,
                brand: true,
                images: true,
                variants: true,
            },
            orderBy,
            limit: filters?.limit || 50,
            offset: filters?.offset || 0,
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
        const [deletedProduct] = await db.delete(products)
            .where(eq(products.id, id))
            .returning();
        return deletedProduct;
    }
};
