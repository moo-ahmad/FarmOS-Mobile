import {
  Lookup,
  lookupCodes,
  lookupName,
  lookupValues,
  type LookupCode,
  type LookupValue,
} from '@/lib/lookups';

/**
 * How a field is used — the backend's `FieldUsageType` lookup. Values come
 * from the generated lookup catalogue (`pnpm lookups:generate`), so they are
 * the wire values the API stores (RowCrop = 35000, …), never hand-typed.
 */
export const FieldUsageType = Lookup.FieldUsageType;
// A value + type pair under one name, so call sites read like the enum it replaced.
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FieldUsageType = LookupValue<'FieldUsageType'>;

export const FIELD_USAGE_TYPES: readonly FieldUsageType[] =
  lookupValues('FieldUsageType');

export const FIELD_USAGE_TYPE_LABEL: Record<FieldUsageType, string> = {
  [FieldUsageType.RowCrop]: 'Row crop',
  [FieldUsageType.Orchard]: 'Orchard',
  [FieldUsageType.Nursery]: 'Nursery',
  [FieldUsageType.Fallow]: 'Fallow',
  [FieldUsageType.Structure]: 'Structure',
  [FieldUsageType.NonProductive]: 'Non-productive',
};

export interface SoilTexture {
  /** The `SoilTexture` lookup value the API stores/accepts (Sand = 47000, …). */
  id: SoilTextureValue;
  code: LookupCode<'SoilTexture'>;
  label: string;
}

export type SoilTextureValue = LookupValue<'SoilTexture'>;

/**
 * Soil textures a field can be assigned — the backend's `SoilTexture` lookup
 * (the 12 USDA textural classes, coarse to fine), which replaced the old
 * `soil_texture` table. Values and labels come from the generated lookup
 * catalogue (`pnpm lookups:generate` = `GET /api/lookups/SoilTexture`).
 */
export const SOIL_TEXTURES: readonly SoilTexture[] = lookupCodes(
  'SoilTexture',
).map((code) => ({
  id: Lookup.SoilTexture[code],
  code,
  label: lookupName('SoilTexture', code),
}));

export interface AreaUom {
  id: number;
  code: string;
  label: string;
}

/**
 * Area units a field's `areaValue` can be expressed in, acre first (the
 * form's default). Unit-of-measure ids are database autoincrement ids, NOT
 * lookup ids, and there's no `/api/units-of-measure` endpoint to read them
 * from — so they're pinned to the dev database: acre = 28, confirmed from
 * `GET /api/farms/current` (`areaUomId`) and existing fields (uom 28 →
 * 1:1 acres). Kanal/marla/hectare follow acre in `ReferenceDataSeeder.UomSeeds`
 * order. The old 10–13 assumed a fresh database and no longer matched, so the
 * backend rejected every new field ("must be expressed in an area unit").
 * Replace with a fetched list (matched by `code`) once that endpoint exists.
 */
export const AREA_UOMS: readonly AreaUom[] = [
  { id: 28, code: 'acre', label: 'Acre' },
  { id: 29, code: 'kanal', label: 'Kanal' },
  { id: 30, code: 'marla', label: 'Marla' },
  { id: 31, code: 'hectare', label: 'Hectare' },
];
