import { env } from '@/lib/config/env';
import { ApiError } from '@/lib/http/errors';

/**
 * A field as returned by the API (`FarmOS.Application.Fields.FieldDto`).
 * `usageType`/`soilTextureId`/`primaryIrrigationSourceId` are raw wire
 * values — see `@/features/fields/model` for how the UI labels them.
 */
export interface FieldDto {
  fieldId: number;
  publicId: string;
  code: string;
  name: string;
  areaValue: number;
  areaUomId: number;
  areaAcres: number;
  usageType: number;
  soilTextureId: number | null;
  primaryIrrigationSourceId: number | null;
  parentFieldId: number | null;
  centroidLat: number | null;
  centroidLng: number | null;
  isActive: boolean;
}

/** GET /api/fields response (`FieldsSummaryDto`). */
export interface FieldsSummaryDto {
  fields: FieldDto[];
  totalFieldAreaAcres: number;
  farmTotalAreaAcres: number;
  /** Informational only — the API doesn't block on this. */
  exceedsFarmTotalArea: boolean;
}

export interface CreateFieldRequestBody {
  code: string;
  name: string;
  areaValue: number;
  areaUomId: number;
  usageType: number;
  soilTextureId: number | null;
  primaryIrrigationSourceId: number | null;
  parentFieldId: number | null;
  centroidLat: number | null;
  centroidLng: number | null;
}

export type UpdateFieldRequestBody = CreateFieldRequestBody;

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

function authHeaders({ accessToken, farmId }: AuthContext): HeadersInit {
  return {
    Authorization: `Bearer ${accessToken}`,
    'X-Farm-Id': farmId,
  };
}

/** GET /api/fields — every field on the current farm (active and deactivated). */
export async function fetchFields(
  auth: AuthContext,
): Promise<FieldsSummaryDto> {
  const response = await fetch(`${env.apiBaseUrl}/api/fields`, {
    headers: authHeaders(auth),
  });
  if (!response.ok) {
    throw await toApiError(response);
  }
  return (await response.json()) as FieldsSummaryDto;
}

/** GET /api/fields/{id}. */
export async function fetchFieldById(
  fieldId: number,
  auth: AuthContext,
): Promise<FieldDto> {
  const response = await fetch(`${env.apiBaseUrl}/api/fields/${fieldId}`, {
    headers: authHeaders(auth),
  });
  if (!response.ok) {
    throw await toApiError(response);
  }
  return (await response.json()) as FieldDto;
}

/** POST /api/fields — 201 Created with the new field. */
export async function createField(
  body: CreateFieldRequestBody,
  auth: AuthContext,
): Promise<FieldDto> {
  const response = await fetch(`${env.apiBaseUrl}/api/fields`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(auth),
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw await toApiError(response);
  }
  return (await response.json()) as FieldDto;
}

/** PUT /api/fields/{id}. */
export async function updateField(
  fieldId: number,
  body: UpdateFieldRequestBody,
  auth: AuthContext,
): Promise<FieldDto> {
  const response = await fetch(`${env.apiBaseUrl}/api/fields/${fieldId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(auth),
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw await toApiError(response);
  }
  return (await response.json()) as FieldDto;
}

/**
 * POST /api/fields/{id}/deactivate — soft state change only, a field is
 * never deleted (crop-cycle history references it by id).
 */
export async function deactivateField(
  fieldId: number,
  auth: AuthContext,
): Promise<FieldDto> {
  const response = await fetch(
    `${env.apiBaseUrl}/api/fields/${fieldId}/deactivate`,
    { method: 'POST', headers: authHeaders(auth) },
  );
  if (!response.ok) {
    throw await toApiError(response);
  }
  return (await response.json()) as FieldDto;
}
