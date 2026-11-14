import type { FieldDto } from '@/lib/fields';

import type { AddFieldFormValues } from './schema';

/** A field as the form's starting values. */
export function toFieldFormValues(field: FieldDto): AddFieldFormValues {
  return {
    code: field.code,
    name: field.name,
    // Display/edit only: the API sends areaValue as a JSON number, and the
    // form keeps it as the string the user edits (no arithmetic here).
    area: String(field.areaValue),
    areaUomId: field.areaUomId,
    usageType: field.usageType as AddFieldFormValues['usageType'],
    soilTexture: field.soilTexture,
    primaryIrrigationSourceId: field.primaryIrrigationSourceId,
  };
}
