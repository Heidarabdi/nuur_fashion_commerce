import { db } from "../../src/db";
import * as schema from "../../src/db/schema";
import { randomUUID } from "node:crypto";

/**
 * Common data factories for tests.
 * These assume the 'db' is already linked to a PGlite instance via setupTestContext().
 */
export const factories = {
    async createUser(overrides = {}) {
        const [user] = await db.insert(schema.users).values({
            id: randomUUID(),
            email: `test_${randomUUID()}@example.com`,
            name: "Test User",
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...overrides,
        }).returning();
        return user;
    },

    async createProduct(overrides = {}) {
        const [product] = await db.insert(schema.products).values({
            id: randomUUID(),
            name: "Test Product",
            slug: `test-product-${randomUUID()}`,
            price: "99.99",
            status: "active",
            ...overrides,
        }).returning();
        return product;
    },

    async createCategory(overrides = {}) {
        const [category] = await db.insert(schema.categories).values({
            id: randomUUID(),
            name: "Test Category",
            slug: `test-category-${randomUUID()}`,
            ...overrides,
        }).returning();
        return category;
    },

    async createCart(overrides = {}) {
        const [cart] = await db.insert(schema.carts).values({
            id: randomUUID(),
            status: "active",
            ...overrides,
        }).returning();
        return cart;
    },

    async createCartItem(cartId: string, productId: string, overrides = {}) {
        const [item] = await db.insert(schema.cartItems).values({
            id: randomUUID(),
            cartId,
            productId,
            quantity: 1,
            ...overrides,
        }).returning();
        return item;
    },

    async createBrand(overrides = {}) {
        const [brand] = await db.insert(schema.brands).values({
            id: randomUUID(),
            name: "Test Brand",
            slug: `test-brand-${randomUUID()}`,
            ...overrides,
        }).returning();
        return brand;
    },

    async createAddress(userId: string, overrides = {}) {
        const [address] = await db.insert(schema.addresses).values({
            id: randomUUID(),
            userId,
            street: "123 Main St",
            city: "Test City",
            state: "TS",
            zip: "12345",
            country: "USA",
            ...overrides,
        }).returning();
        return address;
    },

    async createOrder(userId: string, overrides = {}) {
        const [order] = await db.insert(schema.orders).values({
            id: randomUUID(),
            userId,
            totalAmount: "0.00",
            status: "pending",
            ...overrides,
        }).returning();
        return order;
    }
};

/**
 * Helper to create a test instance of the Hono app.
 */
export async function createTestApp() {
    const { default: app } = await import("../../src/app");
    return app;
}

/**
 * Request helper for Hono app.request
 */
export const request = {
    async get(app: any, path: string, userId?: string, guestId?: string) {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (userId) headers["X-Test-User-Id"] = userId;
        if (guestId) headers["X-Guest-Id"] = guestId;
        return app.request(path, { method: "GET", headers });
    },
    async post(app: any, path: string, body: any, userId?: string, guestId?: string) {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (userId) headers["X-Test-User-Id"] = userId;
        if (guestId) headers["X-Guest-Id"] = guestId;
        return app.request(path, { method: "POST", headers, body: JSON.stringify(body) });
    },
    async patch(app: any, path: string, body: any, userId?: string, guestId?: string) {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (userId) headers["X-Test-User-Id"] = userId;
        if (guestId) headers["X-Guest-Id"] = guestId;
        return app.request(path, { method: "PATCH", headers, body: JSON.stringify(body) });
    },
    async delete(app: any, path: string, userId?: string, guestId?: string) {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (userId) headers["X-Test-User-Id"] = userId;
        if (guestId) headers["X-Guest-Id"] = guestId;
        return app.request(path, { method: "DELETE", headers });
    }
};

