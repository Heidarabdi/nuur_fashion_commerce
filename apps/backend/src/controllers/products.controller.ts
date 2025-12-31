import { Context } from "hono";
import { productsService } from "../services/products.service";
import { response } from "../utils";
import slugify from "slugify";
import { createProductSchema } from "@nuur-fashion-commerce/shared";

export const productsController = {
    async getAll(c: Context) {
        try {
            // Parse query parameters for filtering
            const query = c.req.query();
            const filters = {
                categoryId: query.categoryId || query.category || undefined,
                brandId: query.brandId || query.brand || undefined,
                minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
                maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
                search: query.search || query.q || undefined,
                sortBy: query.sortBy as any || undefined,
                limit: query.limit ? parseInt(query.limit) : undefined,
                offset: query.offset ? parseInt(query.offset) : undefined,
            };

            const data = await productsService.getAll(filters);
            return response.success(c, data);
        } catch (error) {
            return response.error(c, "Failed to fetch products", 500, error);
        }
    },

    async getBySlug(c: Context) {
        try {
            const slug = c.req.param("slug");
            const data = await productsService.getBySlug(slug);
            if (!data) return response.notFound(c, "Product not found");
            return response.success(c, data);
        } catch (error) {
            return response.error(c, "Failed to fetch product", 500, error);
        }
    },

    async getById(c: Context) {
        try {
            const id = c.req.param("id");
            const data = await productsService.getById(id);
            if (!data) return response.notFound(c, "Product not found");
            return response.success(c, data);
        } catch (error) {
            return response.error(c, "Failed to fetch product", 500, error);
        }
    },

    async create(c: Context) {
        try {
            const body = await c.req.json();
            const validation = createProductSchema.safeParse(body);
            if (!validation.success) {
                return response.error(c, "Invalid input", 400, validation.error);
            }
            const slug = slugify(validation.data.name, { lower: true, strict: true });
            const product = await productsService.create(validation.data, slug);
            return response.created(c, product);
        } catch (error) {
            return response.error(c, "Failed to create product", 500, error);
        }
    },

    async update(c: Context) {
        try {
            const id = c.req.param("id");
            const body = await c.req.json();
            const validation = createProductSchema.partial().safeParse(body);

            if (!validation.success) {
                return response.error(c, "Invalid input", 400, validation.error);
            }

            const product = await productsService.update(id, validation.data);
            if (!product) return response.notFound(c, "Product not found");
            return response.success(c, product);
        } catch (error) {
            return response.error(c, "Failed to update product", 500, error);
        }
    },

    async delete(c: Context) {
        try {
            const id = c.req.param("id");
            const product = await productsService.delete(id);
            if (!product) return response.notFound(c, "Product not found");
            return response.success(c, { success: true, id });
        } catch (error) {
            return response.error(c, "Failed to delete product", 500, error);
        }
    }
};
