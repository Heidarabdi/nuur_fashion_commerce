import { seedCategories } from "./categories";
import { seedBrands } from "./brands";
import { seedProducts } from "./products";
import { seedUsers } from "./users";
import { seedOrders } from "./orders";
import { db } from "../index";
import {
    orderItems, orders, cartItems, carts, wishlistItems, wishlists,
    reviews, productImages, productVariants, products,
    addresses, categories, brands, users, sessions, accounts, verifications
} from "../schema";

/**
 * Main seed file - runs all seeds in order
 * Usage: bun run src/db/seed/seed.ts
 * 
 * To seed specific entities, run individual files:
 * - bun run src/db/seed/categories.ts
 * - bun run src/db/seed/brands.ts
 * - bun run src/db/seed/products.ts
 * - bun run src/db/seed/users.ts
 * - bun run src/db/seed/orders.ts
 */

const resetDatabase = async () => {
    console.log("🗑️  Clearing all data from database...\n");

    // Delete in reverse dependency order (children first)
    await db.delete(orderItems);
    console.log("  ✓ Cleared order_items");

    await db.delete(orders);
    console.log("  ✓ Cleared orders");

    await db.delete(cartItems);
    console.log("  ✓ Cleared cart_items");

    await db.delete(carts);
    console.log("  ✓ Cleared carts");

    await db.delete(wishlistItems);
    console.log("  ✓ Cleared wishlist_items");

    await db.delete(wishlists);
    console.log("  ✓ Cleared wishlists");

    await db.delete(reviews);
    console.log("  ✓ Cleared reviews");

    await db.delete(productImages);
    console.log("  ✓ Cleared product_images");

    await db.delete(productVariants);
    console.log("  ✓ Cleared product_variants");

    await db.delete(products);
    console.log("  ✓ Cleared products");

    await db.delete(addresses);
    console.log("  ✓ Cleared addresses");

    await db.delete(categories);
    console.log("  ✓ Cleared categories");

    await db.delete(brands);
    console.log("  ✓ Cleared brands");

    // Auth tables (cascade from users)
    await db.delete(sessions);
    console.log("  ✓ Cleared sessions");

    await db.delete(accounts);
    console.log("  ✓ Cleared accounts");

    await db.delete(verifications);
    console.log("  ✓ Cleared verifications");

    await db.delete(users);
    console.log("  ✓ Cleared users");

    console.log("\n✅ Database cleared!\n");
};

const runAllSeeds = async () => {
    console.log("🌱 Starting full database seed...\n");

    try {
        // Clear all data first
        await resetDatabase();

        // Order matters due to foreign key dependencies
        console.log("1️⃣ Seeding Categories...");
        await seedCategories();

        console.log("\n2️⃣ Seeding Brands...");
        await seedBrands();

        console.log("\n3️⃣ Seeding Users...");
        await seedUsers();

        console.log("\n4️⃣ Seeding Products (with variants & images)...");
        await seedProducts();

        console.log("\n5️⃣ Seeding Orders...");
        await seedOrders();

        console.log("\n✅ All seeds completed successfully!");
    } catch (error) {
        console.error("\n❌ Seed failed:", error);
        process.exit(1);
    }

    process.exit(0);
};

runAllSeeds();

