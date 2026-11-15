import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';

import { cropCycleKeys } from '@/features/crop-cycles';
import {
  createActivity,
  fetchActivities,
  fetchActivityById,
  updateActivity,
  voidActivity,
  type ActivityDto,
  type ActivityFilter,
  type CreateActivityRequestBody,
  type UpdateActivityRequestBody,
} from '@/lib/activities';
import { getAccessToken } from '@/lib/auth';
import { getCurrentFarmId } from '@/lib/farm';
import { fetchUnitsOfMeasure } from '@/lib/units';

async function requireAuth(): Promise<{ accessToken: string; farmId: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('Not signed in.');
  }
  return { accessToken, farmId: getCurrentFarmId() };
}

export const activityKeys = {
  all: ['activities'] as const,
  lists: () => ['activities', 'list'] as const,
  list: (filter: ActivityFilter) =>
    [
      'activities',
      'list',
      filter.cropCycleId ?? null,
      filter.fieldId ?? null,
    ] as const,
  detail: (activityId: number) => ['activities', 'detail', activityId] as const,
};

export const unitKeys = {
  list: () => ['units-of-measure'] as const,
};

/** GET /api/units-of-measure — seeded reference data, fixed for the session. */
export function useUnitsOfMeasure() {
  return useQuery({
    queryKey: unitKeys.list(),
    queryFn: async () => fetchUnitsOfMeasure(await requireAuth()),
    staleTime: 60 * 60 * 1000,
  });
}

/**
 * A saved/voided activity changes every list it may appear in, and a Sowing
 * activity re-syncs its cycle's seed details on the server.
 */
function cacheActivity(queryClient: QueryClient, activity: ActivityDto) {
  queryClient.setQueryData(activityKeys.detail(activity.activityId), activity);
  void queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
  if (activity.cropCycleId !== null) {
    void queryClient.invalidateQueries({
      queryKey: cropCycleKeys.detail(activity.cropCycleId),
    });
  }
}

/** GET /api/activities — non-void activities, newest first, optionally for one cycle/field. */
export function useActivities(filter: ActivityFilter = {}) {
  return useQuery({
    queryKey: activityKeys.list(filter),
    queryFn: async () => fetchActivities(filter, await requireAuth()),
  });
}

/** GET /api/activities/{id} — includes a voided activity. */
export function useActivity(activityId: number | undefined) {
  const query = useQuery({
    queryKey: activityKeys.detail(activityId ?? -1),
    queryFn: async () =>
      fetchActivityById(activityId as number, await requireAuth()),
    enabled: activityId !== undefined,
  });
  return {
    activity: query.data,
    // A disabled query (bad id) is "pending" forever — that's not-found, not loading.
    isPending: activityId !== undefined && query.isPending,
  };
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateActivityRequestBody) =>
      createActivity(body, await requireAuth()),
    onSuccess: (activity) => cacheActivity(queryClient, activity),
  });
}

export function useUpdateActivity(activityId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateActivityRequestBody) =>
      updateActivity(activityId, body, await requireAuth()),
    onSuccess: (activity) => cacheActivity(queryClient, activity),
  });
}

/** POST /api/activities/{id}/void with the farmer's reason. */
export function useVoidActivity(activityId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reason: string) =>
      voidActivity(activityId, reason, await requireAuth()),
    onSuccess: (activity) => cacheActivity(queryClient, activity),
  });
}
