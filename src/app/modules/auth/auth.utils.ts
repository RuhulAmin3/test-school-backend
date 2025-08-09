import crypto from "crypto";
import config from "../../../config";

export const generateOTP = (): string => {
    const length = config.otp.otp_length || 6; // Default to 6 if not set
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return crypto.randomInt(min, max + 1).toString().padStart(length, "0");
};
