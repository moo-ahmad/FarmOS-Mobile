import { z } from 'zod';

import {
  isLocalDate,
  isPositiveDecimal,
  isPositiveMoney,
} from '@/lib/forms/rules';

import { EMPLOYMENT_TYPES } from './model';

const optionalRate = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || isPositiveMoney(value),
    'Enter an amount above 0, or leave empty',
  );

/**
 * Add/Edit Worker form — mirrors `CreateWorkerCommandValidator` /
 * `UpdateWorkerCommandValidator`: name required ≤150, a known employment
 * type, every rate > 0 when given, overtime multiplier > 0, CNIC ≤20,
 * phone ≤30, skills ≤200. Join date is a real `YYYY-MM-DD` date. Rates stay
 * strings (decimal rule).
 */
export const workerFormSchema = z.object({
  name: z.string().trim().min(1, 'Enter a name').max(150, 'Max 150 characters'),
  employmentType: z
    .number()
    .refine(
      (value) => (EMPLOYMENT_TYPES as readonly number[]).includes(value),
      'Pick an employment type',
    ),
  joinDate: z.string().trim().refine(isLocalDate, 'Enter a date as YYYY-MM-DD'),
  dailyWage: optionalRate,
  hourlyRate: optionalRate,
  monthlySalary: optionalRate,
  overtimeMultiplier: z
    .string()
    .trim()
    .refine(isPositiveDecimal, 'Enter a multiplier above 0, e.g. 1.5'),
  cnicOrId: z.string().trim().max(20, 'Max 20 characters'),
  phone: z.string().trim().max(30, 'Max 30 characters'),
  skills: z.string().trim().max(200, 'Max 200 characters'),
});

export type WorkerFormValues = z.infer<typeof workerFormSchema>;
