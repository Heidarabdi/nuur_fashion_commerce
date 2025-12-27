import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from '../../src/db/schema';
import { setTestDb } from '../../src/db';
import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";
import { mock } from "bun:test";

let isGlobalMocked = false;

/**
 * Robust test setup that should be called at the top of test files
 */
export async function setupTestContext() {
    console.log("🚀 Initializing Test Context...");

    // 1. Fresh DB instance
    const client = new PGlite();
    const db = drizzle(client, { schema });

    // 2. Manual Migrations (more robust for testing)
    const migrationsDir = resolve(process.cwd(), "src/db/migrations");
    const files = readdirSync(migrationsDir)
        .filter(f => f.endsWith(".sql"))
        .sort();

    for (const file of files) {
        const sql = readFileSync(resolve(migrationsDir, file), "utf8");
        const statements = sql.split("--> statement-breakpoint");
        for (const statement of statements) {
            const trimmed = statement.trim();
            if (trimmed) await client.exec(trimmed);
        }
    }

    // 3. Link to the app's db binding
    setTestDb(db);

    // 4. Other Mocks (only once per process)
    if (!isGlobalMocked) {

        const loggerPath = resolve(process.cwd(), "src/utils/logger/index.ts");
        mock.module(loggerPath, () => ({
            logger: { info: () => { }, error: () => { }, warn: () => { }, debug: () => { } }
        }));

        isGlobalMocked = true;
    }

    process.env.NODE_ENV = "test";

    console.log("✅ Test Context Ready.");
    return { db, client };
}
