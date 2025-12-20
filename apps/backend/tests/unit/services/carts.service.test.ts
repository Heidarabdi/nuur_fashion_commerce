import { describe, it, expect, beforeEach, beforeAll } from "bun:test";
import { setupTestContext } from "../../helpers/test-context";
import { cartsService } from "../../../src/services/carts.service";
import { db } from "../../../src/db";
import { carts, cartItems, products, users } from "../../../src/db/schema";
import { factories } from "../../helpers/test-utils";

describe("cartsService Unit Tests", () => {

    beforeAll(async () => {
        await setupTestContext();
    });

    beforeEach(async () => {
        await db.delete(cartItems);
        await db.delete(carts);
        await db.delete(products);
        await db.delete(users);
    });

    it("should get or create a cart for a user", async () => {
        const user = await factories.createUser();

        const cart = await cartsService.getOrCreateCart(user.id);

        expect(cart).toBeDefined();
        expect(cart.userId).toBe(user.id);
        expect(cart.items).toHaveLength(0);

        // Should return same cart on second call
        const sameCart = await cartsService.getOrCreateCart(user.id);
        expect(sameCart.id).toBe(cart.id);
    });

    it("should add an item to the cart", async () => {
        const user = await factories.createUser();
        const product = await factories.createProduct();

        await cartsService.addItem(user.id, undefined, {
            productId: product.id,
            quantity: 2
        });

        const cart = await cartsService.getCart(user.id);
        expect(cart?.items).toHaveLength(1);
        expect(cart?.items[0].productId).toBe(product.id);
        expect(cart?.items[0].quantity).toBe(2);
    });

    it("should increment quantity when adding the same item", async () => {
        const user = await factories.createUser();
        const product = await factories.createProduct();

        await cartsService.addItem(user.id, undefined, { productId: product.id, quantity: 1 });
        await cartsService.addItem(user.id, undefined, { productId: product.id, quantity: 2 });

        const cart = await cartsService.getCart(user.id);
        expect(cart?.items).toHaveLength(1);
        expect(cart?.items[0].quantity).toBe(3);
    });

    it("should update item quantity", async () => {
        const user = await factories.createUser();
        const product = await factories.createProduct();
        const cart = await factories.createCart({ userId: user.id });
        const item = await factories.createCartItem(cart.id, product.id, { quantity: 1 });

        await cartsService.updateItem(cart.id, item.id, { quantity: 5 });

        const updatedCart = await cartsService.getCart(user.id);
        expect(updatedCart?.items[0].quantity).toBe(5);
    });

    it("should remove an item from the cart", async () => {
        const user = await factories.createUser();
        const product = await factories.createProduct();
        const cart = await factories.createCart({ userId: user.id });
        const item = await factories.createCartItem(cart.id, product.id);

        await cartsService.removeItem(cart.id, item.id);

        const updatedCart = await cartsService.getCart(user.id);
        expect(updatedCart?.items).toHaveLength(0);
    });

    it("should clear all items from the cart", async () => {
        const user = await factories.createUser();
        const productA = await factories.createProduct();
        const productB = await factories.createProduct();
        const cart = await factories.createCart({ userId: user.id });
        await factories.createCartItem(cart.id, productA.id);
        await factories.createCartItem(cart.id, productB.id);

        await cartsService.clearCart(cart.id);

        const updatedCart = await cartsService.getCart(user.id);
        expect(updatedCart?.items).toHaveLength(0);
    });
});
