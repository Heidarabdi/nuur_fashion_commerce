import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { logger } from "../utils/logger";
import { response } from "../utils/response";
import { ContentfulStatusCode } from "hono/utils/http-status";

export const errorMiddleware = (err: Error, c: Context) => {
    logger.error({ err }, "Unhandled Error");

    if (err instanceof HTTPException) {
        return response.error(c, err.message, err.status as ContentfulStatusCode);
    }

    if (err instanceof ZodError) {
        return response.error(c, "Validation Failed", 400, err.flatten());
    }

    // Handle Drizzle/Postgres errors if needed (e.g. duplicate key)
    // if ((err as any).code === '23505') { ... }

    return response.error(c, "Internal Server Error", 500, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};
