import { z } from 'zod';

import { isLocalDate, isPositiveDecimal } from '@/lib/forms/rules';

const optionalDate = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || isLocalDate(value),
    'Enter a date as YYYY-MM-DD, or leave empty',
  );

const requiredPick = (message: string) =>
  z
    .number()
    .nullable()
    // Annotated `boolean` so TS doesn't infer a type guard and narrow the
    // output to `number` — the form's values start (and stay typed) nullable.
    .refine((value): boolean => value !== null, message);

/**
 * New/Edit crop cycle — mirrors `CreateCropCycleCommandValidator` /
 * `UpdateCropCycleCommandValidator`: a field, season and crop, sown area > 0
 * (the API also caps it at the field's area). Planned harvest can't precede
 * planned sowing. Area stays a string (decimal rule).
 */
export const cropCycleFormSchema = z
  .object({
    fieldId: requiredPick('Pick a field'),
    seasonId: requiredPick('Pick a season'),
    cropId: requiredPick('Pick a crop'),
    varietyId: z.number().nullable(),
    areaSownValue: z
      .string()
      .trim()
      .refine(isPositiveDecimal, 'Enter an area above 0'),
    plannedSowDate: optionalDate,
    plannedHarvestDate: optionalDate,
    notes: z.string().trim().max(1000, 'Max 1000 characters'),
  })
  .refine(
    (values) =>
      values.plannedSowDate === '' ||
      values.plannedHarvestDate === '' ||
      values.plannedHarvestDate >= values.plannedSowDate,
    {
      message: 'Harvest must be on or after sowing',
      path: ['plannedHarvestDate'],
    },
  );

export type CropCycleFormValues = z.infer<typeof cropCycleFormSchema>;
