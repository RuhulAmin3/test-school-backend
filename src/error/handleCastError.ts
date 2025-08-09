import mongoose from "mongoose";
import { IErrorMessages } from "../types/errorMessages";
import { IGenericErrorResponse } from "../types/genericErrorResponse";

export const handleCastError = (
  err: mongoose.Error.CastError
): IGenericErrorResponse => {
  const errorMessages: IErrorMessages[] = [
    { path: err?.path, message: err?.message },
  ];

  return {
    statusCode: 400,
    message: "Invalid Id",
    errorMessages,
  };
};
