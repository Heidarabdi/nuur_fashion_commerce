import { Hono } from "hono";
import { categoriesController } from "../../controllers/categories.controller";

const adminCategoriesRoutes = new Hono();

adminCategoriesRoutes.post("/", categoriesController.create);
adminCategoriesRoutes.put("/:id", categoriesController.update);
adminCategoriesRoutes.delete("/:id", categoriesController.delete);

export default adminCategoriesRoutes;
