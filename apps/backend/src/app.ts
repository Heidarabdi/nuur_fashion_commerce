import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { env } from "./config";
import { clerkMiddleware } from "@hono/clerk-auth";
import routes from "./routes";
import { loggerMiddleware, errorMiddleware } from "./middleware";

const app = new Hono();

// Global Middleware
app.use("*", clerkMiddleware());
app.use("*", loggerMiddleware); // Swapped Basic Logger for Pinot Logger
app.use("*", prettyJSON());
app.use("*", secureHeaders());
app.use(
    "*",
    cors({
        origin: [env.FRONTEND_URL],
        allowHeaders: ["Content-Type", "Authorization", "Upgrade-Insecure-Requests"],
        allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT", "PATCH"],
        exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
        maxAge: 600,
        credentials: true,
    })
);

app.onError(errorMiddleware);

app.get("/", (c) => {
    return c.json({
        message: "Nuur Fashion Commerce API",
        status: "healthy",
        version: "1.0.0",
    });
});

app.route("/api", routes);

export default app;
