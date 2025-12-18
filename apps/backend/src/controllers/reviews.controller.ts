import { Context } from "hono";
import { reviewsService } from "../services/reviews.service";
import { response } from "../utils/response";
import { createReviewSchema } from "@nuur-fashion-commerce/shared";

export const reviewsController = {
    async create(c: Context) {
        const user = c.get("user");
        const body = await c.req.json();

        const validated = createReviewSchema.safeParse(body);
        if (!validated.success) {
            return response.error(c, "Invalid input", 400, validated.error);
        }

        const review = await reviewsService.create(user.id, validated.data);
        return response.created(c, review);
    },

    async getByProduct(c: Context) {
        const productId = c.req.param("id");
        const reviews = await reviewsService.getByProduct(productId);
        return response.success(c, reviews);
    },

    async adminApprove(c: Context) {
        const id = c.req.param("id");
        const review = await reviewsService.approve(id);
        return response.success(c, review);
    },

    async adminReject(c: Context) {
        const id = c.req.param("id");
        const review = await reviewsService.reject(id);
        return response.success(c, review);
    }
};
