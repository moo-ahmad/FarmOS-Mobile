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
