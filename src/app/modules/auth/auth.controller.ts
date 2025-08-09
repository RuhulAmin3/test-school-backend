import httpStatus from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { Request, Response } from "express";
import {
  registerUser,
  loginUserService,
  refreshTokenService,
  verifyEmailService,
  sendResetPasswordOtpService,
  resetPasswordService,
  changePasswordService,
  getCurrentUserService,
  updateProfileService,
  resendOTPService,
} from "./auth.service";
import { IUser } from "../user/user.interface";
import { ILogin } from "./auth.interface";
import config from "../../../config";
import { OTP_TYPE } from "../../../enums/enum";

// Register User Controller
export const registerUserController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await registerUser(req.body as IUser);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: result,
    });
  }
);

// Login User Controller
export const loginUserController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await loginUserService(req.body as ILogin);

    const cookieOption = {
      secure: config.env === "production",
      httpOnly: false,
    };

    res.cookie("refreshToken", result.refreshToken, cookieOption);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Login successful",
      data: { accessToken: result.accessToken },
    });
  }
);

// Refresh Token Controller
export const refreshTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await refreshTokenService(refreshToken);

    const cookieOption = {
      secure: config.env === "production",
      httpOnly: false,
    };

    res.cookie("refreshToken", refreshToken, cookieOption);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Access token created successfully",
      data: { accessToken: result },
    });
  }
);

// Verify Email Controller
export const verifyEmailController = catchAsync(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await verifyEmailService(email, otp);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result,
      data: null,
    });
  }
);

// Send Reset Password OTP Controller
export const sendResetPasswordOtpController = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await sendResetPasswordOtpService(email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result,
      data: null,
    });
  }
);

// Reset Password Controller
export const resetPasswordController = catchAsync(
  async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    const result = await resetPasswordService(email, otp, newPassword);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result,
      data: null,
    });
  }
);

// Change Password Controller
export const changePasswordController = catchAsync(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req?.user?.id || "";
    const result = await changePasswordService(
      userId,
      oldPassword,
      newPassword
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result.message,
      data: null,
    });
  }
);

// Get Current User Controller
export const getCurrentUserController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req?.user?.id || "";

    const result = await getCurrentUserService(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Current user retrieved successfully",
      data: result,
    });
  }
);

// Update Profile Controller
export const updateProfileController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req?.user?.id || "";

    const result = await updateProfileService(userId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile updated successfully",
      data: result,
    });
  }
);

// Resend OTP Controller
export const resendOtpController = catchAsync(
  async (req: Request, res: Response) => {
    const { email, type } = req.body;
    const result = await resendOTPService(email, type as OTP_TYPE);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result,
      data: null,
    });
  }
);
