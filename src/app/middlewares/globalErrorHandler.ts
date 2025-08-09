/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import config from "../../config";
import { IErrorMessages } from "../../types/errorMessages";
import { handleZodError } from "../../error/handleZodError";
import { handleValidationError } from "../../error/handleValidationError";
import { handleCastError } from "../../error/handleCastError";
import { ApiError } from "../../error/ApiError";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errorMessages: IErrorMessages[] = [];
  if (err?.name === "ZodError") {
    const zodError = handleZodError(err);
    statusCode = zodError.statusCode;
    message = zodError.message;
    errorMessages = zodError.errorMessages;
  } else if (err?.name === "ValidationError") {
    const validationError = handleValidationError(err);
    statusCode = validationError.statusCode;
    message = validationError.message;
    errorMessages = validationError.errorMessages;
  } else if (err?.name === "CastError") {
    const castError = handleCastError(err);
    statusCode = castError.statusCode;
    message = castError.message;
    errorMessages = castError.errorMessages;
  } else if (err instanceof Error) {
    message = err?.message;
    errorMessages = err?.message ? [{ path: "", message: err?.message }] : [];
  } else if (err instanceof ApiError) {
    message = err?.message;
    statusCode = err?.statusCode;
    errorMessages = err?.message ? [{ path: "", message: err?.message }] : [];
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== "production" ? err?.stack : undefined,
  });
};
