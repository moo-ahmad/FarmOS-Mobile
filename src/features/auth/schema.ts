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

/** Create-farm (sign-up) form. Only the "new account" mode is validated. */
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
