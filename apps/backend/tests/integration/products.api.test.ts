import { describe, it, expect, beforeEach, beforeAll } from "bun:test";
import { setupTestContext } from "../helpers/test-context";
import { createTestApp, request, factories } from "../helpers/test-utils";
import { db } from "../../src/db";
import { products, categories, brands } from "../../src/db/schema";

describe("Products API Integration Tests", () => {
    let app: any;

    beforeAll(async () => {
        await setupTestContext();
        app = await createTestApp();
    });

    beforeEach(async () => {
        await db.delete(products);
        await db.delete(categories);
        await db.delete(brands);
    });

    it("should list active products", async () => {
        await factories.createProduct({ name: "Active Shoes", status: "active" });
        await factories.createProduct({ name: "Draft Shirt", status: "draft" });

        const res = await request.get(app, "/api/products");
        expect(res.status).toBe(200);
        const data = await res.json();
        // Depending on your API logic, it might list all or only active.
        // Usually /api/products is public and shows active.
        expect(data.data).toHaveLength(1);
        expect(data.data[0].name).toBe("Active Shoes");
    });

    it("should get product by slug", async () => {
        await factories.createProduct({ name: "Unique Product", slug: "unique-slug" });

        const res = await request.get(app, "/api/products/slug/unique-slug");
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.data.name).toBe("Unique Product");
    });

    it("should get products by brand", async () => {
        const brand = await factories.createBrand({ slug: "adidas" });
        await factories.createProduct({ brandId: brand.id, name: "Superstar" });

        const res = await request.get(app, "/api/brands/slug/adidas/products");

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.data).toHaveLength(1);
    });
});
