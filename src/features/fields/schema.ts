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
const CODE_PATTERN = /^[A-Za-z0-9]+$/;

/**
 * Validation for the Add Field form — mirrors the backend's
 * `CreateFieldCommandValidator` (name required ≤150 chars, area > 0, area
 * unit must be an area-dimension UOM, usage type a valid enum member), plus
 * stricter client-side rules for the code (≤4 alphanumeric characters,
 * unique among the farm's existing codes — the backend itself only requires
 * non-empty and ≤20 chars). Soil texture and irrigation source stay
 * optional — both are nullable FKs on the backend.
 *
 * A factory rather than a static schema because uniqueness depends on the
 * farm's current field list, fetched at render time.
 *
 * `originalCode` (Edit Field) is always accepted unchanged, so a field
 * created before the stricter code rule (e.g. "CS-1") stays editable.
 */
export function createAddFieldFormSchema(
  existingCodes: readonly string[],
  originalCode?: string,
) {
  const takenCodes = new Set(existingCodes.map((code) => code.toUpperCase()));

  return z.object({
    code: z
      .string()
      .trim()
      .min(1, 'Enter a field code')
      .superRefine((code, ctx) => {
        if (originalCode !== undefined && code === originalCode) return;
        const issue = (message: string) =>
          ctx.addIssue({ code: 'custom', message });
        if (code.length > 4) issue('Max 4 characters');
        else if (!CODE_PATTERN.test(code)) issue('Letters and numbers only');
        else if (takenCodes.has(code.toUpperCase())) {
          issue('This code is already in use');
        }
      }),
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
        (value) => (FIELD_USAGE_TYPES as readonly number[]).includes(value),
        'validation.required',
      ),
    soilTexture: z.number().nullable(),
    primaryIrrigationSourceId: z.number().nullable(),
  });
}

export type AddFieldFormValues = z.infer<
  ReturnType<typeof createAddFieldFormSchema>
>;
