import { env } from '@/lib/config/env';
import { ApiError } from '@/lib/http/errors';

/**
 * Subset of `GET /api/farms/current` actually consumed here. Not in the
 * OpenAPI document yet (the 200 response has no body schema) — the live dev
 * API returns more fields (name, totalArea, baseCurrency, ...) but only the
 * farm's PublicId is needed for the `X-Farm-Id` header.
 */
export interface CurrentFarmResponse {
  publicId: string;
}

/** GET /api/farms/current — the signed-in user's active farm context. */
export async function fetchCurrentFarm(
  accessToken: string,
): Promise<CurrentFarmResponse> {
  const response = await fetch(`${env.apiBaseUrl}/api/farms/current`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new ApiError(response.status, response.url, undefined);
  }
  return (await response.json()) as CurrentFarmResponse;
}

/**
 * POST /api/farms — adds a new farm to the signed-in user's account (the
 * "add to existing account" register flow). Becomes the active farm.
 */
export async function createFarm(
  farmName: string,
  accessToken: string,
): Promise<CurrentFarmResponse> {
  const response = await fetch(`${env.apiBaseUrl}/api/farms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ farmName }),
  });
  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = undefined;
    }
    throw new ApiError(response.status, response.url, errorBody);
  }
  return (await response.json()) as CurrentFarmResponse;
}
