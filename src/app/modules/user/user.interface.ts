import { Model } from "mongoose";
import { USER_ROLE } from "../../../enums/enum";

export type IUser = {
  firstName: string;
  lastName: string;
  password: string;
  role: USER_ROLE;
  email: string;
  profileImage?: string;
  isEmailVerified?: boolean;
};

export type IUserMethods = {
  // here we declared our instance methods
  isUserExist(phoneNumber: string): Promise<IUser | null>;
} & IUser;

export type UserModel = {
  isPasswordCorrect( // here we can declared our statics methods and merge methods
    savedPassword: string,
    givenPassword: string
  ): Promise<boolean>;
} & Model<IUser, object, IUserMethods>;

export type IUserFilterData = {
  page?: string;
  limit?: string;
  sortBy?: string;
  searchTerm?: string;
  sortOrder?: "asc" | "desc";
  role?:USER_ROLE,
};

export type IProfile = {
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  isEmailVerified?: boolean;
};
