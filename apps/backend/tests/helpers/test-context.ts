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
    const authPath = resolve(process.cwd(), "src/lib/auth.ts");
    mock.module(authPath, () => ({
        auth: {
            api: {
                getSession: async ({ headers }: { headers: Headers }) => {
                    const userId = headers.get("X-Test-User-Id");
                    if (!userId) return null;
                    return {
                        user: {
                            id: userId,
                            email: "test@example.com",
                            name: "Test User",
                            role: "user",
                        },
                        session: {
                            id: "test_session_id",
                            userId,
                            expiresAt: new Date(Date.now() + 1000 * 60 * 60),
                        }
                    };
                }
            }
        }
    }));


    const loggerPath = resolve(process.cwd(), "src/utils/logger/index.ts");
    mock.module(loggerPath, () => ({
        logger: { info: () => { }, error: () => { }, warn: () => { }, debug: () => { } }
    }));
}
