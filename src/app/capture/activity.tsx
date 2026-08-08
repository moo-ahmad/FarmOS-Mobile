import { router, useLocalSearchParams } from 'expo-router';

import {
  ActivityLogScreen,
  OPERATIONS,
  type Operation,
} from '@/features/activity-log';
import { cropCycles } from '@/features/home';

function isOperation(value: string | undefined): value is Operation {
  return !!value && (OPERATIONS as readonly string[]).includes(value);
}

// Reached via the quick-capture chooser, or a deep-link from a reminder
// (e.g. "Fertilizer split dose — F1 Cotton") with the field/crop and
// operation pre-filled.
export default function LogActivityRoute() {
  const { fieldCode, operation } = useLocalSearchParams<{
    fieldCode?: string;
    operation?: string;
  }>();
  const initialCycle = cropCycles.find((c) => c.fieldCode === fieldCode);

  return (
    <ActivityLogScreen
      initialCycle={initialCycle}
      initialOperation={isOperation(operation) ? operation : undefined}
      onClose={() => router.back()}
      onSaved={() => router.back()}
    />
  );
}
