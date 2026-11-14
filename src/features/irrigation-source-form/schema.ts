import { z } from 'zod';

import {
  compareMoney,
  compareQuantity,
  toMoney,
  toQuantity,
  ZERO_MONEY,
  ZERO_QUANTITY,
} from '@/lib/decimal';

import { COST_KINDS, SOURCE_KINDS } from './model';

function isNonNegativeMoney(value: string): boolean {
  try {
    return compareMoney(toMoney(value), ZERO_MONEY) >= 0;
  } catch {
    return false;
  }
}

function isPositiveQuantity(value: string): boolean {
  try {
    return compareQuantity(toQuantity(value), ZERO_QUANTITY) > 0;
  } catch {
    return false;
  }
}

/**
 * Mirrors the backend's `CreateIrrigationSourceCommandValidator`: name
 * required ≤150 chars, both enums valid, rate ≥ 0, discharge > 0 when given.
 * The rate is only asked for (and required) under a paid cost model — a
 * "Free" source sends 0. Decimals stay strings throughout.
 */
export const irrigationSourceFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Enter a name')
      .max(150, 'Max 150 characters'),
    sourceKind: z.enum(SOURCE_KINDS),
    costKind: z.enum(COST_KINDS),
    ratePerUnit: z.string().trim(),
    dischargeLpm: z.string().trim(),
  })
  .superRefine((values, ctx) => {
    if (values.costKind !== 'Free') {
      if (!values.ratePerUnit) {
        ctx.addIssue({
          code: 'custom',
          path: ['ratePerUnit'],
          message: 'Enter a rate',
        });
      } else if (!isNonNegativeMoney(values.ratePerUnit)) {
        ctx.addIssue({
          code: 'custom',
          path: ['ratePerUnit'],
          message: 'Enter a valid amount (0 or more)',
        });
      }
    }
    if (values.dischargeLpm && !isPositiveQuantity(values.dischargeLpm)) {
      ctx.addIssue({
        code: 'custom',
        path: ['dischargeLpm'],
        message: 'Enter a flow above 0, or leave it blank',
      });
    }
  });

export type IrrigationSourceFormValues = z.infer<
  typeof irrigationSourceFormSchema
>;
