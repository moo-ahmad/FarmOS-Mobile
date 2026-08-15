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
