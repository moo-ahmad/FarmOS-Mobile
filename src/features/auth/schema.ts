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
