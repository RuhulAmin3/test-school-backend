import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_DEV,
  mongodb_uri: process.env.MONGODB_URI,
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
  otp: {
    otp_length: parseInt(process.env.OTP_LENGTH || "6"),
    expires_in_minutes: parseInt(process.env.OTP_EXPIRES_IN_MINUTES || "5"),
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_expires_in: process.env.REFRESH_EXPIRES_IN,
  },
  
  bcrypt_solt_label: process.env.BCRYPT_SALT_LABEL,

  cloud: {
    endpoint: process.env.DO_SPACE_ENDPOINT,
    secret_key: process.env.DO_SPACE_SECRET_KEY,
    access_key: process.env.DO_SPACE_ACCESS_KEY,
    bucket: process.env.DO_SPACE_BUCKET,
  },
};
