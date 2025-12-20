import { describe, it, expect, beforeEach, beforeAll } from "bun:test";
import { setupTestContext } from "../../helpers/test-context";
import { brandsService } from "../../../src/services/brands.service";
import { categoriesService } from "../../../src/services/categories.service";
import { db } from "../../../src/db";
import { brands, categories, products } from "../../../src/db/schema";
import { factories } from "../../helpers/test-utils";

describe("Catalog Services Unit Tests", () => {

    beforeAll(async () => {
        await setupTestContext();
    });

    beforeEach(async () => {
        await db.delete(products);
        await db.delete(brands);
        await db.delete(categories);
    });

    describe("brandsService", () => {
        it("should list all brands", async () => {
            await factories.createBrand({ name: "Brand A" });
            await factories.createBrand({ name: "Brand B" });

            const list = await brandsService.getAll();
            expect(list).toHaveLength(2);
        });

        it("should get brand by slug", async () => {
            const brand = await factories.createBrand({ slug: "test-brand" });
            const result = await brandsService.getBySlug("test-brand");
            expect(result?.id).toBe(brand.id);
        });

        it("should list products by brand", async () => {
            const brand = await factories.createBrand({ slug: "nike" });
            await factories.createProduct({ brandId: brand.id, name: "Air Max" });
            await factories.createProduct({ brandId: brand.id, name: "Jordan" });

            const productsResult = await brandsService.getProductsByBrand("nike");
            expect(productsResult).toHaveLength(2);
            const names = productsResult?.map(p => p.name) || [];
            expect(names).toContain("Jordan");
            expect(names).toContain("Air Max");
        });

    });

    describe("categoriesService", () => {
        it("should get all categories with parents", async () => {
            const parent = await factories.createCategory({ name: "Parent" });
            await factories.createCategory({ name: "Child", parentId: parent.id });

            const list = await categoriesService.getAll();
            expect(list).toHaveLength(2);
            const child = list.find(c => c.name === "Child");
            expect(child?.parent?.name).toBe("Parent");
        });

        it("should get products by category", async () => {
            const category = await factories.createCategory({ slug: "electronics" });
            await factories.createProduct({ categoryId: category.id, name: "Laptop" });

            const productsResult = await categoriesService.getProductsByCategory("electronics");
            expect(productsResult).toHaveLength(1);
            expect(productsResult?.[0].name).toBe("Laptop");
        });

        it("should update a category", async () => {
            const category = await factories.createCategory({ name: "Old Name" });
            const updated = await categoriesService.update(category.id, { name: "New Name" });
            expect(updated.name).toBe("New Name");
        });
    });
});
