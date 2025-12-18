import { Context } from "hono";
import { usersService } from "../services/users.service";
import { response } from "../utils";
import { updateUserSchema } from "@nuur-fashion-commerce/shared";

export const usersController = {
    async getMe(c: Context) {
        // 'user' is injected by authMiddleware
        const user = c.get("user");
        return response.success(c, user);
    },

    async updateMe(c: Context) {
        const user = c.get("user");
        const body = await c.req.json();

        const validation = updateUserSchema.safeParse(body);
        if (!validation.success) {
            return response.error(c, "Validation failed", 400, validation.error.format());
        }

        const updatedUser = await usersService.update(user.id, validation.data);
        return response.success(c, updatedUser);
    },
};
