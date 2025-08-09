import { Types } from "mongoose";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

type IJwtData = {
  id: Types.ObjectId;
  role: string;
};

export const createToken = (
  data: IJwtData,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(data, secret, {
    expiresIn: expireTime,
  });
};

export const varifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
