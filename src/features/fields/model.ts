/**
 * How a field is used. Mirrors the backend's `FarmOS.Domain.Enums.FieldUsageType`
 * (a `byte` enum) exactly — keep these numeric values in sync with
 * `src/FarmOS.Domain/Enums/LandEnums.cs` in the API repo.
 */
export enum FieldUsageType {
  RowCrop = 0,
  Orchard = 1,
  Nursery = 2,
  Fallow = 3,
  Structure = 4,
  NonProductive = 5,
}

export const FIELD_USAGE_TYPES = [
  FieldUsageType.RowCrop,
  FieldUsageType.Orchard,
  FieldUsageType.Nursery,
  FieldUsageType.Fallow,
  FieldUsageType.Structure,
  FieldUsageType.NonProductive,
] as const;

export const FIELD_USAGE_TYPE_LABEL: Record<FieldUsageType, string> = {
  [FieldUsageType.RowCrop]: 'Row crop',
  [FieldUsageType.Orchard]: 'Orchard',
  [FieldUsageType.Nursery]: 'Nursery',
  [FieldUsageType.Fallow]: 'Fallow',
  [FieldUsageType.Structure]: 'Structure',
  [FieldUsageType.NonProductive]: 'Non-productive',
};

export interface SoilTexture {
  id: number;
  label: string;
}

/**
 * Soil textures a field can be assigned. There's no `/api/soil-textures`
 * lookup endpoint yet, so this is hardcoded to the backend's seeded
 * reference data (`ReferenceDataSeeder.SoilTextureSeeds`) — ids are
 * insertion-order autoincrement on a fresh dev database. Replace with a real
 * lookup once that endpoint exists.
 */
export const SOIL_TEXTURES: readonly SoilTexture[] = [
  { id: 1, label: 'Sandy' },
  { id: 2, label: 'Sandy loam' },
  { id: 3, label: 'Loam' },
  { id: 4, label: 'Silt loam' },
  { id: 5, label: 'Clay loam' },
  { id: 6, label: 'Clay' },
];

export interface AreaUom {
  id: number;
  code: string;
  label: string;
}

/**
 * Area units a field's `areaValue` can be expressed in. There's no
 * `/api/units-of-measure` lookup endpoint yet, so this is hardcoded to the
 * Area-dimension rows from the backend's UOM seed data
 * (`ReferenceDataSeeder.UomSeeds`) — ids are insertion-order autoincrement on
 * a fresh dev database. Replace with a real lookup once that endpoint exists.
 */
export const AREA_UOMS: readonly AreaUom[] = [
  { id: 10, code: 'acre', label: 'Acre' },
  { id: 11, code: 'kanal', label: 'Kanal' },
  { id: 12, code: 'marla', label: 'Marla' },
  { id: 13, code: 'hectare', label: 'Hectare' },
];
