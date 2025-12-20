import { test, expect, describe } from "bun:test";
import { PGlite } from "@electric-sql/pglite";

describe("PGlite Sanity Check", () => {
    test("It should create and query a table in-memory", async () => {
        const client = new PGlite();

        await client.exec(`
            CREATE TABLE test_table (
                id UUID PRIMARY KEY,
                name TEXT NOT NULL
            );
            INSERT INTO test_table (id, name) VALUES ('00000000-0000-0000-0000-000000000001', 'Test User');
        `);

        const res = await client.query("SELECT * FROM test_table;");

        expect(res.rows).toHaveLength(1);
        expect(res.rows[0].name).toBe("Test User");
    });
});
