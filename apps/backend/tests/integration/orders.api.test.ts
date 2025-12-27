import { describe, it, expect, beforeEach, beforeAll } from "bun:test";
import { setupTestContext } from "../helpers/test-context";
import { createTestApp, request, factories } from "../helpers/test-utils";
import { db } from "../../src/db";
import * as schema from "../../src/db/schema";
import { orders, orderItems, carts, cartItems, products, users, addresses } from "../../src/db/schema";


describe("Orders API Integration Tests", () => {
    let app: any;

    beforeAll(async () => {
        await setupTestContext();
        app = await createTestApp();
    });

    beforeEach(async () => {
        await db.delete(orderItems);
        await db.delete(orders);
        await db.delete(cartItems);
        await db.delete(carts);
        await db.delete(products);
        await db.delete(addresses);
        await db.delete(users);
    });

    it("should place an order from existing cart", async () => {
        // Arrange
        const user = await factories.createUser();
        const address = await factories.createAddress(user.id);
        const product = await factories.createProduct({ price: "50.00" });

        // Add to cart via API first! (Full Integration)
        await request.post(app, "/api/carts/items", {
            productId: product.id,
            quantity: 2
        }, user.id);

        // Act - Place Order
        const res = await request.post(app, "/api/orders", {
            addressId: address.id
        }, user.id);

        // Assert
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data.success).toBe(true);
        expect(data.data.totalAmount).toBe("100.00");
    });

    it("should fetch my orders list", async () => {
        const user = await factories.createUser();
        const product = await factories.createProduct();
        const order = await factories.createOrder(user.id);

        // Add an order item
        await db.insert(schema.orderItems).values({
            id: crypto.randomUUID(),
            orderId: order.id,
            productId: product.id,
            quantity: 1,
            priceAtPurchase: "10.00"
        });

        const res = await request.get(app, "/api/orders", user.id);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.data).toHaveLength(1);
    });

});
