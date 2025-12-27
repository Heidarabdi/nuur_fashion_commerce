const BASE_URL = "http://localhost:3000/api";

// This script verifies the core services used by the Admin Dashboard.
// It interacts with the services directly to ensure logic is correct
// regardless of the authentication layer.

import { ordersService } from "../src/services/orders.service";
import { productsService } from "../src/services/products.service";
import { categoriesService } from "../src/services/categories.service";
import { db } from "../src/db";
import { users, orders } from "../src/db/schema";
import { eq } from "drizzle-orm";

const verifyServices = async () => {
    console.log("Verifying Services for Admin...");

    // 1. Verify/Create Admin User
    const [admin] = await db.select().from(users).where(eq(users.role, "admin")).limit(1);
    if (!admin) {
        console.error("No admin user found. Run seed-admin.ts first.");
        return;
    }
    console.log("Admin found:", admin.email);

    // 2. Test Catalog Create
    console.log("Testing Product Create...");
    const timestamp = Date.now();
    const catSlug = `admin-test-cat-${timestamp}`;
    const prodSlug = `admin-product-${timestamp}`;

    const cat = await categoriesService.create({
        name: `Admin Test Cat ${timestamp}`,
        description: "Test",
        parentId: null,
        position: 0,
        isActive: true
    }, catSlug);

    const product = await productsService.create({
        name: `Admin Product ${timestamp}`,
        price: 100,
        categoryId: cat.id,
        description: "Test desc",
        status: "draft"
    }, prodSlug);
    console.log("Product created:", product.name);

    // 3. Test Update
    console.log("Testing Product Update...");
    const updated = await productsService.update(product.id, { price: 150 });
    // Drizzle returns decimal as string
    if (Number(updated.price) !== 150) {
        console.log("Price update check:", updated.price);
    }
    console.log("Product updated:", updated.price);

    // 4. Test Orders Admin
    console.log("Testing Orders Admin...");
    const allOrders = await ordersService.getAll();
    console.log(`Fetched ${allOrders.length} orders.`);

    if (allOrders.length > 0) {
        const orderId = allOrders[0].id;
        console.log("Updating order status...", orderId);
        const updatedOrder = await ordersService.updateStatus(orderId, "processing");
        console.log("New Status:", updatedOrder.status);
    } else {
        console.log("No orders to update.");
    }

    console.log("Verification Complete!");
};

verifyServices();
