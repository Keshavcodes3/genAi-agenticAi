import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50)
    .trim(),

  email: z
    .string()
    .email()
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8)
    .max(100),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1),
});