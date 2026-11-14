import { router } from 'expo-router';

import { CustomerFormScreen } from '@/features/customers';

export default function AddCustomerRoute() {
  return (
    <CustomerFormScreen
      onClose={() => router.back()}
      onSaved={(saved) => router.replace(`/customer/${saved.customerId}`)}
    />
  );
}
