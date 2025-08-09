import { ZodError } from "zod";
import { IGenericErrorResponse } from "../types/genericErrorResponse";
import { IErrorMessages } from "../types/errorMessages";

export const handleZodError = (err: ZodError): IGenericErrorResponse => {
  const errorMessages: IErrorMessages[] = err.issues.map((issue) => ({
    path: issue.path[issue.path.length - 1],
    message: issue.message,
  }));
  return {
    statusCode: 400,
    message: "Zod validation Error",
    errorMessages,
  };
};
