import type {
  CreateCropCycleRequestBody,
  CropCycleDto,
  UpdateCropCycleRequestBody,
} from '@/lib/crop-cycles';
import { emptyToNull } from '@/lib/forms/rules';

import type { CropCycleFormValues } from './schema';

/** A new cycle's starting values, optionally pre-filled (e.g. from a season or field). */
export function emptyCropCycleForm(
  preset: { fieldId?: number; seasonId?: number } = {},
): CropCycleFormValues {
  return {
    fieldId: preset.fieldId ?? null,
    seasonId: preset.seasonId ?? null,
    cropId: null,
    varietyId: null,
    areaSownValue: '',
    plannedSowDate: '',
    plannedHarvestDate: '',
    notes: '',
  };
}

const decimalToString = (value: number | null) =>
  value === null ? null : String(value);

/** A cycle as the form's starting values (area as the string the user edits). */
export function toCropCycleFormValues(
  cycle: CropCycleDto,
): CropCycleFormValues {
  return {
    fieldId: cycle.fieldId,
    seasonId: cycle.seasonId,
    cropId: cycle.cropId,
    varietyId: cycle.varietyId,
    areaSownValue: String(cycle.areaSownValue),
    plannedSowDate: cycle.plannedSowDate ?? '',
    plannedHarvestDate: cycle.plannedHarvestDate ?? '',
    notes: cycle.notes ?? '',
  };
}

/**
 * Validated values as the POST body. Area is in the field's own unit and the
 * yield in the crop's default unit; seed details are left to the Sowing
 * activity, which keeps them in sync on the server.
 */
export function toCreateCropCycleRequest(
  values: CropCycleFormValues,
  units: { areaUomId: number; yieldUomId: number },
): CreateCropCycleRequestBody {
  if (
    values.fieldId === null ||
    values.seasonId === null ||
    values.cropId === null
  ) {
    throw new Error('Field, season and crop are required.');
  }
  return {
    fieldId: values.fieldId,
    seasonId: values.seasonId,
    cropId: values.cropId,
    varietyId: values.varietyId,
    areaSownValue: values.areaSownValue.trim(),
    areaUomId: units.areaUomId,
    yieldUomId: units.yieldUomId,
    plannedSowDate: emptyToNull(values.plannedSowDate),
    plannedHarvestDate: emptyToNull(values.plannedHarvestDate),
    expectedYieldValue: null,
    seedQuantityValue: null,
    seedUomId: null,
    seedSupplierId: null,
    seedLotCode: null,
    seedCost: null,
    plantPopulationPerAcre: null,
    isIntercrop: false,
    intercropParentCycleId: null,
    areaSharePct: '100',
    notes: emptyToNull(values.notes),
  };
}

/**
 * Validated values as the PUT body. PUT replaces every editable detail, so
 * the ones this form doesn't show (expected yield, seed, plant population)
 * are carried over from the cycle unchanged.
 */
export function toUpdateCropCycleRequest(
  values: CropCycleFormValues,
  cycle: CropCycleDto,
): UpdateCropCycleRequestBody {
  return {
    varietyId: values.varietyId,
    areaSownValue: values.areaSownValue.trim(),
    areaUomId: cycle.areaUomId,
    plannedSowDate: emptyToNull(values.plannedSowDate),
    plannedHarvestDate: emptyToNull(values.plannedHarvestDate),
    expectedYieldValue: decimalToString(cycle.expectedYieldValue),
    seedQuantityValue: decimalToString(cycle.seedQuantityValue),
    seedUomId: cycle.seedUomId,
    seedSupplierId: cycle.seedSupplierId,
    seedLotCode: cycle.seedLotCode,
    seedCost: decimalToString(cycle.seedCost),
    plantPopulationPerAcre: cycle.plantPopulationPerAcre,
    notes: emptyToNull(values.notes),
  };
}
