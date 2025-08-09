import { SortOrder } from "mongoose";
import { calculatePagination } from "../../../shared/caculatePagination";
import { IUserFilterData, IUser } from "./user.interface";
import { User } from "./user.model";
import { ApiError } from "../../../error/ApiError";
import httpStatus from "http-status";

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
      $or: ["firstName", "lastName"].map((field) => ({
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
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return result;
};

export const updateUserService = async (
  id: string,
  data: Partial<Omit<IUser, "password" | "isEmailVerified" | "role" | "email">>
): Promise<IUser | null> => {
  const result = await User.findByIdAndUpdate(id, data, {
    new: true,
  }).select("-password");
  return result;
};

export const deleteUserService = async (id: string): Promise<IUser | null> => {
  const result = await User.findOneAndDelete({ _id: id }).select("-password");
  return result;
};
