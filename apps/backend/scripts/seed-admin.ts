import { db } from "../src/db";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

const seedAdmin = async () => {
    const email = process.argv[2] || "admin@nuur.com";
    console.log(`Targeting Admin: ${email}`);

    const existing = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (existing) {
        console.log(`Found user: ${existing.name} (${existing.id})`);
        if (existing.role !== "admin") {
            console.log("Updating role to admin...");
            await db.update(users).set({ role: "admin" }).where(eq(users.id, existing.id));
            console.log("Role updated successfully.");
        } else {
            console.log("User is already an admin.");
        }
    } else {
        console.log("User not found in database.");
        console.log("Creating a skeleton admin user...");
        console.log("NOTE: This user will NOT have a password. They must use 'Forgot Password' or you must create them via UI first.");

        await db.insert(users).values({
            id: randomUUID(),
            email,
            name: "Admin User",
            emailVerified: true,
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log("Skeleton admin created. Please complete registration via UI.");
    }
};

seedAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
