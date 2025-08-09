import { IErrorMessages } from "./errorMessages";

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IErrorMessages[];
};
