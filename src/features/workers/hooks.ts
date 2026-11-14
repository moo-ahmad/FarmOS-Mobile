import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';

import { getAccessToken } from '@/lib/auth';
import { getCurrentFarmId } from '@/lib/farm';
import {
  createWorker,
  deactivateWorker,
  deleteWorker,
  fetchWorkerById,
  fetchWorkers,
  reactivateWorker,
  updateWorker,
  type WorkerDto,
  type WorkerRequestBody,
} from '@/lib/workers';

async function requireAuth(): Promise<{ accessToken: string; farmId: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('Not signed in.');
  }
  return { accessToken, farmId: getCurrentFarmId() };
}

export const workerKeys = {
  all: ['workers'] as const,
  list: () => ['workers', 'list'] as const,
  detail: (workerId: number) => ['workers', 'detail', workerId] as const,
};

function cacheWorker(queryClient: QueryClient, worker: WorkerDto) {
  queryClient.setQueryData(workerKeys.detail(worker.workerId), worker);
  void queryClient.invalidateQueries({ queryKey: workerKeys.list() });
}

/** GET /api/workers — every worker on the farm (active and deactivated). */
export function useWorkers() {
  return useQuery({
    queryKey: workerKeys.list(),
    queryFn: async () => fetchWorkers(await requireAuth()),
  });
}

/**
 * One worker for the detail/edit routes: the list row shows at once, and
 * `GET /api/workers/{id}` takes over when it resolves.
 */
export function useWorker(workerId: number | undefined) {
  const listQuery = useWorkers();
  const summary = listQuery.data?.find((w) => w.workerId === workerId);
  const detailQuery = useQuery({
    queryKey: workerKeys.detail(workerId ?? -1),
    queryFn: async () =>
      fetchWorkerById(workerId as number, await requireAuth()),
    enabled: workerId !== undefined,
  });
  return {
    worker: detailQuery.data ?? summary,
    // A disabled query (bad id) is "pending" forever — that's not-found, not loading.
    isPending: workerId !== undefined && detailQuery.isPending,
  };
}

export function useCreateWorker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: WorkerRequestBody) =>
      createWorker(body, await requireAuth()),
    onSuccess: (worker) => cacheWorker(queryClient, worker),
  });
}

export function useUpdateWorker(workerId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: WorkerRequestBody) =>
      updateWorker(workerId, body, await requireAuth()),
    onSuccess: (worker) => cacheWorker(queryClient, worker),
  });
}

/** POST /api/workers/{id}/deactivate with the farm-local exit date (`YYYY-MM-DD`). */
export function useDeactivateWorker(workerId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (exitDate: string) =>
      deactivateWorker(workerId, exitDate, await requireAuth()),
    onSuccess: (worker) => cacheWorker(queryClient, worker),
  });
}

export function useReactivateWorker(workerId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => reactivateWorker(workerId, await requireAuth()),
    onSuccess: (worker) => cacheWorker(queryClient, worker),
  });
}

/** DELETE /api/workers/{id}; refused (422) once any payroll history references them. */
export function useDeleteWorker(workerId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => deleteWorker(workerId, await requireAuth()),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: workerKeys.detail(workerId) });
      void queryClient.invalidateQueries({ queryKey: workerKeys.list() });
    },
  });
}
