import { apiRequest, type AuthContext } from '@/lib/http/request';

/**
 * A crop catalogue entry (`FarmOS.Application.Crops.CropDto`) — seeded
 * reference data, not farm-editable. `defaultYieldUomId` is the unit a new
 * cycle's yield is recorded in.
 */
export interface CropDto {
  cropId: number;
  publicId: string;
  code: string;
  name: string;
  /** `CropCategory` lookup value. */
  category: number;
  isPerennial: boolean;
  defaultYieldUomId: number;
  typicalCycleDays: number | null;
  baseTempC: number | null;
}

/** A crop variety (`FarmOS.Application.Crops.CropVarietyDto`). */
export interface CropVarietyDto {
  varietyId: number;
  publicId: string;
  cropId: number;
  name: string;
  maturityDays: number | null;
  seedRatePerAcre: number | null;
  seedRateUomId: number | null;
  benchmarkYieldPerAcre: number | null;
  notes: string | null;
}

/** GET /api/crops — the crop catalogue. */
export function fetchCrops(auth: AuthContext): Promise<CropDto[]> {
  return apiRequest('/api/crops', auth);
}

/** GET /api/crop-varieties?cropId= — one crop's varieties. */
export function fetchCropVarieties(
  cropId: number,
  auth: AuthContext,
): Promise<CropVarietyDto[]> {
  return apiRequest(`/api/crop-varieties?cropId=${cropId}`, auth);
}
