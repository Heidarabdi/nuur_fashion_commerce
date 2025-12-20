import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from '../../src/db/schema';

// This is the singleton PGlite client and Drizzle instance
// used across all tests for consistency.
export const testPglite = new PGlite();
export const testDb = drizzle(testPglite, { schema });
