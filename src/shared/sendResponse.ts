import { Response } from "express";

type ISendResponse<T> = {
  success: boolean;
  message: string;
  statusCode: number;
  meta?: {
    page: number;
    limit: number;
    count: number;
  };
  data: T | null;
};

export const sendResponse = <T>(res: Response, data: ISendResponse<T>) => {
  res.status(data.statusCode).json({
    success: true,
    statusCode: data.statusCode,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};
