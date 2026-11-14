import { router, useLocalSearchParams } from 'expo-router';

import { LookupFallback } from '@/components/lookup-fallback';
import { CustomerDetailScreen, useCustomer } from '@/features/customers';
import { parseRouteId } from '@/lib/route-params';

export default function CustomerDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { customer, isPending } = useCustomer(parseRouteId(id));

  if (!customer) {
    return (
      <LookupFallback
        title="Customer"
        loading={isPending}
        notFoundMessage="Couldn't find this customer."
        onBack={() => router.back()}
      />
    );
  }

  return (
    <CustomerDetailScreen
      customer={customer}
      onBack={() => router.back()}
      onEdit={() => router.push(`/customer/${customer.customerId}/edit`)}
      onDeleted={() => router.back()}
    />
  );
}
