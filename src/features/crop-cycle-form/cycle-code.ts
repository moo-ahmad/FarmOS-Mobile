import type { Crop, OpenSeason } from './model';

/** The crop name without its variety: "Wheat · Faisal-11" → "Wheat". */
export function cropName(crop: Crop): string {
  return crop.title.split(' · ')[0] ?? crop.title;
}

/** e.g. "F3-WHEAT-R2526": field code, crop name and the season's suffix. */
export function cycleCode(
  fieldCode: string,
  crop: Crop,
  season: OpenSeason,
): string {
  const crop_ = cropName(crop)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '');
  return `${fieldCode.toUpperCase()}-${crop_}-${season.codeSuffix}`;
}
