import { Hono } from "hono";
import { cartsController } from "../controllers/carts.controller";
import { optionalAuthMiddleware } from "../middleware";

const cartsRoutes = new Hono();

cartsRoutes.use("*", optionalAuthMiddleware);


cartsRoutes.get("/", cartsController.getCart);
cartsRoutes.post("/items", cartsController.addItem);
cartsRoutes.patch("/items/:itemId", cartsController.updateItem);
cartsRoutes.delete("/items/:itemId", cartsController.removeItem);

export default cartsRoutes;
