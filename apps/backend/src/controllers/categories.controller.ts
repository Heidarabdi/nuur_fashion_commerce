import { Context } from "hono";
import { categoriesService } from "../services/categories.service";
import { response } from "../utils";
import slugify from "slugify";
import { createCategorySchema } from "@nuur-fashion-commerce/shared";

export const categoriesController = {
    async getAll(c: Context) {
        const data = await categoriesService.getAll();
        return response.success(c, data);
    },

    async getBySlug(c: Context) {
        const slug = c.req.param("slug");
        const data = await categoriesService.getBySlug(slug);
        if (!data) return response.notFound(c, "Category not found");
        return response.success(c, data);
    },

    async getById(c: Context) {
        const id = c.req.param("id");
        const data = await categoriesService.getById(id);
        if (!data) return response.notFound(c, "Category not found");
        return response.success(c, data);
    },

    async getProducts(c: Context) {
        const slug = c.req.param("slug");
        const data = await categoriesService.getProductsByCategory(slug);
        if (!data) return response.notFound(c, "Category not found");
        return response.success(c, data);
    },

    async create(c: Context) {
        try {
            const body = await c.req.json();
            const validation = createCategorySchema.safeParse(body);
            if (!validation.success) {
                return response.error(c, "Invalid input", 400, validation.error);
            }
            const slug = slugify(validation.data.name, { lower: true, strict: true });
            const category = await categoriesService.create(validation.data, slug);
            return response.created(c, category);
        } catch (error) {
            return response.error(c, "Failed to create category", 500, error);
        }
    },

    async update(c: Context) {
        try {
            const id = c.req.param("id");
            const body = await c.req.json();
            const validation = createCategorySchema.partial().safeParse(body); // Use partial for updates

            if (!validation.success) {
                return response.error(c, "Invalid input", 400, validation.error);
            }

            const category = await categoriesService.update(id, validation.data);
            if (!category) return response.notFound(c, "Category not found");
            return response.success(c, category);
        } catch (error) {
            return response.error(c, "Failed to update category", 500, error);
        }
    },

    async delete(c: Context) {
        try {
            const id = c.req.param("id");
            const category = await categoriesService.delete(id);
            if (!category) return response.notFound(c, "Category not found");
            return response.success(c, { success: true, id });
        } catch (error) {
            return response.error(c, "Failed to delete category", 500, error);
        }
    }
};
