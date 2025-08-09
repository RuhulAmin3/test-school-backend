import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { ImageService } from "./image.service";

// Upload single image
const createImage = catchAsync(async (req: Request, res: Response) => {
  const result = await ImageService.uploadImage(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image uploaded successfully",
    data: result,
  });
});

// Upload multiple images
const createImages = catchAsync(async (req: Request, res: Response) => {
  const result = await ImageService.uploadMultipleImage(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Images uploaded successfully",
    data: result,
  });
});

// Delete single image
const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const { url } = req.body;
  const result = await ImageService.deleteImage({ url });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image deleted successfully",
    data: result,
  });
});

// Delete multiple images
const deleteMultipleImages = catchAsync(async (req: Request, res: Response) => {
  const { urls } = req.body;
  const result = await ImageService.deleteMultipleImages(urls);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Images deleted successfully",
    data: result,
  });
});

export const ImageController = {
  createImage,
  createImages,
  deleteImage,
  deleteMultipleImages,
};
