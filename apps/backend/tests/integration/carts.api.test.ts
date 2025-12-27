import { describe, it, expect, beforeEach, beforeAll } from "bun:test";
import { setupTestContext } from "../helpers/test-context";
import { createTestApp, request, factories } from "../helpers/test-utils";
import { db } from "../../src/db";
import { carts, cartItems, products, users } from "../../src/db/schema";

describe("Carts API Integration Tests", () => {
    let app: any;

    beforeAll(async () => {
        await setupTestContext();
        app = await createTestApp();
    });

    beforeEach(async () => {
        await db.delete(cartItems);
        await db.delete(carts);
        await db.delete(products);
        await db.delete(users);
    });

    it("should allow a guest to add and view items in their cart", async () => {
        const product = await factories.createProduct();
        const guestId = "guest_123";

        // Add Item
        const addRes = await request.post(app, "/api/carts/items", {
            productId: product.id,
            quantity: 1
        }, undefined, guestId);
        expect(addRes.status).toBe(200);

        // Get Cart
        const getRes = await request.get(app, "/api/carts", undefined, guestId);
        expect(getRes.status).toBe(200);
        const data = await getRes.json();
        expect(data.data.items).toHaveLength(1);
        expect(data.data.guestId).toBe(guestId);
    });

    it("should manage cart for authenticated users", async () => {
        const user = await factories.createUser();
        const product = await factories.createProduct();

        // Add Item
        await request.post(app, "/api/carts/items", {
            productId: product.id,
            quantity: 3
        }, user.id);

        // Get Cart
        const res = await request.get(app, "/api/carts", user.id);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.data.userId).toBe(user.id);
        expect(data.data.items[0].quantity).toBe(3);
    });

    it("should remove items from the cart", async () => {
        const user = await factories.createUser();
        const product = await factories.createProduct();
        const cart = await factories.createCart({ userId: user.id });
        const item = await factories.createCartItem(cart.id, product.id);

        const res = await request.delete(app, `/api/carts/items/${item.id}`, user.id);
        expect(res.status).toBe(200);

        const checkRes = await request.get(app, "/api/carts", user.id);
        const data = await checkRes.json();
        expect(data.data.items).toHaveLength(0);
    });
});
