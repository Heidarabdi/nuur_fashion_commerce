import { Context } from "hono";
import { adminService } from "../services/admin.service";
import { response } from "../utils";

export const adminController = {
    async getStats(c: Context) {
        const stats = await adminService.getDashboardStats();
        return response.success(c, stats);
    }
};
