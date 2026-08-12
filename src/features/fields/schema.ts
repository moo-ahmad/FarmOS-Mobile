import { z } from 'zod';

import { compareQuantity, toQuantity, ZERO_QUANTITY } from '@/lib/decimal';

import { AREA_UNITS, IRRIGATION_SOURCES, SOIL_TYPES } from './model';

function isPositiveArea(value: string): boolean {
  try {
    return compareQuantity(toQuantity(value), ZERO_QUANTITY) > 0;
  } catch {
    return false;
  }
}

/** Validation for the Add Field form. */
export const addFieldFormSchema = z.object({
  code: z.string().trim().min(1, 'validation.required'),
  name: z.string().trim().optional(),
  area: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .refine(isPositiveArea, 'validation.area'),
  unit: z.enum(AREA_UNITS),
  soilType: z.enum(SOIL_TYPES),
  irrigationSource: z.enum(IRRIGATION_SOURCES),
});

export type AddFieldFormValues = z.infer<typeof addFieldFormSchema>;
