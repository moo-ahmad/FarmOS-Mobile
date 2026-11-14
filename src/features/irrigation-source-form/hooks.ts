import { useMutation, useQueryClient } from '@tanstack/react-query';

import { irrigationSourceKeys } from '@/features/fields';
import { getAccessToken } from '@/lib/auth';
import { getCurrentFarmId } from '@/lib/farm';
import { ApiError } from '@/lib/http';
import { createIrrigationSource } from '@/lib/irrigation-sources';

import type { IrrigationSourceFormValues } from './schema';
import { toCreateIrrigationSourceBody } from './to-request';

async function requireAuth(): Promise<{ accessToken: string; farmId: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('Not signed in.');
  }
  return { accessToken, farmId: getCurrentFarmId() };
}

/** POST /api/irrigation-sources, then refreshes the sources list. */
export function useCreateIrrigationSource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: IrrigationSourceFormValues) =>
      createIrrigationSource(
        toCreateIrrigationSourceBody(values),
        await requireAuth(),
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: irrigationSourceKeys.list(),
      });
    },
  });
}

/** First message from the backend's FluentValidation `errors` dict. */
export function irrigationSourceApiErrorMessage(error: unknown): string {
  if (
    error instanceof ApiError &&
    error.body &&
    typeof error.body === 'object'
  ) {
    const body = error.body as { errors?: Record<string, string[]> };
    const firstMessage = body.errors && Object.values(body.errors)[0]?.[0];
    if (firstMessage) return firstMessage;
  }
  return 'Could not save this irrigation source. Please try again.';
}
