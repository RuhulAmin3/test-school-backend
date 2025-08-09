// Image.service: Module file for the Image.service functionality.
import httpStatus from "http-status";

import { Request } from "express";
import { ApiError } from "../../../error/ApiError";
import { uploadToDigitalOceanAWS } from "../../../shared/uploadToCloud";
import {  deleteFromDigitalOceanAWS, deleteMultipleFromDigitalOceanAWS } from "../../../shared/uploadToCloud";

//upload image
const uploadImage = async (req: Request) => {

  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No image provided");
  }

  const file = req.file;

  const imageUrl = (await uploadToDigitalOceanAWS(file)).Location;

    if (!imageUrl) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to upload image");
    }

  return { url: imageUrl };
};

// Service for creating images//multiple images creation
const uploadMultipleImage = async (req: Request) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No images provided");
  }

  const imageUrls = [];

  for (const file of files) {
    const url = (await uploadToDigitalOceanAWS(file)).Location;

    imageUrls.push(url);
  }

  return { url: imageUrls };
};


//delete single image
const deleteImage = async (payload: { url: string }) => {
  if (!payload.url) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No image provided");
  }
  const result = deleteFromDigitalOceanAWS(payload.url);
  return result;
};


//delete multiple images
const deleteMultipleImages = async (urls: string[]) => {
  if (!urls || urls.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No images provided for deletion");
  }

  const result = deleteMultipleFromDigitalOceanAWS(urls)
    
 return result
};

export const ImageService = {
  uploadImage,
  uploadMultipleImage,
  deleteImage,
  deleteMultipleImages
};