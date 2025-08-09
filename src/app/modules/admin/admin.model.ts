import { Schema, model } from "mongoose";
import { AdminModel, IAdmin } from "./admin.interface";
import bcrypt from "bcrypt";
import config from "../../../config";

const adminSchema = new Schema<IAdmin, Record<string, never>, AdminModel>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        middleName: {
          type: String,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

adminSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_solt_label)
  );
  next();
});

export const Admin = model<IAdmin, AdminModel>("admin", adminSchema);
