import { db } from "../src/db";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";

const seedAdmin = async () => {
    console.log("Seeding Admin User...");

    const email = "admin@nuur.com";
    const existing = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (existing) {
        if (existing.role !== "admin") {
            console.log("Updating existing user to admin...");
            await db.update(users).set({ role: "admin" }).where(eq(users.id, existing.id));
        } else {
            console.log("Admin user already exists.");
        }
        return existing.id;
    }

    console.log("Creating new admin user...");
    // Since we use Clerk, we usually sync users. 
    // For local testing without Clerk webhook, we manually insert a user with a fake clerkId.
    const [admin] = await db.insert(users).values({
        clerkId: "user_admin123",
        email,
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        status: "active"
    }).returning();

    console.log("Admin created:", admin.id);
    return admin.id;
};

seedAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
