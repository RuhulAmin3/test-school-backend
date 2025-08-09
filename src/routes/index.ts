import express from "express";
import userRoutes from "../app/modules/user/user.route";
import adminsRoutes from "../app/modules/admin/admin.route";
import authRoutes from "../app/modules/auth/auth.route";
const router = express.Router();

const Routes = [
  { path: "/users", route: userRoutes },
  { path: "/auth", route: authRoutes },
  { path: "/admins", route: adminsRoutes },
];

Routes.forEach((route) => router.use(route.path, route.route));

export default router;
