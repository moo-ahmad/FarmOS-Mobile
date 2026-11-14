import { z } from 'zod';

import { isDecimalBetween, isNonNegativeMoney } from '@/lib/forms/rules';

import { CUSTOMER_TYPES } from './model';

/**
 * Add/Edit Customer form — mirrors `CreateCustomerCommandValidator` /
 * `UpdateCustomerCommandValidator`: name required ≤150, a known customer
 * type, commission 0–100 %, credit days ≥ 0, credit limit ≥ 0 when given,
 * phone ≤30, address ≤300. Numbers stay strings (decimal rule).
 */
export const customerFormSchema = z.object({
  name: z.string().trim().min(1, 'Enter a name').max(150, 'Max 150 characters'),
  customerType: z
    .number()
    .refine(
      (value) => (CUSTOMER_TYPES as readonly number[]).includes(value),
      'Pick a customer type',
    ),
  commissionPct: z
    .string()
    .trim()
    .refine(
      (value) => isDecimalBetween(value, '0', '100'),
      'Enter a percentage from 0 to 100',
    ),
  creditTermDays: z
    .string()
    .trim()
    .regex(/^\d{1,4}$/, 'Enter whole days (0 for cash)'),
  creditLimit: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || isNonNegativeMoney(value),
      'Enter a valid amount, or leave empty',
    ),
  phone: z.string().trim().max(30, 'Max 30 characters'),
  address: z.string().trim().max(300, 'Max 300 characters'),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
