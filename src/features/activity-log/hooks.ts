import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createActivityLog, listActivityLogs } from './repository';
import type { ActivityLogFormValues } from './schema';

export const activityLogKeys = {
  all: ['activityLogs'] as const,
  list: (farmId: string) => ['activityLogs', farmId] as const,
};

/** Read activity logs for a farm from the local database (offline-first). */
export function useActivityLogs(farmId: string) {
  return useQuery({
    queryKey: activityLogKeys.list(farmId),
    queryFn: () => listActivityLogs(farmId),
  });
}

/** Create an activity log locally + enqueue it for sync, then refresh the list. */
export function useCreateActivityLog(farmId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ActivityLogFormValues) =>
      createActivityLog({ ...values, farmId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: activityLogKeys.list(farmId),
      });
    },
  });
}
