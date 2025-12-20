import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../config";
import * as schema from "./schema";

const createDb = () => {
    const client = postgres(env.DATABASE_URL);
    return drizzle(client, { schema });
};

// We use a variable that can be overridden in tests
export let db = process.env.NODE_ENV === "test"
    ? (null as any) // Will be set by setTestDb in setup.ts
    : createDb();

export const setTestDb = (testDbInstance: any) => {
    db = testDbInstance;
};
