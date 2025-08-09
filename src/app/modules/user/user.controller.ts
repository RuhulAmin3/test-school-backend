import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { IUser } from "./user.interface";
import {
  getAllUserService,
  getSingleUserService,
  deleteUserService,
  updateUserService, 
} from "./user.service";

export const getAllUserController = catchAsync(
  async (req: Request, res: Response) => {
    const filteredData = req.query;
    const result = await getAllUserService(filteredData);
    sendResponse<IUser[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user created successfully",
      data: result,
    });
  }
);

export const getSingleUserController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await getSingleUserService(id);
    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user retrieved successfully",
      data: result,
    });
  }
);

export const updateUserController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await updateUserService(id, updateData);
    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user updated successfully",
      data: result,
    });
  }
);

export const deleteUserController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteUserService(id);
    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user deleted successfully",
      data: result,
    });
  }
);

