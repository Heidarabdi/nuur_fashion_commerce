import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import * as schema from '../../src/db/schema';
import { resolve } from 'path';
import { readdirSync } from 'fs';

export async function createTestDb() {
    console.error("🛠️  Creating PGlite Instance...");
    const client = new PGlite();
    const db = drizzle(client, { schema });

    // Path to migrations must be absolute for reliability
    const migrationsPath = resolve(process.cwd(), 'src/db/migrations');
    console.error(`📂 Using migrations from: ${migrationsPath}`);

    try {
        const files = readdirSync(migrationsPath);
        console.error(`📄 Found ${files.length} migration files/folders.`);
    } catch (err) {
        console.error(`❌ Failed to read migrations directory: ${migrationsPath}`, err);
        throw err;
    }

    await migrate(db, { migrationsFolder: migrationsPath });
    console.error("🚀 Migrations Applied Successfully.");

    return db;
}

export async function clearTable(db: any, table: any) {
    const { sql } = await import('drizzle-orm');
    await db.delete(table);
}
