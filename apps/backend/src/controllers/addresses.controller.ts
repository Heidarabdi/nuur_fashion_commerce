import { Context } from "hono";
import { addressesService } from "../services/addresses.service";
import { response } from "../utils";
import { createAddressSchema } from "@nuur-fashion-commerce/shared";

export const addressesController = {
    async getAll(c: Context) {
        const user = c.get("user");
        const data = await addressesService.getAll(user.id);
        return response.success(c, data);
    },

    async create(c: Context) {
        const user = c.get("user");
        const body = await c.req.json();
        const validation = createAddressSchema.safeParse(body);

        if (!validation.success) {
            return response.error(c, "Validation failed", 400, validation.error.format());
        }

        const newAddress = await addressesService.create(user.id, validation.data);
        return response.created(c, newAddress);
    },

    async delete(c: Context) {
        const user = c.get("user");
        const id = c.req.param("id");
        await addressesService.delete(user.id, id);
        return response.success(c, null, "Address deleted");
    }
};
