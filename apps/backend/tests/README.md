# Backend Testing Documentation

This directory contains the automated test suite for the Nuur Fashion Commerce backend.

## Architecture & Tools

- **Test Runner**: [Bun Test](https://bun.sh/docs/cli/test)
- **Database**: [PGlite](https://pglite.dev/) (In-memory PostgreSQL)
- **ORM**: Drizzle ORM
- **API Framework**: Hono

---

## 🛠️ Infrastructure Deep Dive

### 1. Database Context (`tests/helpers/test-context.ts`)
The `setupTestContext` function is the heart of our testing strategy. It ensures that every test runs against a clean, migrated, and correctly configured database.

```typescript
// Important: It manually applies SQL migrations to PGlite
for (const file of migrationFiles) {
    const sql = readFileSync(resolve(migrationsDir, file), "utf8");
    const statements = sql.split("--> statement-breakpoint");
    for (const statement of statements) {
        if (statement.trim()) await client.exec(statement);
    }
}

// It binds the new PGlite instance to the app's db variable
setTestDb(db);
```

### 2. Data Factories (`tests/helpers/test-utils.ts`)
To keep tests clean, we use a factory pattern to seed data. This avoids manually writing complex SQL/Drizzle inserts in every test file.

```typescript
export const factories = {
    async createUser(overrides = {}) {
        const [user] = await db.insert(schema.users).values({
            id: randomUUID(),
            clerkId: `clerk_${randomUUID()}`,
            // ... defaults
            ...overrides,
        }).returning();
        return user;
    }
};
```

---

## 🧪 Testing Patterns

### Integration Tests (`app.request`)
We test our API layer without spinning up a real server by using `app.request()`. This is handled by our `request` helper.

**Example Test Workflow (`tests/integration/reviews.api.test.ts`):**
```typescript
it("should create a review via API", async () => {
    const user = await factories.createUser({ clerkId: "clerk_123" });
    const product = await factories.createProduct();

    const res = await request.post(app, "/api/reviews", {
        productId: product.id,
        rating: 5,
        title: "Love it!"
    }, "clerk_123"); // Mock user authentication

    expect(res.status).toBe(201);
});
```

### Mocking Auth
We bypass Clerk's external calls by mocking `@hono/clerk-auth`. In integration tests, simply pass the `clerkId` as the third argument to `request.post`/`get`, and our middleware will automatically resolve the correct user in the database.

---

## 🚀 Running Tests

- **Run all**: `bun test ./tests`
- **Run Unit**: `bun test ./tests/unit`
- **Run Integration**: `bun test ./tests/integration`

---
*Maintained by the Nuur Engineering Team.*
