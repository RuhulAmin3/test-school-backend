import express from "express";
import { validationRequest } from "../../middlewares/validationRequest";
import {
  loginUserZodSchema,
  userSignupZodSchema,
  refreshTokenZodSchema,
} from "./auth.validation";

import {
  createUserController,
  loginUserController,
  refreshTokenController,
} from "./auth.controller";

const router = express.Router();

router.post(
  "/signup",
  validationRequest(userSignupZodSchema),
  createUserController
);

router.post(
  "/login",
  validationRequest(loginUserZodSchema),
  loginUserController
);

router.post(
  "/refresh-token",
  validationRequest(refreshTokenZodSchema),
  refreshTokenController
);

export default router;
