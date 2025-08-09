import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import httpStatus from "http-status";
import { ApiError } from "./error/ApiError";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use("/api/v1/", router);

app.get("/", (req: Request, res: Response) => {
  res.send("In the name of Allah");
});

app.all("*", (req, res, next) => {
  const err = new ApiError(
    httpStatus.NOT_FOUND,
    `Can't find ${req.originalUrl} on this server!`
  );
  next(err);
});

app.use(globalErrorHandler);
