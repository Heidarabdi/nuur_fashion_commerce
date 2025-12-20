import { describe, it, expect, beforeEach, beforeAll } from "bun:test";
import { setupTestContext } from "../../helpers/test-context";
import { productsService } from "../../../src/services/products.service";
import { db } from "../../../src/db";
import { products, categories, brands, productVariants, productImages } from "../../../src/db/schema";
import { factories } from "../../helpers/test-utils";

describe("productsService Unit Tests", () => {

    beforeAll(async () => {
        await setupTestContext();
    });

    beforeEach(async () => {
        await db.delete(productImages);
        await db.delete(productVariants);
        await db.delete(products);
        await db.delete(categories);
        await db.delete(brands);
    });

    it("should list all products with relations", async () => {
        const category = await factories.createCategory({ name: "Shoes" });
        const brand = await factories.createBrand({ name: "Nike" });
        await factories.createProduct({ categoryId: category.id, brandId: brand.id });

        const list = await productsService.getAll();

        expect(list).toHaveLength(1);
        expect(list[0].category?.name).toBe("Shoes");
        expect(list[0].brand?.name).toBe("Nike");
    });

    it("should get a product by slug with full relations", async () => {
        const category = await factories.createCategory();
        const product = await factories.createProduct({
            slug: "test-product",
            categoryId: category.id
        });

        // Add a variant and image
        await db.insert(productVariants).values({
            id: crypto.randomUUID(),
            productId: product.id,
            name: "Large",
            sku: "L-123"
        });

        await db.insert(productImages).values({
            id: crypto.randomUUID(),
            productId: product.id,
            url: "http://example.com/image.jpg"
        });

        const result = await productsService.getBySlug("test-product");

        expect(result).toBeDefined();
        expect(result?.id).toBe(product.id);
        expect(result?.variants).toHaveLength(1);
        expect(result?.images).toHaveLength(1);
    });

    it("should create a new product", async () => {
        const category = await factories.createCategory();
        const productData = {
            name: "New Product",
            description: "Nice description",
            price: 49.99,
            categoryId: category.id,
            status: "active" as const
        };

        const slug = "new-product";
        const result = await productsService.create(productData as any, slug);

        expect(result).toBeDefined();
        expect(result.name).toBe("New Product");
        expect(result.slug).toBe(slug);
        expect(result.price).toBe("49.99");
    });

    it("should update an existing product", async () => {
        const product = await factories.createProduct({ name: "Old Name" });

        const updated = await productsService.update(product.id, {
            name: "Updated Name",
            price: 59.99
        });

        expect(updated.name).toBe("Updated Name");
        expect(updated.price).toBe("59.99");
    });

    it("should delete (hard delete) a product", async () => {
        const product = await factories.createProduct();

        await productsService.delete(product.id);

        const result = await productsService.getById(product.id);
        expect(result).toBeUndefined();
    });
});
