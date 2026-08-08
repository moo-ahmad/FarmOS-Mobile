import { z } from 'zod';

import { compareQuantity, toQuantity, ZERO_QUANTITY } from '@/lib/decimal';

import { OPERATIONS, requiresSprayDetails } from './model';

// Error messages are i18n keys, translated in the form via `t(error.message)`.

function isPositiveQuantity(value: string): boolean {
  try {
    return compareQuantity(toQuantity(value), ZERO_QUANTITY) > 0;
  } catch {
    return false;
  }
}

/**
 * Validation for the Log Activity form. `product`/`doseValue`/`waterValue` are
 * only required when the operation is a spray (they don't apply otherwise, per
 * the design). Dose/water are validated as decimal *strings* — never coerced
 * to a JS number.
 */
export const activityLogFormSchema = z
  .object({
    operation: z.enum(OPERATIONS),
    fieldCode: z.string().min(1, 'validation.required'),
    cropLabel: z.string().min(1, 'validation.required'),
    product: z.string().trim().optional(),
    doseValue: z.string().trim().optional(),
    waterValue: z.string().trim().optional(),
  })
  .superRefine((values, ctx) => {
    if (!requiresSprayDetails(values.operation)) return;

    if (!values.product) {
      ctx.addIssue({
        code: 'custom',
        path: ['product'],
        message: 'validation.required',
      });
    }
    if (!values.doseValue || !isPositiveQuantity(values.doseValue)) {
      ctx.addIssue({
        code: 'custom',
        path: ['doseValue'],
        message: 'validation.positiveNumber',
      });
    }
    if (!values.waterValue || !isPositiveQuantity(values.waterValue)) {
      ctx.addIssue({
        code: 'custom',
        path: ['waterValue'],
        message: 'validation.positiveNumber',
      });
    }
  });

export type ActivityLogFormValues = z.infer<typeof activityLogFormSchema>;
