import { describe, it, expect, beforeEach, beforeAll } from "bun:test";
import { setupTestContext } from "../../helpers/test-context";
import { ordersService } from "../../../src/services/orders.service";
import { cartsService } from "../../../src/services/carts.service";
import { db } from "../../../src/db";
import { orders, orderItems, carts, cartItems, products, users, addresses } from "../../../src/db/schema";
import { factories } from "../../helpers/test-utils";
import { eq } from "drizzle-orm";


describe("ordersService Unit Tests", () => {

    beforeAll(async () => {
        await setupTestContext();
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

    it("should create an order from a cart", async () => {
        // Arrange
        const user = await factories.createUser();
        const address = await factories.createAddress(user.id);
        const product = await factories.createProduct({ price: "100.00" });

        // Setup cart with item
        await cartsService.addItem(user.id, undefined, {
            productId: product.id,
            quantity: 2
        });

        // Act
        const order = await ordersService.createFromCart(user.id, undefined, {
            addressId: address.id,
            email: user.email,
            firstName: user.name?.split(' ')[0] || 'John',
            lastName: user.name?.split(' ')[1] || 'Doe',
            street: address.street,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country,
        });

        // Assert
        process.stdout.write(`ORDER TOTAL: ${order.totalAmount}\n`);
        expect(order).toBeDefined();
        expect(order.userId).toBe(user.id);
        expect(Number(order.totalAmount)).toBe(200.00);
        expect(order.status).toBe("pending");

        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
        process.stdout.write(`ORDER ITEMS COUNT: ${items.length}\n`);
        expect(items).toHaveLength(1);

        expect(items[0].priceAtPurchase).toBe("100.00");
        expect(items[0].quantity).toBe(2);

        // Verify cart is cleared
        const cart = await cartsService.getCart(user.id);
        expect(cart?.status).toBe("converted");
        expect(cart?.items).toHaveLength(0);
    });

    it("should fail to create an order if cart is empty", async () => {
        const user = await factories.createUser();
        const address = await factories.createAddress(user.id);

        expect(
            ordersService.createFromCart(user.id, undefined, {
                addressId: address.id,
                email: user.email,
                firstName: 'Test',
                lastName: 'User',
                street: address.street,
                city: address.city,
                state: address.state,
                zip: address.zip,
                country: address.country,
            })
        ).rejects.toThrow("Cart is empty");
    });

    it("should fetch my orders", async () => {
        const user = await factories.createUser();
        await factories.createOrder(user.id);
        await factories.createOrder(user.id);

        const myOrders = await ordersService.getMyOrders(user.id);
        expect(myOrders).toHaveLength(2);
    });

    it("should allow an admin to update order status", async () => {
        const user = await factories.createUser();
        const order = await factories.createOrder(user.id);

        const updated = await ordersService.updateStatus(order.id, "shipped");
        expect(updated.status).toBe("shipped");
    });
});
