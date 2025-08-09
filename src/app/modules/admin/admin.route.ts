import express from "express";
import {
  adminLoginController,
  createAdminController,
  getAdminProfileController,
  updateAdminProfileController,
} from "./admin.controller";
import { validationRequest } from "../../middlewares/validationRequest";
import {
  adminLoginZodSchema,
  createAdminZodSchema,
  updateAdminProfileZodSchema,
} from "./admin.validation";
import { USER_ROLE } from "../../../enums/enum";
import { auth } from "../../middlewares/auth";
const router = express.Router();

router.post(
  "/create-admin",
  validationRequest(createAdminZodSchema),
  createAdminController
);

router.post(
  "/login",
  validationRequest(adminLoginZodSchema),
  adminLoginController
);

router.patch(
  "/my-profile",
  validationRequest(updateAdminProfileZodSchema),
  auth(USER_ROLE.ADMIN),
  updateAdminProfileController
);

router.get("/my-profile", auth(USER_ROLE.ADMIN), getAdminProfileController);

export default router;
