import { db } from "../index";
import { users, addresses } from "../schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

const userData = [
    { name: "Admin User", email: "xeydarcabdi3@gmail.com", role: "admin" }, // Use your verified Resend email
    { name: "John Customer", email: "xeydarcabdi3@gmail.com", role: "user" }, // Same email for testing
    { name: "Jane Shopper", email: "xeydarcabdi3@gmail.com", role: "user" }, // Same email for testing
];

const addressData = [
    { street: "123 Main Street", city: "New York", state: "NY", zip: "10001", country: "US", isDefault: true },
    { street: "456 Oak Avenue", city: "Los Angeles", state: "CA", zip: "90001", country: "US", isDefault: false },
];

export const seedUsers = async () => {
    console.log("  Creating users...");

    const createdUsers = [];

    for (const user of userData) {
        // Check if user exists
        const existing = await db.query.users.findFirst({
            where: eq(users.email, user.email)
        });

        if (existing) {
            console.log(`  ⏭ User ${user.email} already exists`);

            // Update role if needed
            if (existing.role !== user.role) {
                await db.update(users).set({ role: user.role }).where(eq(users.id, existing.id));
                console.log(`    → Updated role to ${user.role}`);
            }

            createdUsers.push(existing);
            continue;
        }

        // Create skeleton user (no password - must use forgot password or sign up via UI)
        const [newUser] = await db.insert(users).values({
            id: randomUUID(),
            name: user.name,
            email: user.email,
            emailVerified: true, // Pre-verified for seeded users
            role: user.role,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        console.log(`  ✓ Created user: ${newUser.email} (role: ${user.role})`);
        console.log(`    ⚠ Note: User has no password. They must sign up or use forgot password.`);
        createdUsers.push(newUser);
    }

    // Add addresses for non-admin users
    console.log("  Creating addresses...");
    const regularUsers = createdUsers.filter(u => u.role !== "admin");

    for (const user of regularUsers) {
        // Check if user has addresses
        const existingAddresses = await db.query.addresses.findMany({
            where: eq(addresses.userId, user.id)
        });

        if (existingAddresses.length > 0) {
            console.log(`  ⏭ User ${user.email} already has addresses`);
            continue;
        }

        // Add addresses
        for (const addr of addressData) {
            await db.insert(addresses).values({
                userId: user.id,
                ...addr
            });
        }
        console.log(`  ✓ Added ${addressData.length} addresses for ${user.email}`);
    }

    return createdUsers;
};

// Allow running directly
if (import.meta.main) {
    seedUsers()
        .then(() => {
            console.log("Users seeded successfully!");
            process.exit(0);
        })
        .catch((err) => {
            console.error("Failed to seed users:", err);
            process.exit(1);
        });
}
