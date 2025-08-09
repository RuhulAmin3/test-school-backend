import express from "express";
import userRoutes from "../app/modules/user/user.route";
import authRoutes from "../app/modules/auth/auth.route";
import { imageRoutes } from "../app/modules/image/image.routes";
const router = express.Router();

const Routes = [
  { path: "/users", route: userRoutes },
  { path: "/auth", route: authRoutes },
  {path:"/image", route:imageRoutes}
];

Routes.forEach((route) => router.use(route.path, route.route));

export default router;
