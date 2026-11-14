import { router } from 'expo-router';

import { CustomersScreen } from '@/features/customers';

export default function CustomersRoute() {
  return (
    <CustomersScreen
      onBack={() => router.back()}
      onAddCustomer={() => router.push('/customer/new')}
      onOpenCustomer={(id) => router.push(`/customer/${id}`)}
    />
  );
}
