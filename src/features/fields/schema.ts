import { z } from 'zod';

import { compareQuantity, toQuantity, ZERO_QUANTITY } from '@/lib/decimal';

import { AREA_UOMS, FIELD_USAGE_TYPES } from './model';

function isPositiveArea(value: string): boolean {
  try {
    return compareQuantity(toQuantity(value), ZERO_QUANTITY) > 0;
  } catch {
    return false;
  }
}

const areaUomIds = AREA_UOMS.map((uom) => uom.id);

/**
 * Validation for the Add Field form — mirrors the backend's
 * `CreateFieldCommandValidator` (code ≤20 chars, name required ≤150 chars,
 * area > 0, area unit must be an area-dimension UOM, usage type a valid
 * enum member). Soil texture and irrigation source stay optional — both are
 * nullable FKs on the backend.
 */
export const addFieldFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .max(20, 'validation.tooLong'),
  name: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .max(150, 'validation.tooLong'),
  area: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .refine(isPositiveArea, 'validation.area'),
  areaUomId: z
    .number()
    .refine((id) => areaUomIds.includes(id), 'validation.required'),
  usageType: z
    .number()
    .refine(
      (value): value is (typeof FIELD_USAGE_TYPES)[number] =>
        (FIELD_USAGE_TYPES as readonly number[]).includes(value),
      'validation.required',
    ),
  soilTextureId: z.number().nullable(),
  primaryIrrigationSourceId: z.number().nullable(),
});

export type AddFieldFormValues = z.infer<typeof addFieldFormSchema>;
