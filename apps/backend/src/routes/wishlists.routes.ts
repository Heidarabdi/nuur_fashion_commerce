import { Hono } from "hono";
import { wishlistsController } from "../controllers/wishlists.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const wishlistsRoutes = new Hono();

wishlistsRoutes.use("*", authMiddleware);

wishlistsRoutes.get("/", wishlistsController.getMyWishlist);
wishlistsRoutes.post("/", wishlistsController.addItem);
wishlistsRoutes.delete("/:productId", wishlistsController.removeItem);

export default wishlistsRoutes;
