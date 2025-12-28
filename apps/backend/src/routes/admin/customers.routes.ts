import { Hono } from "hono";
import { adminController } from "../../controllers/admin.controller";

const adminCustomersRoutes = new Hono();

// GET /api/admin/customers - Get all customers with stats
adminCustomersRoutes.get("/", adminController.getCustomers);

export default adminCustomersRoutes;
