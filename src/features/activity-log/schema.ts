import { z } from 'zod';

import {
  compareMoney,
  compareQuantity,
  toMoney,
  toQuantity,
  ZERO_MONEY,
  ZERO_QUANTITY,
} from '@/lib/decimal';

import { ACTIVITY_TYPES, UNITS } from './model';

// Error messages are i18n keys, translated in the form via `t(error.message)`.

function isPositiveQuantity(value: string): boolean {
  try {
    return compareQuantity(toQuantity(value), ZERO_QUANTITY) > 0;
  } catch {
    return false;
  }
}

function isNonNegativeMoney(value: string): boolean {
  try {
    return compareMoney(toMoney(value), ZERO_MONEY) >= 0;
  } catch {
    return false;
  }
}

/**
 * Validation for the activity-log form. Mirrors the API's FluentValidation
 * rules: required type/unit, a positive quantity, an optional non-negative cost.
 * Quantity and cost are validated as decimal *strings* — never coerced to a JS
 * number.
 */
export const activityLogFormSchema = z.object({
  activityType: z.enum(ACTIVITY_TYPES),
  quantity: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .refine(isPositiveQuantity, 'validation.positiveNumber'),
  unit: z.enum(UNITS),
  cost: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) =>
        value === undefined || value === '' || isNonNegativeMoney(value),
      'validation.amount',
    ),
  notes: z.string().trim().max(500, 'validation.tooLong').optional(),
});

export type ActivityLogFormValues = z.infer<typeof activityLogFormSchema>;
