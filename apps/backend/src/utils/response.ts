import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { ContentfulStatusCode } from "hono/utils/http-status";

/**
 * Standardized API Response format
 */
export const response = {
    success: <T>(c: Context, data: T, message = "Success", status: StatusCode = 200) => {
        return c.json(
            {
                success: true,
                message,
                data,
            },
            status as ContentfulStatusCode
        );
    },
    error: (c: Context, message = "Something went wrong", status: StatusCode = 500, errors?: any) => {
        return c.json(
            {
                success: false,
                message,
                errors,
            },
            status as ContentfulStatusCode
        );
    },
    notFound: (c: Context, message = "Resource not found") => {
        return c.json(
            {
                success: false,
                message,
            },
            404
        );
    },
    created: <T>(c: Context, data: T, message = "Created successfully") => {
        return c.json(
            {
                success: true,
                message,
                data,
            },
            201
        );
    },
};
