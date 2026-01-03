import { Context } from "hono";
import { brandsService } from "../services/brands.service";
import { response } from "../utils";
import slugify from "slugify";
import { createBrandSchema } from "@nuur-fashion-commerce/shared";

export const brandsController = {
    async getAll(c: Context) {
        const data = await brandsService.getAll();
        return response.success(c, data);
    },

    async getBySlug(c: Context) {
        const slug = c.req.param("slug");
        const data = await brandsService.getBySlug(slug);
        if (!data) return response.notFound(c, "Brand not found");
        return response.success(c, data);
    },

    async getById(c: Context) {
        const id = c.req.param("id");
        const data = await brandsService.getById(id);
        if (!data) return response.notFound(c, "Brand not found");
        return response.success(c, data);
    },

    async getProducts(c: Context) {
        const slug = c.req.param("slug");
        const data = await brandsService.getProductsByBrand(slug);
        if (!data) return response.notFound(c, "Brand not found");
        return response.success(c, data);
    },

    async create(c: Context) {
        try {
            const body = await c.req.json();
            const validation = createBrandSchema.safeParse(body);
            if (!validation.success) {
                return response.error(c, "Invalid input", 400, validation.error);
            }
            // Use provided slug if valid, otherwise auto-generate from name
            const slug = validation.data.slug || slugify(validation.data.name, { lower: true, strict: true });
            const brand = await brandsService.create(validation.data, slug);
            return response.created(c, brand);
        } catch (error) {
            return response.error(c, "Failed to create brand", 500, error);
        }
    },

    async update(c: Context) {
        try {
            const id = c.req.param("id");
            const body = await c.req.json();
            const validation = createBrandSchema.partial().safeParse(body);

            if (!validation.success) {
                return response.error(c, "Invalid input", 400, validation.error);
            }

            const brand = await brandsService.update(id, validation.data);
            if (!brand) return response.notFound(c, "Brand not found");
            return response.success(c, brand);
        } catch (error) {
            return response.error(c, "Failed to update brand", 500, error);
        }
    },

    async delete(c: Context) {
        try {
            const id = c.req.param("id");
            const brand = await brandsService.delete(id);
            if (!brand) return response.notFound(c, "Brand not found");
            return response.success(c, { success: true, id });
        } catch (error) {
            return response.error(c, "Failed to delete brand", 500, error);
        }
    }
};
