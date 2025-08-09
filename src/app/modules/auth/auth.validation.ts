import { z } from "zod";
import { USER_ROLE, OTP_TYPE } from "../../../enums/enum";

// Register User
export const registerUserZodSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: "First name is required" }).trim(),
    lastName: z.string({ required_error: "Last name is required" }).trim(),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
    role: z
      .enum(Object.values(USER_ROLE) as [string, ...string[]])
      .default(USER_ROLE.STUDENT),
    profileImage: z.string().url().nullable().optional(),
  }),
});

// Login User
export const loginUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    password: z.string({ required_error: "Password is required" }),
  }),
});

// Refresh Token
export const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: "Refresh token is required" }),
  }),
});

// Verify Email
export const verifyEmailZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    otp: z.string({ required_error: "OTP is required" }),
  }),
});

// Send Reset Password OTP
export const sendResetPasswordOtpZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
  }),
});

// Reset Password
export const resetPasswordZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    otp: z.string({ required_error: "OTP is required" }),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(6, "Password must be at least 6 characters long"),
  }),
});

// Change Password
export const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Old password is required" }),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(6, "Password must be at least 6 characters long"),
  }),
});

// Update Profile
export const updateProfileZodSchema = z.object({
  body: z.object({
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    profileImage: z.string().url().nullable().optional(),
  }),
});

// Resend OTP
export const resendOtpZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    type: z.enum([OTP_TYPE.EMAIL_VERIFICATION, OTP_TYPE.PASSWORD_RESET], {
      required_error: "OTP type is required",
    }),
  }),
});
