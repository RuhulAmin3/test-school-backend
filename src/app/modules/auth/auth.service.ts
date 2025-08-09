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
import { emailVerificationTemplate } from "../../../template/EmailVerification";
import { resetPasswordTemplate } from "../../../template/resetPassword";

export const registerUser = async (
  data: IUser
): Promise<Omit<IUser, "password"> | null> => {

  const result = await User.create(data);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "failed to create user");
  }

  const { password, ...restData } = result.toObject();

  const otpCode = generateOTP();

  const expiresAt = new Date();

  expiresAt.setMinutes(
    expiresAt.getMinutes() + parseInt(`${config.otp.expires_in_minutes}` || "5")
  ); // expires in 5 minutes

  // Delete existing OTPs for this email and type
  await Otp.deleteMany({
    email: data.email.toLowerCase(),
    type: OTP_TYPE.EMAIL_VERIFICATION,
  });

  const otp = new Otp({
    email: data.email.toLowerCase(),
    otp: otpCode,
    type: OTP_TYPE.EMAIL_VERIFICATION,
    expiresAt,
  });

  await otp.save();

  emailSender(
    "Email Verification Code from Test School",
    restData.email,
    emailVerificationTemplate(otpCode)
  );

  return restData;
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


