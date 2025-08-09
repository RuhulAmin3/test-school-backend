import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import { IUser, IUserMethods, UserModel } from "./user.interface";
import config from "../../../config";
import { ApiError } from "../../../error/ApiError";
import httpStatus from "http-status";
import { USER_ROLE } from "../../../enums/enum";

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.methods.isUserExist = async function (
  phoneNumber: string
): Promise<IUser | null> {
  return await User.findOne({ phoneNumber });
};

userSchema.statics.isPasswordCorrect = async function (
  savedPassword: string,
  givenPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre("save", async function (next) {
  const user = await User.findOne({ email: this.email });
  if (user) {
    throw new ApiError(httpStatus.CONFLICT, "user already exist");
  }

  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_solt_label)
  );

  next();
});

userSchema.index({ email: 1 }, { unique: true });

export const User = model<IUser, UserModel>("user", userSchema);
