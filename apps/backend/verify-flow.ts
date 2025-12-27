
import { db } from "./src/db";
import { carts, cartItems, products } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function verifyShoppingFlow() {
    console.log("🔍 Starting Shopping Flow Verification...");

    // 1. Create a dummy Guest ID
    const guestId = "test-guest-" + crypto.randomUUID();
    console.log(`👤 Using Guest ID: ${guestId}`);

    // 2. Fetch or Create a random product to add
    let product = await db.query.products.findFirst();
    if (!product) {
        console.log("⚠️ No products found. Seeding dummy product...");
        [product] = await db.insert(products).values({
            name: "Test T-Shirt",
            slug: "test-t-shirt-" + crypto.randomUUID(),
            description: "A test product",
            price: "29.99",
            sku: "TEST-SKU-" + crypto.randomUUID(),
            status: "active"
        }).returning();
    }
    console.log(`📦 Found Product: ${product.name} ($${product.price})`);

    // 3. Create a Cart
    console.log("🛒 Creating Cart...");
    const [cart] = await db.insert(carts).values({
        guestId,
        status: "active"
    }).returning();
    console.log(`✅ Cart Created: ${cart.id}`);

    // 4. Add Item to Cart
    console.log("➕ Adding Item...");
    await db.insert(cartItems).values({
        cartId: cart.id,
        productId: product.id,
        quantity: 2
    });
    console.log("✅ Item Added");

    // 5. Query Cart with Relations (Simulate GET /carts)
    const fetchedCart = await db.query.carts.findFirst({
        where: eq(carts.id, cart.id),
        with: {
            items: {
                with: {
                    product: true
                }
            }
        }
    });

    if (!fetchedCart) throw new Error("Cart not found after creation");

    console.log("\n--- CART SNAPSHOT ---");
    console.log(`ID: ${fetchedCart.id}`);
    console.log(`Items: ${fetchedCart.items.length}`);
    fetchedCart.items.forEach((item: any) => {
        console.log(` - ${item.quantity}x ${item.product.name}`);
    });
    console.log("---------------------\n");

    // Clean up
    console.log("🧹 Cleaning up...");
    await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
    await db.delete(carts).where(eq(carts.id, cart.id));
    console.log("✨ Verification Complete!");
    process.exit(0);
}

verifyShoppingFlow().catch(console.error);
