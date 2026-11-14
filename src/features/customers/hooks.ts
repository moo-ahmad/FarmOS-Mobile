import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';

import { getAccessToken } from '@/lib/auth';
import {
  createCustomer,
  deactivateCustomer,
  deleteCustomer,
  fetchCustomerById,
  fetchCustomers,
  reactivateCustomer,
  updateCustomer,
  type CustomerDto,
  type CustomerRequestBody,
} from '@/lib/customers';
import { getCurrentFarmId } from '@/lib/farm';

async function requireAuth(): Promise<{ accessToken: string; farmId: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('Not signed in.');
  }
  return { accessToken, farmId: getCurrentFarmId() };
}

export const customerKeys = {
  all: ['customers'] as const,
  list: () => ['customers', 'list'] as const,
  detail: (customerId: number) => ['customers', 'detail', customerId] as const,
};

function cacheCustomer(queryClient: QueryClient, customer: CustomerDto) {
  queryClient.setQueryData(customerKeys.detail(customer.customerId), customer);
  void queryClient.invalidateQueries({ queryKey: customerKeys.list() });
}

/** GET /api/customers — every customer on the farm (active and deactivated). */
export function useCustomers() {
  return useQuery({
    queryKey: customerKeys.list(),
    queryFn: async () => fetchCustomers(await requireAuth()),
  });
}

/**
 * One customer for the detail/edit routes: the list row shows at once, and
 * `GET /api/customers/{id}` takes over when it resolves.
 */
export function useCustomer(customerId: number | undefined) {
  const listQuery = useCustomers();
  const summary = listQuery.data?.find((c) => c.customerId === customerId);
  const detailQuery = useQuery({
    queryKey: customerKeys.detail(customerId ?? -1),
    queryFn: async () =>
      fetchCustomerById(customerId as number, await requireAuth()),
    enabled: customerId !== undefined,
  });
  return {
    customer: detailQuery.data ?? summary,
    // A disabled query (bad id) is "pending" forever — that's not-found, not loading.
    isPending: customerId !== undefined && detailQuery.isPending,
  };
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CustomerRequestBody) =>
      createCustomer(body, await requireAuth()),
    onSuccess: (customer) => cacheCustomer(queryClient, customer),
  });
}

export function useUpdateCustomer(customerId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CustomerRequestBody) =>
      updateCustomer(customerId, body, await requireAuth()),
    onSuccess: (customer) => cacheCustomer(queryClient, customer),
  });
}

/** Deactivate or reactivate, depending on `active`. */
export function useSetCustomerActive(customerId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (active: boolean) => {
      const auth = await requireAuth();
      return active
        ? reactivateCustomer(customerId, auth)
        : deactivateCustomer(customerId, auth);
    },
    onSuccess: (customer) => cacheCustomer(queryClient, customer),
  });
}

/** DELETE /api/customers/{id}; the backend refuses (422) once a sale references it. */
export function useDeleteCustomer(customerId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => deleteCustomer(customerId, await requireAuth()),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: customerKeys.detail(customerId) });
      void queryClient.invalidateQueries({ queryKey: customerKeys.list() });
    },
  });
}
