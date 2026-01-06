import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type DbType = PostgresJsDatabase<typeof schema>;

// For Cloudflare Workers, we use a WeakMap keyed by request context
// This ensures each request gets its own connection that's cleaned up properly
const requestDbMap = new WeakMap<object, DbType>();

/**
 * Create a new database connection
 * For Cloudflare Workers, you MUST create a new connection for each request
 */
export const createDb = (databaseUrl: string): DbType => {
    const client = postgres(databaseUrl, {
        prepare: false, // Workers don't support prepared statements
    });
    return drizzle(client, { schema });
};

// Global variable for current request's db - set by middleware
let currentDb: DbType | null = null;

export const setCurrentDb = (db: DbType) => {
    currentDb = db;
};

export const getCurrentDb = (): DbType => {
    if (!currentDb) {
        throw new Error("Database not initialized. This route may not have the database middleware.");
    }
    return currentDb;
};

// For backward compatibility - uses getCurrentDb()
export const db = new Proxy({} as DbType, {
    get(_, prop) {
        return (getCurrentDb() as any)[prop];
    },
});

// For tests
let testDbInstance: DbType | null = null;
export const setTestDb = (testDb: DbType) => {
    testDbInstance = testDb;
    currentDb = testDb; // Also set as current for tests
};
export const getTestDb = () => testDbInstance;
