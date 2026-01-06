import { db } from "../db";
import { products, productVariants, productImages, productCategories } from "../db/schema";
import { eq, desc, asc, and, gte, lte, like, or, sql, inArray } from "drizzle-orm";
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

        // Category filter - now uses junction table
        // First get product IDs that belong to this category
        if (filters?.categoryId) {
            const categoryProducts = await db
                .select({ productId: productCategories.productId })
                .from(productCategories)
                .where(eq(productCategories.categoryId, filters.categoryId));

            const productIdsInCategory = categoryProducts.map((p: { productId: string }) => p.productId);

            // If no products in this category, return empty array early
            if (productIdsInCategory.length === 0) {
                return [];
            }

            conditions.push(inArray(products.id, productIdsInCategory));
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
                productCategories: {
                    with: {
                        category: true,
                    }
                },
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

    // Create product with images
    async create(data: CreateProductInput & { images?: string[] }, slug: string) {
        const { images, ...productData } = data;

        // @ts-ignore - Drizzle types can be strict with insert mocks in early dev
        const [newProduct] = await db.insert(products).values({
            ...productData,
            slug,
            price: productData.price.toString(), // DB stores as decimal/string
        }).returning();

        // Insert images if provided
        if (images && images.length > 0) {
            const imageRecords = images.map((url, index) => ({
                productId: newProduct.id,
                url,
                position: index,
            }));
            await db.insert(productImages).values(imageRecords);
        }

        // Return product with images
        return this.getById(newProduct.id);
    },

    // Update product with images
    async update(id: string, data: Partial<CreateProductInput> & { images?: string[] }) {
        const { images, ...productData } = data;

        const [updatedProduct] = await db.update(products)
            .set({
                ...productData,
                price: productData.price ? productData.price.toString() : undefined,
                updatedAt: new Date(),
            })
            .where(eq(products.id, id))
            .returning();

        if (!updatedProduct) return null;

        // Update images if provided
        if (images !== undefined) {
            // Delete existing images
            await db.delete(productImages).where(eq(productImages.productId, id));

            // Insert new images
            if (images.length > 0) {
                const imageRecords = images.map((url, index) => ({
                    productId: id,
                    url,
                    position: index,
                }));
                await db.insert(productImages).values(imageRecords);
            }
        }

        // Return product with images
        return this.getById(id);
    },

    async delete(id: string) {
        // Delete images first (foreign key constraint)
        await db.delete(productImages).where(eq(productImages.productId, id));

        const [deletedProduct] = await db.delete(products)
            .where(eq(products.id, id))
            .returning();
        return deletedProduct;
    }
};
