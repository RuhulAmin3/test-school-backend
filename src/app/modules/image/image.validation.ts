// src/modules/image/image.validation.ts
import { z } from "zod";

const createImageSchema = z.object({
  file: z.any({
    required_error: "Image file is required",
  }),
});

const createImagesSchema = z.object({
  files: z.array(z.any({
    required_error: "Image file is required",
  })).min(1, "At least one image file is required"),
});

const deleteImageSchema = z.object({
  body: z.object({
    url: z.string({
      required_error: "Image URL is required",
    }).url("Invalid image URL"),
  }),
});

const deleteMultipleImagesSchema = z.object({
  body: z.object({
    urls: z.array(
      z.string({
        required_error: "Image URL is required",
      }).url("Invalid image URL")
    ).min(1, "At least one image URL is required"),
  }),
});

export const ImageValidation = {
  createImageSchema,
  createImagesSchema,
  deleteImageSchema,
  deleteMultipleImagesSchema,
};
