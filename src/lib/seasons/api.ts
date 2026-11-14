import { env } from '@/lib/config/env';
import { ApiError } from '@/lib/http/errors';

/**
 * A season as returned by the API (`FarmOS.Application.Seasons.SeasonDto`).
 * `seasonType` is the raw `FarmOS.Domain.Enums.SeasonType` wire value — see
 * `SEASON_TYPE_WIRE` in `@/features/season-form` for the mapping.
 */
export interface SeasonDto {
  seasonId: number;
  publicId: string;
  name: string;
  seasonType: number;
  /** Calendar date, `YYYY-MM-DD`. */
  startDate: string;
  /** Calendar date, `YYYY-MM-DD`, inclusive. */
  endDate: string;
  isClosed: boolean;
}

export interface CreateSeasonRequestBody {
  name: string;
  seasonType: number;
  startDate: string;
  endDate: string;
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

function authHeaders({ accessToken, farmId }: AuthContext): HeadersInit {
  return {
    Authorization: `Bearer ${accessToken}`,
    'X-Farm-Id': farmId,
  };
}

/** GET /api/seasons — every season on the current farm (open and closed). */
export async function fetchSeasons(auth: AuthContext): Promise<SeasonDto[]> {
  const response = await fetch(`${env.apiBaseUrl}/api/seasons`, {
    headers: authHeaders(auth),
  });
  if (!response.ok) {
    throw await toApiError(response);
  }
  return (await response.json()) as SeasonDto[];
}

/** POST /api/seasons — 201 Created with the new season. */
export async function createSeason(
  body: CreateSeasonRequestBody,
  auth: AuthContext,
): Promise<SeasonDto> {
  const response = await fetch(`${env.apiBaseUrl}/api/seasons`, {
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
  return (await response.json()) as SeasonDto;
}
