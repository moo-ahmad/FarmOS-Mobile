import { z } from 'zod';

/**
 * Manager sign-in form. `identifier` accepts an email or phone (the API decides
 * which); error messages are i18n keys translated in the form.
 */
export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'validation.required'),
  password: z.string().min(1, 'validation.required'),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const REGISTER_MODES = ['new', 'existing'] as const;
export type RegisterMode = (typeof REGISTER_MODES)[number];

/** Create-farm (sign-up) form — the "new account" register mode. */
export const registerSchema = z
  .object({
    farmName: z.string().trim().min(1, 'validation.required'),
    ownerName: z.string().trim().min(1, 'validation.required'),
    email: z
      .string()
      .trim()
      .min(1, 'validation.required')
      .email('validation.email'),
    password: z.string().min(1, 'validation.required'),
    confirmPassword: z.string().min(1, 'validation.required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.passwordMismatch',
    path: ['confirmPassword'],
  });

export type RegisterValues = z.infer<typeof registerSchema>;

/**
 * Add-farm form — the "add to existing account" register mode: sign in with
 * an existing account, then name the new farm being added to it.
 */
export const joinFarmSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .email('validation.email'),
  password: z.string().min(1, 'validation.required'),
  farmName: z.string().trim().min(1, 'validation.required'),
});

export type JoinFarmValues = z.infer<typeof joinFarmSchema>;
