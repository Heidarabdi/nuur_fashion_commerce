import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { createAuth, AuthEnv } from "./lib/auth";
import { createDb, setCurrentDb } from "./db";
import { loggerMiddleware, errorMiddleware } from "./middleware";
import routes from "./routes";

// Types for Cloudflare Workers bindings
export type WorkerEnv = AuthEnv & {
    FRONTEND_URL: string;
    IMAGES: R2Bucket;
    R2_PUBLIC_URL: string;
};

// Create the app with typed bindings
const app = new Hono<{ Bindings: WorkerEnv }>();

// CORS middleware MUST be first to ensure headers are always set
// even if subsequent middleware fails
app.use("*", async (c, next) => {
    const corsMiddleware = cors({
        origin: [c.env.FRONTEND_URL],
        allowHeaders: ["Content-Type", "Authorization", "Upgrade-Insecure-Requests", "X-Guest-Id", "X-Request-Id"],
        allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT", "PATCH"],
        exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
        maxAge: 600,
        credentials: true,
    });
    return corsMiddleware(c, next);
});

// Other middleware
app.use("*", loggerMiddleware);
app.use("*", prettyJSON());
app.use("*", secureHeaders());

// Database middleware - creates per-request database instance
app.use("*", async (c, next) => {
    try {
        const db = createDb(c.env.DATABASE_URL);
        setCurrentDb(db);
    } catch (error) {
        console.error("Failed to initialize database:", error);
        return c.json({ error: "Database initialization failed" }, 503);
    }
    await next();
});

app.onError(errorMiddleware);

app.get("/", (c) => {
    return c.json({
        message: "Nuur Fashion Commerce API",
        status: "healthy",
        version: "1.0.0",
    });
});

// Better Auth Route - create per-request auth instance
app.on(["POST", "GET"], "/api/auth/*", async (c) => {
    try {
        const auth = createAuth(c.env);
        return auth.handler(c.req.raw);
    } catch (error) {
        console.error("Auth handler error:", error);
        return c.json({ error: "Authentication service error" }, 500);
    }
});

// API routes - db is available via getCurrentDb() called within services
app.route("/api", routes);

export default app;

// Export type for Hono RPC client
export type AppType = typeof app;