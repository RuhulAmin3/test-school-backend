import { z } from "zod";
import { role } from "./user.constant";

export const updateUserZodSchema = z.object({
  body: z.object({
    name: z
      .object({
        firstName: z.string().optional(),
        middleName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    password: z.string().optional(),
    phoneNumber: z.string().optional(),
    role: z.enum(role as [string, ...string[]]).optional(),
    address: z.string().optional(),
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
});

export const updateProfileZodSchema = z.object({
  body: z.object({
    name: z
      .object({
        firstName: z.string().optional(),
        middleName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    password: z.string().optional(),
    phoneNumber: z.string().optional(),
    role: z.enum(role as [string, ...string[]]).optional(),
    address: z.string().optional(),
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
});
