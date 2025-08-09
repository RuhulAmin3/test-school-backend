import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../error/ApiError";
import httpStatus from "http-status";
import { varifyToken } from "../../utils/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";

export const auth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "you are unauthorized user"
        );
      }
      let verifiedToken = null;
      verifiedToken = varifyToken(token, config.jwt.secret as Secret);
      req.user = verifiedToken;
      if (roles.length > 0 && !roles.includes(verifiedToken.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "you are forbidden user");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
