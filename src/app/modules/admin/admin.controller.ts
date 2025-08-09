/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import {
  createAdminService,
  adminLoginService,
  getAdminProfileService,
  updateAdminProfileService,
} from "./admin.service";
import { IAdmin } from "./admin.interface";
import config from "../../../config";
import { JwtPayload } from "jsonwebtoken";

export const createAdminController = catchAsync(
  async (req: Request, res: Response) => {
    const adminData = req.body;
    const result = await createAdminService(adminData);
    sendResponse<IAdmin>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "admin created successfully",
      data: result,
    });
  }
);

export const adminLoginController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await adminLoginService(req.body);

    const cookieOption = {
      secure: config.env === "production",
      httpOnly: true,
    };

    res.cookie("refreshToken", result.refreshToken, cookieOption);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "admin loggedin successful",
      data: {
        accessToken: result.accessToken,
      },
    });
  }
);

export const getAdminProfileController = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const result = await getAdminProfileService(user as JwtPayload);

    sendResponse<IAdmin>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "admin profile retrieved successfully",
      data: result,
    });
  }
);

export const updateAdminProfileController = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const data = req.body;
    const result = await updateAdminProfileService(
      user as JwtPayload,
      id,
      data
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "admin profile updated successfully",
      data: result,
    });
  }
);
