import express from "express";
import { validationRequest } from "../../middlewares/validationRequest";
import { ImageController } from "./image.controller";
import { ImageValidation } from "./image.validation";
import { fileUploader } from "../../../shared/multer";

const router = express.Router();


// Upload single image
router.post(
  "/upload",
  fileUploader.upload.single("file"),
  validationRequest(ImageValidation.createImageSchema),
  ImageController.createImage
);

// Upload multiple images
router.post(
  "/upload-multiple",
  fileUploader.upload.array("files", 10), // Max 10 files
  validationRequest(ImageValidation.createImagesSchema),
  ImageController.createImages
);

// Delete single image
router.delete(
  "/delete",
  validationRequest(ImageValidation.deleteImageSchema),
  ImageController.deleteImage
);

// Delete multiple images
router.delete(
  "/delete-multiple",
  validationRequest(ImageValidation.deleteMultipleImagesSchema),
  ImageController.deleteMultipleImages
);

export const imageRoutes = router;
