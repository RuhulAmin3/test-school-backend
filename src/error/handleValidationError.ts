import mongoose from "mongoose";
import { IGenericErrorResponse } from "../types/genericErrorResponse";
import { IErrorMessages } from "../types/errorMessages";

export const handleValidationError = (
  err: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errorMessages: IErrorMessages[] = Object.keys(err.errors).map(
    (error) => ({
      path: err.errors[error]?.path,
      message: err.errors[error]?.message,
    })
  );
  return {
    statusCode: 400,
    message: "validation Error",
    errorMessages,
  };
};
