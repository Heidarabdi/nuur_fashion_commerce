/**
 * Global Test Setup (Bun Test --preload)
 * 
 * We keep this minimal. Heavy lifting is done in setupTestContext() 
 * which is explicitly called by tests that need a database.
 */

process.env.NODE_ENV = "test";

// Silence logs by default in tests
process.env.LOG_LEVEL = "error";

console.log("🛠️  Global Test Environment Initialized.");
