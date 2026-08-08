import { router, useLocalSearchParams } from 'expo-router';

import { ExpenseScreen } from '@/features/expense';
import { cropCycles } from '@/features/home';

export default function LogExpenseRoute() {
  const { fieldCode } = useLocalSearchParams<{ fieldCode?: string }>();
  const cycle =
    cropCycles.find((c) => c.fieldCode === fieldCode) ?? cropCycles[0];

  if (!cycle) return null;

  return (
    <ExpenseScreen
      initialCycle={cycle}
      onClose={() => router.back()}
      onSaved={() => router.back()}
    />
  );
}
