import { kv } from '@/lib/kv';

/**
 * Current farm context. The active farm's PublicId is sent as `X-Farm-Id` and
 * scopes local data. Populated by `useSignIn` from `GET /api/farms/current`
 * after login; falls back to a dev id for screens exercised before sign-in
 * wiring reaches them.
 */

const FARM_ID_KEY = 'farmos.currentFarmId';
const DEV_FALLBACK_FARM_ID = 'farm-dev';

export function getCurrentFarmId(): string {
  return kv.getString(FARM_ID_KEY) ?? DEV_FALLBACK_FARM_ID;
}

export function setCurrentFarmId(farmId: string): void {
  kv.set(FARM_ID_KEY, farmId);
}

export { fetchCurrentFarm, createFarm, type CurrentFarmResponse } from './api';
