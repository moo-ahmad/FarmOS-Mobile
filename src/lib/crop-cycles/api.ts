import { apiRequest, type AuthContext } from '@/lib/http/request';

/** One projected/observed growth stage (`CropCycleStageDto`). */
export interface CropCycleStageDto {
  id: number;
  stageTemplateId: number | null;
  stageName: string;
  /** `YYYY-MM-DD`. */
  projectedDate: string;
  observedDate: string | null;
  cumulativeGdd: number | null;
}

/**
 * A crop cycle as returned by the API (`FarmOS.Application.CropCycles.CropCycleDto`).
 * `status` is the `CropCycleStatus` lookup value (Planned = 14000, …). Decimals
 * arrive as JSON numbers — display only, never do arithmetic on them. Dates
 * are `YYYY-MM-DD`.
 */
export interface CropCycleDto {
  cropCycleId: number;
  publicId: string;
  fieldId: number;
  seasonId: number;
  cropId: number;
  varietyId: number | null;
  /** Server-generated, e.g. `F3-WHEAT-R2526`. */
  cycleCode: string;
  plannedSowDate: string | null;
  actualSowDate: string | null;
  plannedHarvestDate: string | null;
  actualHarvestStart: string | null;
  actualHarvestEnd: string | null;
  areaSownValue: number;
  areaUomId: number;
  seedQuantityValue: number | null;
  seedUomId: number | null;
  seedSupplierId: number | null;
  seedLotCode: string | null;
  seedCost: number | null;
  germinationPct: number | null;
  germinationCheckDate: string | null;
  plantPopulationPerAcre: number | null;
  expectedYieldValue: number | null;
  actualYieldValue: number | null;
  yieldUomId: number;
  actualYieldKg: number | null;
  status: number;
  terminationReason: string | null;
  isIntercrop: boolean;
  intercropParentCycleId: number | null;
  areaSharePct: number;
  notes: string | null;
  stages: CropCycleStageDto[];
}

/** Decimals as strings (the API accepts `number | string`) — never JS numbers. */
type DecimalString = string;

/** PUT /api/crop-cycles/{id} body — the editable details. */
export interface UpdateCropCycleRequestBody {
  varietyId: number | null;
  areaSownValue: DecimalString;
  areaUomId: number;
  plannedSowDate: string | null;
  plannedHarvestDate: string | null;
  expectedYieldValue: DecimalString | null;
  seedQuantityValue: DecimalString | null;
  seedUomId: number | null;
  seedSupplierId: number | null;
  seedLotCode: string | null;
  seedCost: DecimalString | null;
  plantPopulationPerAcre: number | null;
  notes: string | null;
}

/** POST /api/crop-cycles body. */
export interface CreateCropCycleRequestBody extends UpdateCropCycleRequestBody {
  fieldId: number;
  seasonId: number;
  cropId: number;
  yieldUomId: number;
  isIntercrop: boolean;
  intercropParentCycleId: number | null;
  areaSharePct: DecimalString;
}

/** POST /api/crop-cycles/{id}/transition body. */
export interface TransitionCropCycleRequestBody {
  newStatus: number;
  /** Required for Sown. */
  actualSowDate: string | null;
  /** Required for Closed unless a harvest already set it. */
  actualHarvestEnd: string | null;
  terminationReason: string | null;
}

/** GET /api/crop-cycles — every cycle on the farm, newest first. */
export function fetchCropCycles(auth: AuthContext): Promise<CropCycleDto[]> {
  return apiRequest('/api/crop-cycles', auth);
}

/** GET /api/crop-cycles/{id}. */
export function fetchCropCycleById(
  cropCycleId: number,
  auth: AuthContext,
): Promise<CropCycleDto> {
  return apiRequest(`/api/crop-cycles/${cropCycleId}`, auth);
}

/** POST /api/crop-cycles — 201 Created with the new cycle (status Planned). */
export function createCropCycle(
  body: CreateCropCycleRequestBody,
  auth: AuthContext,
): Promise<CropCycleDto> {
  return apiRequest('/api/crop-cycles', auth, { method: 'POST', body });
}

/** PUT /api/crop-cycles/{id}. */
export function updateCropCycle(
  cropCycleId: number,
  body: UpdateCropCycleRequestBody,
  auth: AuthContext,
): Promise<CropCycleDto> {
  return apiRequest(`/api/crop-cycles/${cropCycleId}`, auth, {
    method: 'PUT',
    body,
  });
}

/** POST /api/crop-cycles/{id}/transition — 422 for a move the lifecycle doesn't allow. */
export function transitionCropCycle(
  cropCycleId: number,
  body: TransitionCropCycleRequestBody,
  auth: AuthContext,
): Promise<CropCycleDto> {
  return apiRequest(`/api/crop-cycles/${cropCycleId}/transition`, auth, {
    method: 'POST',
    body,
  });
}

/** DELETE /api/crop-cycles/{id} — 204; a 422 once anything references the cycle. */
export function deleteCropCycle(
  cropCycleId: number,
  auth: AuthContext,
): Promise<void> {
  return apiRequest(`/api/crop-cycles/${cropCycleId}`, auth, {
    method: 'DELETE',
  });
}
