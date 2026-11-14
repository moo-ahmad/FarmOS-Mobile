import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';

import { useFields } from '@/features/fields';
import { useSeasons } from '@/features/season-form';
import { getAccessToken } from '@/lib/auth';
import {
  createCropCycle,
  deleteCropCycle,
  fetchCropCycleById,
  fetchCropCycles,
  transitionCropCycle,
  updateCropCycle,
  type CreateCropCycleRequestBody,
  type CropCycleDto,
  type TransitionCropCycleRequestBody,
  type UpdateCropCycleRequestBody,
} from '@/lib/crop-cycles';
import { fetchCrops, fetchCropVarieties } from '@/lib/crops';
import { getCurrentFarmId } from '@/lib/farm';

async function requireAuth(): Promise<{ accessToken: string; farmId: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('Not signed in.');
  }
  return { accessToken, farmId: getCurrentFarmId() };
}

/** The crop catalogue is seeded reference data — it doesn't change during a session. */
const REFERENCE_STALE_MS = 60 * 60 * 1000;

export const cropKeys = {
  all: ['crops'] as const,
  list: () => ['crops', 'list'] as const,
  varieties: (cropId: number) => ['crops', 'varieties', cropId] as const,
};

export const cropCycleKeys = {
  all: ['crop-cycles'] as const,
  list: () => ['crop-cycles', 'list'] as const,
  detail: (cropCycleId: number) =>
    ['crop-cycles', 'detail', cropCycleId] as const,
};

/** GET /api/crops. */
export function useCrops() {
  return useQuery({
    queryKey: cropKeys.list(),
    queryFn: async () => fetchCrops(await requireAuth()),
    staleTime: REFERENCE_STALE_MS,
  });
}

/** GET /api/crop-varieties?cropId= — idle until a crop is picked. */
export function useCropVarieties(cropId: number | null) {
  return useQuery({
    queryKey: cropKeys.varieties(cropId ?? -1),
    queryFn: async () =>
      fetchCropVarieties(cropId as number, await requireAuth()),
    enabled: cropId !== null,
    staleTime: REFERENCE_STALE_MS,
  });
}

function cacheCycle(queryClient: QueryClient, cycle: CropCycleDto) {
  queryClient.setQueryData(cropCycleKeys.detail(cycle.cropCycleId), cycle);
  void queryClient.invalidateQueries({ queryKey: cropCycleKeys.list() });
}

/** GET /api/crop-cycles — every cycle on the farm, newest first. */
export function useCropCycles() {
  return useQuery({
    queryKey: cropCycleKeys.list(),
    queryFn: async () => fetchCropCycles(await requireAuth()),
  });
}

/**
 * One cycle for the detail/edit routes: the list row shows at once, and
 * `GET /api/crop-cycles/{id}` takes over when it resolves.
 */
export function useCropCycle(cropCycleId: number | undefined) {
  const listQuery = useCropCycles();
  const summary = listQuery.data?.find((c) => c.cropCycleId === cropCycleId);
  const detailQuery = useQuery({
    queryKey: cropCycleKeys.detail(cropCycleId ?? -1),
    queryFn: async () =>
      fetchCropCycleById(cropCycleId as number, await requireAuth()),
    enabled: cropCycleId !== undefined,
  });
  return {
    cycle: detailQuery.data ?? summary,
    // A disabled query (bad id) is "pending" forever — that's not-found, not loading.
    isPending: cropCycleId !== undefined && detailQuery.isPending,
  };
}

export interface CycleNames {
  field: (fieldId: number) => string | undefined;
  season: (seasonId: number) => string | undefined;
  crop: (cropId: number) => string | undefined;
}

/**
 * Names for the ids a cycle carries — fields, seasons and crops come from
 * their own (cached) lists, so a cycle row can say "Wheat · North block ·
 * Rabi 2026-27" without a join on the server.
 */
export function useCycleNames(): CycleNames {
  const fields = useFields();
  const seasons = useSeasons();
  const crops = useCrops();
  return useMemo(() => {
    const fieldById = new Map(
      (fields.data?.fields ?? []).map((f) => [f.fieldId, f.name]),
    );
    const seasonById = new Map(
      (seasons.data ?? []).map((s) => [s.seasonId, s.name]),
    );
    const cropById = new Map((crops.data ?? []).map((c) => [c.cropId, c.name]));
    return {
      field: (id) => fieldById.get(id),
      season: (id) => seasonById.get(id),
      crop: (id) => cropById.get(id),
    };
  }, [fields.data, seasons.data, crops.data]);
}

export function useCreateCropCycle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateCropCycleRequestBody) =>
      createCropCycle(body, await requireAuth()),
    onSuccess: (cycle) => cacheCycle(queryClient, cycle),
  });
}

export function useUpdateCropCycle(cropCycleId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateCropCycleRequestBody) =>
      updateCropCycle(cropCycleId, body, await requireAuth()),
    onSuccess: (cycle) => cacheCycle(queryClient, cycle),
  });
}

/** POST /api/crop-cycles/{id}/transition. */
export function useTransitionCropCycle(cropCycleId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: TransitionCropCycleRequestBody) =>
      transitionCropCycle(cropCycleId, body, await requireAuth()),
    onSuccess: (cycle) => cacheCycle(queryClient, cycle),
  });
}

/** DELETE /api/crop-cycles/{id}; refused (422) once anything references the cycle. */
export function useDeleteCropCycle(cropCycleId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => deleteCropCycle(cropCycleId, await requireAuth()),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: cropCycleKeys.detail(cropCycleId),
      });
      void queryClient.invalidateQueries({ queryKey: cropCycleKeys.list() });
    },
  });
}
