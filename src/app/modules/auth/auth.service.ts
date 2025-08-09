/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { ApiError } from "../../../error/ApiError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { ILogin, ILoginResponse } from "./auth.interface";
import { createToken, varifyToken } from "../../../utils/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { generateOTP } from "./auth.utils";
import { Otp } from "../otp/otp.model";
import { OTP_TYPE } from "../../../enums/enum";
import emailSender from "../../../shared/emailTemplate";
import { resetPasswordTemplate } from "../../../template/resetPassword";
import { emailVerificationTemplate } from "../../../template/emailVerification";

export const registerUser = async (data: IUser) => {

  const result = await User.create(data);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "failed to create user");
  }

  const { password, ...restData } = result.toObject();

  // Send email verification OTP
  await sendEmailVerificationOtpService(result.email);

  // Generate tokens
  const accessToken: string = createToken(
    { id: result.toJSON()._id, role: result.toJSON().role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken: string = createToken(
    { id: result.toJSON()._id, role: result.toJSON().role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return { data: restData, accessToken, refreshToken };
};

export const loginUserService = async (
  data: ILogin
): Promise<ILoginResponse> => {
  // Find user by email
  const user = await User.findOne({ email: data.email.toLowerCase() });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  // Check password
  const isPasswordCorrect = await User.isPasswordCorrect(
    user.password as string,
    data.password as string
  );

  if (!isPasswordCorrect) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "incorrect password");
  }

  // Generate tokens
  const accessToken: string = createToken(
    { id: user._id, role: user.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken: string = createToken(
    { id: user._id, role: user.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const refreshTokenService = async (token: string): Promise<string> => {
  let decodedData = null;
  try {
    decodedData = varifyToken(token, config.jwt.refresh_secret as Secret);
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, "refresh token is not valid");
  }

  const { id } = decodedData;
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }

  const accessToken = createToken(
    { id: user._id, role: user.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return accessToken;
};

export const verifyEmailService = async (
  email: string,
  otpCode: string
): Promise<string> => {
  // Find valid OTP
  const otp = await Otp.findOne({
    email: email.toLowerCase(),
    otp: otpCode,
    type: OTP_TYPE.EMAIL_VERIFICATION,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
  }

  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Mark email as verified
  user.isEmailVerified = true;
  await user.save();

  // Mark OTP as used
  otp.isUsed = true;
  await otp.save();

  return "Email verified successfully";
};

export const sendResetPasswordOtpService = async (
  email: string
): Promise<string> => {
  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Generate OTP
  const otpCode = generateOTP();
  const expiresAt = new Date();
  expiresAt.setMinutes(
    expiresAt.getMinutes() + parseInt(process.env.OTP_EXPIRES_IN_MINUTES || "5")
  );

  // Delete existing OTPs for this email and type
  await Otp.deleteMany({
    email: email.toLowerCase(),
    type: OTP_TYPE.PASSWORD_RESET,
  });

  // Create new OTP
  const otp = new Otp({
    email: email.toLowerCase(),
    otp: otpCode,
    type: OTP_TYPE.PASSWORD_RESET,
    expiresAt,
  });

  await otp.save();

  emailSender(
    "Password Reset OTP from Test School",
    user.email,
    resetPasswordTemplate(otpCode)
  );

  return "Password reset OTP sent successfully";
};

export const resetPasswordService = async (
  email: string,
  otpCode: string,
  newPassword: string
): Promise<string> => {
  // Find valid OTP
  const otp = await Otp.findOne({
    email: email.toLowerCase(),
    otp: otpCode,
    type: OTP_TYPE.PASSWORD_RESET,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
  }

  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Update password
  user.password = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_solt_label)
  );
  await user.save();

  // Mark OTP as used
  otp.isUsed = true;
  await otp.save();

  return "Password reset successfully";
};

export const changePasswordService = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  // Find user
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(
    oldPassword,
    user.password
  );
  if (!isCurrentPasswordValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Current password is incorrect");
  }

  // Check if new password is different from current
  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "New password must be different from current password"
    );
  }

  // Hash new password
  const saltRounds = parseInt(config.bcrypt_solt_label || "10");

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update password
  user.password = hashedPassword;
  await user.save();

  return { message: "Password changed successfully" };
};

export const getCurrentUserService = async (
  userId: string
): Promise<IUser | null> => {
  // Find user by ID
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

export const updateProfileService = async (
  userId: string,
  updateData: Partial<
    Omit<IUser, "password" | "isEmailVerified" | "role" | "email">
  >
): Promise<IUser | null> => {
  // Find user by ID
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  // Update user profile
  Object.assign(user, updateData);
  const updatedUser = await user.save();
  return updatedUser.toJSON();
};

const sendEmailVerificationOtpService = async (email: string) => {
  const otpCode = generateOTP();

  const expiresAt = new Date();

  expiresAt.setMinutes(
    expiresAt.getMinutes() + parseInt(`${config.otp.expires_in_minutes}` || "5")
  ); // expires in 5 minutes

  // Delete existing OTPs for this email and type
  await Otp.deleteMany({
    email: email,
    type: OTP_TYPE.EMAIL_VERIFICATION,
  });

  const otp = new Otp({
    email: email,
    otp: otpCode,
    type: OTP_TYPE.EMAIL_VERIFICATION,
    expiresAt,
  });

  await otp.save();

  emailSender(
    "Email Verification Code from Test School",
    email,
    emailVerificationTemplate(otpCode)
  );
};

export const resendOTPService = async (
  email: string,
  type: OTP_TYPE
): Promise<string> => {
  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Send OTP via email
  if (type === OTP_TYPE.EMAIL_VERIFICATION) {
    await sendEmailVerificationOtpService(email);
  } else if (type === OTP_TYPE.PASSWORD_RESET) {
    return await sendResetPasswordOtpService(email);
  }
  return "OTP sent successfully";
};
