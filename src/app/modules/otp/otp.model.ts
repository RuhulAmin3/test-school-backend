import { Schema, model } from "mongoose";
import { IOtp } from "./otp.interface";
import { OTP_TYPE } from "../../../enums/enum";

const OtpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true },

    otp: { type: String, required: true },

    type: {
      type: String,
      enum: [OTP_TYPE.EMAIL_VERIFICATION, OTP_TYPE.PASSWORD_RESET],
      required: true,
    },
    
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },

    // attemptsResetTime: {
    //   type: Date,
    //   default: () => {
    //     const date = new Date();
    //     date.setMinutes(date.getMinutes() + 5); // Default to 5 minutes from now
    //     return date;
    //   },
    // },

    expiresAt: { type: Date, required: true },

    isUsed: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

export const Otp = model<IOtp>("otp", OtpSchema);
