import { Context } from "hono";
import { adminService } from "../services/admin.service";
import { response } from "../utils";

export const adminController = {
    async getStats(c: Context) {
        const stats = await adminService.getDashboardStats();
        return response.success(c, stats);
    },

    async getCustomers(c: Context) {
        const customers = await adminService.getCustomers();
        return response.success(c, customers);
    },

    async getAllProducts(c: Context) {
        const products = await adminService.getAllProducts();
        return response.success(c, products);
    },
};
