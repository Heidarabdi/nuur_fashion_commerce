import { describe, it, expect, beforeEach, beforeAll } from "bun:test";
import { setupTestContext } from "../../helpers/test-context";
import { reviewsService } from "../../../src/services/reviews.service";
import { db } from "../../../src/db";
import { reviews } from "../../../src/db/schema";
import { factories } from "../../helpers/test-utils";

describe("reviewsService Unit Tests", () => {

    beforeAll(async () => {
        // Ensure DB is initialized and migrations run before any test
        await setupTestContext();
    });

    beforeEach(async () => {
        // Clear tests table before each test for isolation
        await db.delete(reviews);
    });

    it("should create a review with 'pending' status by default", async () => {
        // Arrange
        const user = await factories.createUser();
        const product = await factories.createProduct();

        const reviewData = {
            productId: product.id,
            rating: 5,
            title: "Excellent Quality",
            content: "This fits perfectly and the material is premium."
        };

        // Act
        const result = await reviewsService.create(user.id, reviewData);

        // Assert
        expect(result).toBeDefined();
        expect(result.id).toBeTypeOf("string");
        expect(result.status).toBe("pending");
        expect(result.userId).toBe(user.id);
        expect(result.productId).toBe(product.id);
    });

    it("should allow an admin to approve a review", async () => {
        // Arrange
        const user = await factories.createUser();
        const product = await factories.createProduct();

        const [review] = await db.insert(reviews).values({
            userId: user.id,
            productId: product.id,
            rating: 4,
            status: "pending"
        }).returning();

        // Act
        const approved = await reviewsService.approve(review.id);

        // Assert
        expect(approved.status).toBe("approved");
    });
});
