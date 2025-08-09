import httpStatus from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { IUser } from "../user/user.interface";
import {
  createUserService,
  loginUserService,
  refreshTokenService,
} from "./auth.service";
import { Request, Response } from "express";
import config from "../../../config";

export const createUserController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await createUserService(req.body);
    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user created successfully",
      data: result,
    });
  }
);

export const loginUserController = catchAsync(
  async (req: Request, res: Response) => {
    const { ...loginData } = req.body;
    const result = await loginUserService(loginData);
    const cookieOption = {
      secure: config.env === "production",
      httpOnly: false,
    };

    res.cookie("refreshToken", result.refreshToken, cookieOption);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user logged in successfully",
      data: { accessToken: result.accessToken },
    });
  }
);

export const refreshTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result = await refreshTokenService(refreshToken);

    const cookieOption = {
      secure: config.env === "production",
      httpOnly: false,
    };

    res.cookie("refreshToken", result, cookieOption);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "accesstoken created successfully",
      data: { accessToken: result },
    });
  }
);
