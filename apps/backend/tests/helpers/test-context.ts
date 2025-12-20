import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from '../../src/db/schema';
import { setTestDb } from '../../src/db';
import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";
import { mock } from "bun:test";

let globalMocksApplied = false;

/**
 * Robust test setup that should be called at the top of test files or in beforeAll.
 */
export async function setupTestContext() {
    // 1. Fresh DB instance
    const client = new PGlite();
    const db = drizzle(client, { schema });

    // 2. Manual Migrations
    const migrationsDir = resolve(process.cwd(), "src/db/migrations");
    const migrationFiles = readdirSync(migrationsDir)
        .filter(f => f.endsWith(".sql"))
        .sort();

    for (const file of migrationFiles) {
        const sql = readFileSync(resolve(migrationsDir, file), "utf8");
        const statements = sql.split("--> statement-breakpoint");
        for (const statement of statements) {
            const trimmed = statement.trim();
            if (trimmed) {
                await client.exec(trimmed);
            }
        }
    }

    // 3. Link to the app's global db binding
    setTestDb(db);

    // 4. Register common global mocks
    if (!globalMocksApplied) {
        applyGlobalMocks();
        globalMocksApplied = true;
    }

    process.env.NODE_ENV = "test";

    return { db, client };
}

function applyGlobalMocks() {
    mock.module("@clerk/backend", () => ({
        createClerkClient: () => ({
            users: {
                getUser: async (id: string) => ({
                    id: id || "user_test_123",
                    emailAddresses: [{ emailAddress: "test@example.com" }],
                    firstName: "Test",
                    lastName: "User",
                })
            }
        }),
        verifyToken: async () => ({ sub: "user_test_123", email: "test@example.com" }),
    }));

    mock.module("@hono/clerk-auth", () => ({
        clerkMiddleware: () => async (c: any, next: any) => {
            // No-op for testing, real auth logic is in our authMiddleware
            await next();
        },
        getAuth: (c: any) => {
            // Check if test provided a userId in context or header
            const userId = c.get("testUserId") || c.req.header("X-Test-User-Id");
            return { userId };
        }
    }));


    const loggerPath = resolve(process.cwd(), "src/utils/logger/index.ts");
    mock.module(loggerPath, () => ({
        logger: { info: () => { }, error: () => { }, warn: () => { }, debug: () => { } }
    }));
}
