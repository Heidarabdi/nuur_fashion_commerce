import { Context, Next } from "hono";
import { logger } from "../utils/logger";

export const loggerMiddleware = async (c: Context, next: Next) => {
    const start = Date.now();
    const { method, path } = c.req;

    await next();

    const ms = Date.now() - start;
    const status = c.res.status;

    const logMethod = status >= 500 ? "error" : status >= 400 ? "warn" : "info";

    logger[logMethod]({
        method,
        path,
        status,
        ms,
        query: c.req.query(),
    }, "Request completed");
};
