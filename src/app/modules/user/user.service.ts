/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortOrder } from "mongoose";
import { calculatePagination } from "../../../shared/caculatePagination";
import { IUserFilterData, IUser, IProfile } from "./user.interface";
import { User } from "./user.model";
import { userFilterAbleFields } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";
import config from "../../../config";
import { ApiError } from "../../../error/ApiError";
import httpStatus from "http-status";
import { hashedPassword } from "../../../utils/protectPassword";

export const createUserService = async (data: IUser): Promise<IUser> => {
  const result = await User.create(data);
  return result;
};

export const getAllUserService = async (
  filteredData: IUserFilterData
): Promise<IUser[] | null> => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...restQuery } =
    filteredData || {};

  const skip = calculatePagination(Number(page), Number(limit));

  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: userFilterAbleFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.entries(restQuery).length > 0) {
    andCondition.push({
      $and: Object.entries(restQuery).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await User.find(whereCondition, { password: 0 })
    .sort(sortCondition)
    .skip(skip)
    .limit(Number(limit));
  return result;
};

export const getSingleUserService = async (
  id: string
): Promise<IUser | null> => {
  const result = await User.findById(id, { password: 0 });
  return result;
};

export const updateUserService = async (
  id: string,
  data: IUser
): Promise<IUser | null> => {
  const { name, password, ...restData } = data;
  let hashPassword = password;
  if (password) {
    hashPassword = await hashedPassword(
      password,
      Number(config.bcrypt_solt_label)
    );
  }
  const userData = { ...restData, password: hashPassword };
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach((key) => {
      const userNameKey = `name.${key}` as keyof typeof name;
      (userData as any)[userNameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findByIdAndUpdate(id, userData, {
    new: true,
  }).select("-password");

  return result;
};

export const deleteUserService = async (id: string): Promise<IUser | null> => {
  const result = await User.findOneAndDelete({ _id: id }).select("-password");
  return result;
};

// profile services
export const profileService = async (
  user: JwtPayload
): Promise<IUser | null> => {
  const { id, role } = user;
  const result = await User.findOne({ _id: id, role }, { password: 0 });
  return result;
};

export const updateProfileService = async (
  user: JwtPayload,
  data: IProfile
): Promise<IUser | null> => {
  const { id, role } = user;
  const renter = await User.findOne({ _id: id, role });
  if (!renter) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }
  if (renter && id != renter.id) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "you can update only your account. This is not your account"
    );
  }
  const { password, name, ...restData } = data;
  let hashPassword = password;
  if (password) {
    hashPassword = await hashedPassword(
      password,
      Number(config.bcrypt_solt_label)
    );
  }
  const updatedData = { ...restData, password: hashPassword };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach((key) => {
      const namedKey = `name.${key}`;
      (updatedData as any)[namedKey] = name[key as keyof typeof name];
    });
  }
  const result = await User.findByIdAndUpdate({ _id: id, role }, updatedData, {
    new: true,
  }).select("-password");
  return result;
};
