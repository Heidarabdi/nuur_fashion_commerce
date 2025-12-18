import { Hono } from "hono";
import { brandsController } from "../../controllers/brands.controller";

const adminBrandsRoutes = new Hono();

adminBrandsRoutes.post("/", brandsController.create);
adminBrandsRoutes.put("/:id", brandsController.update);
adminBrandsRoutes.delete("/:id", brandsController.delete);

export default adminBrandsRoutes;
