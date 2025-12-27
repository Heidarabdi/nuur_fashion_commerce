import { describe, it, expect, beforeEach, beforeAll } from "bun:test";
import { setupTestContext } from "../helpers/test-context";
import { createTestApp, request, factories } from "../helpers/test-utils";
import { db } from "../../src/db";
import { reviews, products, users } from "../../src/db/schema";
import { eq } from "drizzle-orm";


describe("Reviews API Integration Tests", () => {
    let app: any;

    beforeAll(async () => {
        await setupTestContext();
        app = await createTestApp();
    });

    beforeEach(async () => {
        await db.delete(reviews);
        await db.delete(products);
        await db.delete(users);
    });

    it("should allow a logged-in user to create a review", async () => {
        // Arrange
        const user = await factories.createUser();
        const product = await factories.createProduct();

        const payload = {
            productId: product.id,
            rating: 5,
            title: "Great Product",
            content: "I really liked it."
        };

        // Act
        const res = await request.post(app, "/api/reviews", payload, user.id);

        // Assert
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data.success).toBe(true);
        expect(data.data.status).toBe("pending");
        expect(data.data.userId).toBe(user.id);
    });

    it("should block review creation if unauthorized", async () => {
        const product = await factories.createProduct();
        const payload = { productId: product.id, rating: 5 };

        const res = await request.post(app, "/api/reviews", payload); // No userId

        expect(res.status).toBe(401);
        const data = await res.json();
        expect(data.success).toBe(false);
        expect(data.message).toBe("Unauthorized");
    });

    it("should get approved reviews for a product (public)", async () => {
        const user = await factories.createUser();
        const product = await factories.createProduct();

        // Insert one approved and one pending
        await db.insert(reviews).values([
            {
                userId: user.id,
                productId: product.id,
                rating: 5,
                status: "approved",
                title: "Nice"
            },
            {
                userId: user.id,
                productId: product.id,
                rating: 1,
                status: "pending",
                title: "Bad"
            }
        ]);

        const res = await request.get(app, `/api/products/${product.id}/reviews`);


        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.success).toBe(true);
        expect(data.data).toHaveLength(1);
        expect(data.data[0].rating).toBe(5);
    });
});
