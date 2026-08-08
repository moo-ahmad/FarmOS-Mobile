import { z } from 'zod';

import { compareQuantity, toQuantity, ZERO_QUANTITY } from '@/lib/decimal';

import { GRADES } from './model';

function isPositiveQuantity(value: string): boolean {
  try {
    return compareQuantity(toQuantity(value), ZERO_QUANTITY) > 0;
  } catch {
    return false;
  }
}

function isPercent(value: string): boolean {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n <= 100;
}

/** Validation for the Log Harvest form. Net weight is derived, not entered. */
export const harvestFormSchema = z.object({
  fieldCode: z.string().min(1, 'validation.required'),
  cropLabel: z.string().min(1, 'validation.required'),
  grossWeight: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .refine(isPositiveQuantity, 'validation.positiveNumber'),
  fieldLossPercent: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .refine(isPercent, 'validation.amount'),
  grade: z.enum(GRADES),
  containers: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .refine(isPositiveQuantity, 'validation.positiveNumber'),
  moisturePercent: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .refine(isPercent, 'validation.amount'),
});

export type HarvestFormValues = z.infer<typeof harvestFormSchema>;
