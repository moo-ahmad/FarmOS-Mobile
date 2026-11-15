import { apiRequest, type AuthContext } from '@/lib/http/request';

/**
 * A unit of measure (`FarmOS.Application.UnitsOfMeasure.UnitOfMeasureDto`).
 * `uomId` is a database identity, not a lookup id — always read it from here,
 * never hard-code it. `dimension` is the `Dimension` lookup value
 * (Mass = 17000, Volume = 17001, Area = 17002, Count = 17003, …).
 */
export interface UnitOfMeasureDto {
  uomId: number;
  code: string;
  name: string;
  dimension: number;
  precision: number;
}

/** GET /api/units-of-measure — every unit, by dimension, smallest first. */
export function fetchUnitsOfMeasure(
  auth: AuthContext,
): Promise<UnitOfMeasureDto[]> {
  return apiRequest('/api/units-of-measure', auth);
}
