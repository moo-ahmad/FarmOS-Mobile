import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAccessToken } from '@/lib/auth';
import { getCurrentFarmId } from '@/lib/farm';
import { ApiError } from '@/lib/http';
import { createSeason, fetchSeasons, type SeasonDto } from '@/lib/seasons';

import {
  SEASON_TYPE_WIRE,
  seasonKindFromWire,
  type ExistingSeason,
  type SeasonFormValues,
} from './model';

async function requireAuth(): Promise<{ accessToken: string; farmId: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('Not signed in.');
  }
  return { accessToken, farmId: getCurrentFarmId() };
}

export const seasonKeys = {
  all: ['seasons'] as const,
  list: () => ['seasons', 'list'] as const,
};

/** Maps an API season onto the form's shape; drops unknown season types. */
export function toExistingSeason(dto: SeasonDto): ExistingSeason | null {
  const kind = seasonKindFromWire(dto.seasonType);
  if (!kind) return null;
  return {
    id: String(dto.seasonId),
    name: dto.name,
    kind,
    status: dto.isClosed ? 'closed' : 'open',
    startDate: dto.startDate,
    endDate: dto.endDate,
  };
}

/** GET /api/seasons — every season on the current farm. */
export function useSeasons() {
  return useQuery({
    queryKey: seasonKeys.list(),
    queryFn: async () => fetchSeasons(await requireAuth()),
  });
}

/** POST /api/seasons, then refreshes the seasons list. */
export function useCreateSeason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: SeasonFormValues) =>
      createSeason(
        {
          name: values.name,
          seasonType: SEASON_TYPE_WIRE[values.kind],
          startDate: values.startDate,
          endDate: values.endDate,
        },
        await requireAuth(),
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: seasonKeys.all });
    },
  });
}

/**
 * First message from the backend's FluentValidation `errors` dict (e.g.
 * "A season named 'Rabi 2026-27' already exists on this farm."), which
 * already reads as a sentence.
 */
export function seasonApiErrorMessage(error: unknown): string {
  if (
    error instanceof ApiError &&
    error.body &&
    typeof error.body === 'object'
  ) {
    const body = error.body as { errors?: Record<string, string[]> };
    const firstMessage = body.errors && Object.values(body.errors)[0]?.[0];
    if (firstMessage) return firstMessage;
  }
  return 'Could not save this season. Please try again.';
}
