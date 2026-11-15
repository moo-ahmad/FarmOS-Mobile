import { z } from 'zod';

import {
  isLocalDate,
  isNonNegativeMoney,
  isPositiveDecimal,
  isPositiveMoney,
} from '@/lib/forms/rules';

import { payBasisNeeds } from './model';

const optionalPositive = (message: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === '' || isPositiveDecimal(value), message);

// Lines also carry the API fields this form doesn't edit (stock item link, meter
// readings, piece-rate unit), so editing an activity sends them back unchanged.

export const inputLineSchema = z.object({
  itemId: z.number().nullable(),
  dilutionRatePerAcre: z.string().nullable(),
  itemName: z
    .string()
    .trim()
    .min(1, 'Name the input')
    .max(150, 'Max 150 characters'),
  quantityValue: z
    .string()
    .trim()
    .refine(isPositiveDecimal, 'Enter a quantity above 0'),
  uomId: z
    .number()
    .nullable()
    .refine((value): boolean => value !== null, 'Pick a unit'),
  unitCost: z
    .string()
    .trim()
    .refine(isNonNegativeMoney, 'Enter a cost of 0 or more'),
});

export const laborLineSchema = z
  .object({
    unitUomId: z.number().nullable(),
    workerId: z
      .number()
      .nullable()
      .refine((value): boolean => value !== null, 'Pick a worker'),
    payBasis: z.number(),
    hours: optionalPositive('Enter hours above 0'),
    units: optionalPositive('Enter units above 0'),
    rate: z.string().trim().refine(isPositiveMoney, 'Enter a rate above 0'),
  })
  .superRefine((line, ctx) => {
    const needs = payBasisNeeds(line.payBasis);
    if (needs === 'hours' && line.hours === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['hours'],
        message: 'Hourly pay needs hours',
      });
    }
    if (needs === 'units' && line.units === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['units'],
        message: 'Piece rate needs units',
      });
    }
  });

export const machineLineSchema = z.object({
  assetId: z.number().nullable(),
  startMeter: z.string().nullable(),
  endMeter: z.string().nullable(),
  machineName: z
    .string()
    .trim()
    .min(1, 'Name the machine')
    .max(150, 'Max 150 characters'),
  hours: z.string().trim().refine(isPositiveDecimal, 'Enter hours above 0'),
  hourlyChargeRate: z
    .string()
    .trim()
    .refine(isNonNegativeMoney, 'Enter a rate of 0 or more'),
  fuelQuantity: optionalPositive('Enter litres above 0, or leave empty'),
  fuelCost: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || isNonNegativeMoney(value),
      'Enter a cost of 0 or more, or leave empty',
    ),
  operatorWorkerId: z.number().nullable(),
});

/**
 * Log/Edit activity — mirrors `CreateActivityCommandValidator`: a type, a
 * date, a target (crop cycle, field or the whole farm), a title ≤150 (filled
 * from the type when left empty), and every line valid. Decimals stay strings
 * end to end.
 */
export const activityFormSchema = z
  .object({
    activityType: z.number(),
    activityDate: z
      .string()
      .trim()
      .refine(isLocalDate, 'Enter a date as YYYY-MM-DD'),
    status: z.number(),
    target: z.enum(['cycle', 'field', 'farm']),
    cropCycleId: z.number().nullable(),
    fieldId: z.number().nullable(),
    title: z.string().trim().max(150, 'Max 150 characters'),
    description: z.string().trim().max(2000, 'Max 2000 characters'),
    inputs: z.array(inputLineSchema),
    laborLines: z.array(laborLineSchema),
    machineLines: z.array(machineLineSchema),
  })
  .superRefine((values, ctx) => {
    if (values.target === 'cycle' && values.cropCycleId === null) {
      ctx.addIssue({
        code: 'custom',
        path: ['cropCycleId'],
        message: 'Pick a crop cycle',
      });
    }
    if (values.target === 'field' && values.fieldId === null) {
      ctx.addIssue({
        code: 'custom',
        path: ['fieldId'],
        message: 'Pick a field',
      });
    }
  });

export type ActivityFormValues = z.infer<typeof activityFormSchema>;
export type InputLineValues = z.infer<typeof inputLineSchema>;
export type LaborLineValues = z.infer<typeof laborLineSchema>;
export type MachineLineValues = z.infer<typeof machineLineSchema>;
