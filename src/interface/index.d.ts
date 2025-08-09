import { JwtPayload } from "jsonwebtoken";

/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
  namespace Express {
    export interface Request {
      user: JwtPayload | null;
    }
  }
}
