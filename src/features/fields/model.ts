/** Area units offered on the Add Field form. */
export const AREA_UNITS = ['ha', 'acre', 'kanal'] as const;
export type AreaUnit = (typeof AREA_UNITS)[number];

export const AREA_UNIT_LABEL: Record<AreaUnit, string> = {
  ha: 'ha',
  acre: 'acre',
  kanal: 'kanal',
};

/** Soil types offered on the Add Field form. */
export const SOIL_TYPES = [
  'sandy-loam',
  'clay-loam',
  'loam',
  'clay',
  'sandy',
  'silty-clay',
] as const;
export type SoilType = (typeof SOIL_TYPES)[number];

export const SOIL_TYPE_LABEL: Record<SoilType, string> = {
  'sandy-loam': 'Sandy loam',
  'clay-loam': 'Clay loam',
  loam: 'Loam',
  clay: 'Clay',
  sandy: 'Sandy',
  'silty-clay': 'Silty clay',
};

/** Irrigation sources offered on the Add Field form. */
export const IRRIGATION_SOURCES = [
  'tubewell',
  'canal',
  'rain-fed',
  'drip',
  'flood',
] as const;
export type IrrigationSource = (typeof IRRIGATION_SOURCES)[number];

export const IRRIGATION_SOURCE_LABEL: Record<IrrigationSource, string> = {
  tubewell: 'Tubewell',
  canal: 'Canal',
  'rain-fed': 'Rain-fed',
  drip: 'Drip',
  flood: 'Flood',
};
