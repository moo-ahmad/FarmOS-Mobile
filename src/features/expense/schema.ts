import { z } from 'zod';

import { compareMoney, toMoney, ZERO_MONEY } from '@/lib/decimal';

import { EXPENSE_CATEGORIES, PAID_BY_OPTIONS } from './model';

function isPositiveAmount(value: string): boolean {
  try {
    return compareMoney(toMoney(value), ZERO_MONEY) > 0;
  } catch {
    return false;
  }
}

/** Validation for the Log Expense form. */
export const expenseFormSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .refine(isPositiveAmount, 'validation.amount'),
  category: z.enum(EXPENSE_CATEGORIES),
  payee: z.string().trim().min(1, 'validation.required'),
  fieldCode: z.string().min(1, 'validation.required'),
  cropLabel: z.string().min(1, 'validation.required'),
  paidBy: z.enum(PAID_BY_OPTIONS),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
