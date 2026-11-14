import { router, useLocalSearchParams } from 'expo-router';

import { LookupFallback } from '@/components/lookup-fallback';
import { CustomerFormScreen, useCustomer } from '@/features/customers';
import { parseRouteId } from '@/lib/route-params';

export default function EditCustomerRoute() {
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
    <CustomerFormScreen
      customer={customer}
      onClose={() => router.back()}
      onSaved={() => router.back()}
    />
  );
}
