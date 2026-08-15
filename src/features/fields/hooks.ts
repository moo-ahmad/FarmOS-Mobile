import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAccessToken } from '@/lib/auth';
import { getCurrentFarmId } from '@/lib/farm';
import {
  createField,
  deactivateField,
  fetchFieldById,
  fetchFields,
  updateField,
  type CreateFieldRequestBody,
  type UpdateFieldRequestBody,
} from '@/lib/fields';
import { fetchIrrigationSources } from '@/lib/irrigation-sources';

async function requireAuth(): Promise<{ accessToken: string; farmId: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('Not signed in.');
  }
  return { accessToken, farmId: getCurrentFarmId() };
}

export const fieldKeys = {
  all: ['fields'] as const,
  list: () => ['fields', 'list'] as const,
  detail: (fieldId: number) => ['fields', 'detail', fieldId] as const,
};

export const irrigationSourceKeys = {
  list: () => ['irrigationSources', 'list'] as const,
};

/** GET /api/fields — every field on the current farm (active and deactivated). */
export function useFields() {
  return useQuery({
    queryKey: fieldKeys.list(),
    queryFn: async () => fetchFields(await requireAuth()),
  });
}

/** GET /api/fields/{id}. Disabled until a real id is given. */
export function useField(fieldId: number | undefined) {
  return useQuery({
    queryKey: fieldKeys.detail(fieldId ?? -1),
    queryFn: async () => fetchFieldById(fieldId as number, await requireAuth()),
    enabled: fieldId !== undefined,
  });
}

/** GET /api/irrigation-sources — for the Add Field source picker. */
export function useIrrigationSources() {
  return useQuery({
    queryKey: irrigationSourceKeys.list(),
    queryFn: async () => fetchIrrigationSources(await requireAuth()),
  });
}

/** POST /api/fields, then refreshes the fields list. */
export function useCreateField() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateFieldRequestBody) =>
      createField(body, await requireAuth()),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fieldKeys.list() });
    },
  });
}

/** PUT /api/fields/{id}, then refreshes the list and that field's detail. */
export function useUpdateField(fieldId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateFieldRequestBody) =>
      updateField(fieldId, body, await requireAuth()),
    onSuccess: (field) => {
      queryClient.setQueryData(fieldKeys.detail(fieldId), field);
      void queryClient.invalidateQueries({ queryKey: fieldKeys.list() });
    },
  });
}

/**
 * POST /api/fields/{id}/deactivate, then refreshes the list and that
 * field's detail. Soft state change only — a field is never deleted.
 */
export function useDeactivateField(fieldId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => deactivateField(fieldId, await requireAuth()),
    onSuccess: (field) => {
      queryClient.setQueryData(fieldKeys.detail(fieldId), field);
      void queryClient.invalidateQueries({ queryKey: fieldKeys.list() });
    },
  });
}
