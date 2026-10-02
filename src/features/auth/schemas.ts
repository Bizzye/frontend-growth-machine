import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;

/** Mirrors the password rules enforced by the backend. */
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`)
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
  .regex(/\d/, "Password must contain at least 1 number")
  .regex(/[!@#$%^&*()_+{}[\]:;<>,.?~\\-]/, "Password must contain at least 1 special character");

const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Please enter a valid e-mail"));

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Please enter your password"),
});

export const registerSchema = z.object({
  firstName: z.string().trim().min(3, "First name must be at least 3 characters long"),
  lastName: z.string().trim().min(3, "Last name must be at least 3 characters long"),
  birthDate: z
    .string()
    .optional()
    .refine((value) => !value || new Date(value) <= new Date(), "Birth date cannot be in the future"),
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
