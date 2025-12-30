import { db } from "../index";
import { orders, orderItems, users, products, productVariants } from "../schema";
import { eq, ne } from "drizzle-orm";

export const seedOrders = async () => {
    console.log("  Creating sample orders...");

    // Get regular users (not admin)
    const regularUsers = await db.query.users.findMany({
        where: ne(users.role, "admin")
    });

    if (regularUsers.length === 0) {
        console.log("  ⚠ No regular users found. Skipping order seeding.");
        return;
    }

    // Get some products with variants
    const allProducts = await db.query.products.findMany({
        with: {
            variants: true
        },
        limit: 5
    });

    if (allProducts.length === 0) {
        console.log("  ⚠ No products found. Skipping order seeding.");
        return;
    }

    // Check if orders exist
    const existingOrders = await db.query.orders.findMany({ limit: 1 });
    if (existingOrders.length > 0) {
        console.log("  ⏭ Orders already exist in database");
        return;
    }

    const statuses: ("pending" | "processing" | "shipped" | "delivered")[] = ["pending", "processing", "shipped", "delivered"];

    for (let i = 0; i < regularUsers.length; i++) {
        const user = regularUsers[i];
        const numOrders = Math.floor(Math.random() * 3) + 1; // 1-3 orders per user

        for (let j = 0; j < numOrders; j++) {
            // Random products for this order
            const numItems = Math.floor(Math.random() * 3) + 1;
            const orderProducts = allProducts.slice(0, numItems);

            // Calculate total
            let total = 0;
            const items: { productId: string; variantId: string | null; quantity: number; price: number }[] = [];

            for (const prod of orderProducts) {
                const quantity = Math.floor(Math.random() * 2) + 1;
                const price = Number(prod.price);
                const variant = prod.variants[0];

                items.push({
                    productId: prod.id,
                    variantId: variant?.id || null,
                    quantity,
                    price
                });

                total += price * quantity;
            }

            // Create order
            const [order] = await db.insert(orders).values({
                userId: user.id,
                status: statuses[j % statuses.length],
                totalAmount: total.toFixed(2),
                email: user.email,
                firstName: user.name.split(' ')[0],
                lastName: user.name.split(' ')[1] || '',
                street: "123 Test Street",
                city: "Test City",
                state: "TC",
                zip: "12345",
                country: "US",
            }).returning();

            // Create order items
            for (const item of items) {
                await db.insert(orderItems).values({
                    orderId: order.id,
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    priceAtPurchase: item.price.toFixed(2),
                });
            }

            console.log(`  ✓ Created order ${order.id.slice(0, 8)}... for ${user.email} (${items.length} items, $${total.toFixed(2)})`);
        }
    }

    const totalOrders = await db.query.orders.findMany();
    console.log(`  ✓ Total orders in database: ${totalOrders.length}`);
};

// Allow running directly
if (import.meta.main) {
    seedOrders()
        .then(() => {
            console.log("Orders seeded successfully!");
            process.exit(0);
        })
        .catch((err) => {
            console.error("Failed to seed orders:", err);
            process.exit(1);
        });
}
