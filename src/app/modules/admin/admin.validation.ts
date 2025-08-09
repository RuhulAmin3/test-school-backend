import { z } from "zod";

export const createAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: "phone number is required",
    }),
    password: z.string({
      required_error: "password is required",
    }),
    role: z.string({
      required_error: "role is required",
    }),
    name: z.object({
      firstName: z.string({
        required_error: "first name is required",
      }),
      middleName: z.string().optional(),
      lastName: z.string({
        required_error: "last name is required",
      }),
    }),
    address: z.string({
      required_error: "address is required",
    }),
  }),
});

export const adminLoginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: "phone number is required",
    }),
    password: z.string({
      required_error: "password is required",
    }),
  }),
});

export const updateAdminProfileZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string().optional(),
    password: z.string().optional(),
    role: z.string().optional(),
    name: z
      .object({
        firstName: z.string().optional(),
        middleName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    address: z.string().optional(),
  }),
});
