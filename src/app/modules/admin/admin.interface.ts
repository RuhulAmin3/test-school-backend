import { Model } from "mongoose";

type AdminName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type IAdmin = {
  phoneNumber: string;
  role: "admin";
  password: string;
  name: AdminName;
  address: string;
};

export type AdminModel = Model<IAdmin>;

export type IAdminLoginData = {
  phoneNumber: string;
  password: string;
};

export type IAdminLoginResponse = {
  accessToken?: string;
  refreshToken?: string;
};
