import { env } from '@/lib/config/env';
import { ApiError } from '@/lib/http/errors';

/** An irrigation source as returned by the API. */
export interface IrrigationSourceDto {
  irrigationSourceId: number;
  publicId: string;
  name: string;
  sourceType: number;
  costModel: number;
  ratePerUnit: number;
  dischargeLpm: number | null;
  pumpAssetId: number | null;
}

interface AuthContext {
  accessToken: string;
  farmId: string;
}

async function toApiError(response: Response): Promise<ApiError> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = undefined;
  }
  const detail =
    body && typeof body === 'object' && 'detail' in body
      ? String((body as { detail: unknown }).detail)
      : undefined;
  return new ApiError(response.status, response.url, body, detail);
}

/** GET /api/irrigation-sources — the current farm's irrigation sources. */
export async function fetchIrrigationSources(
  auth: AuthContext,
): Promise<IrrigationSourceDto[]> {
  const response = await fetch(`${env.apiBaseUrl}/api/irrigation-sources`, {
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      'X-Farm-Id': auth.farmId,
    },
  });
  if (!response.ok) {
    throw await toApiError(response);
  }
  return (await response.json()) as IrrigationSourceDto[];
}

/**
 * POST /api/irrigation-sources body. `sourceType`/`costModel` are the raw
 * `FarmOS.Domain.Enums` wire values; the decimals travel as strings (the API
 * accepts `number | string`) so they never pass through a JS `number`.
 */
export interface CreateIrrigationSourceRequestBody {
  name: string;
  sourceType: number;
  costModel: number;
  ratePerUnit: string;
  dischargeLpm: string | null;
  pumpAssetId: number | null;
}

/** POST /api/irrigation-sources — 201 Created with the new source. */
export async function createIrrigationSource(
  body: CreateIrrigationSourceRequestBody,
  auth: AuthContext,
): Promise<IrrigationSourceDto> {
  const response = await fetch(`${env.apiBaseUrl}/api/irrigation-sources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.accessToken}`,
      'X-Farm-Id': auth.farmId,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw await toApiError(response);
  }
  return (await response.json()) as IrrigationSourceDto;
}
