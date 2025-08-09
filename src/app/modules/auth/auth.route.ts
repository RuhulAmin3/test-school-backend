// src/modules/auth/auth.routes.ts
import express from "express";
import { validationRequest } from "../../middlewares/validationRequest";
import {
  loginUserZodSchema,
  registerUserZodSchema,
  refreshTokenZodSchema,
  verifyEmailZodSchema,
  resendOtpZodSchema,
  sendResetPasswordOtpZodSchema,
  resetPasswordZodSchema,
  changePasswordZodSchema,
  updateProfileZodSchema,
} from "./auth.validation";
import {
  registerUserController,
  loginUserController,
  refreshTokenController,
  verifyEmailController,
  resendOtpController,
  sendResetPasswordOtpController,
  resetPasswordController,
  changePasswordController,
  updateProfileController,
  getCurrentUserController,
} from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../../../enums/enum";

const router = express.Router();

router.post(
  "/register",
  validationRequest(registerUserZodSchema),
  registerUserController
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

router.post(
  "/verify-email",
  validationRequest(verifyEmailZodSchema),
  verifyEmailController
);

router.post(
  "/resend",
  validationRequest(resendOtpZodSchema),
  resendOtpController
);

router.post(
  "/send-reset-otp",
  validationRequest(sendResetPasswordOtpZodSchema),
  sendResetPasswordOtpController
);
router.post(
  "/reset",
  validationRequest(resetPasswordZodSchema),
  resetPasswordController
);
router.post(
  "/change",
  validationRequest(changePasswordZodSchema),
  changePasswordController
);

router.get(
  "/me",
  auth(USER_ROLE.ADMIN, USER_ROLE.STUDENT, USER_ROLE.SUPERVISOR),
  getCurrentUserController
);
router.patch(
  "/update",
  auth(USER_ROLE.ADMIN, USER_ROLE.STUDENT, USER_ROLE.SUPERVISOR),
  validationRequest(updateProfileZodSchema),
  updateProfileController
);

export default router;
