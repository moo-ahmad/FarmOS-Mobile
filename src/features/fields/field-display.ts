import type { TagVariant } from '@/components/ui';
import type { FieldDto } from '@/lib/fields';

import {
  AREA_UOMS,
  FIELD_USAGE_TYPE_LABEL,
  FieldUsageType,
  SOIL_TEXTURES,
} from './model';

/** The unit code/label a field's `areaUomId` resolves to, if known. */
export function fieldAreaUom(field: Pick<FieldDto, 'areaUomId'>) {
  return AREA_UOMS.find((uom) => uom.id === field.areaUomId);
}

/** e.g. "2.0 ac" — the API always includes an acre conversion, so this never needs the UOM lookup. */
export function fieldAreaLabel(field: Pick<FieldDto, 'areaAcres'>): string {
  return `${field.areaAcres} ac`;
}

/** Soil texture label, or undefined if the field has none set. */
export function fieldSoilLabel(
  field: Pick<FieldDto, 'soilTextureId'>,
): string | undefined {
  if (field.soilTextureId === null) return undefined;
  return SOIL_TEXTURES.find((texture) => texture.id === field.soilTextureId)
    ?.label;
}

/** Usage-type label, e.g. "Row crop", "Orchard", "Fallow". */
export function fieldUsageLabel(field: Pick<FieldDto, 'usageType'>): string {
  return FIELD_USAGE_TYPE_LABEL[field.usageType as FieldUsageType] ?? 'Field';
}

/** Status tag for a field row — usage type, with Fallow drawing the eye. */
export function fieldUsageTag(field: Pick<FieldDto, 'usageType'>): {
  label: string;
  variant: TagVariant;
} {
  return {
    label: fieldUsageLabel(field),
    variant: field.usageType === FieldUsageType.Fallow ? 'solid' : 'neutral',
  };
}
