import { Hono } from "hono";
import { usersController } from "../controllers/users.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const usersRoutes = new Hono();

// All routes here are protected
usersRoutes.use("*", authMiddleware);

usersRoutes.get("/me", usersController.getMe);
usersRoutes.patch("/me", usersController.updateMe);

export default usersRoutes;
