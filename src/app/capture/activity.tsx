import { router, useLocalSearchParams } from 'expo-router';

import {
  ActivityFormScreen,
  activityTypeForOperation,
} from '@/features/activities';
import { isEndedStatus, useCropCycles } from '@/features/crop-cycles';
import { useFields } from '@/features/fields';
import { parseRouteId } from '@/lib/route-params';

/**
 * Log activity, as a capture modal. Reached from the quick-capture chooser,
 * a crop cycle (`?cropCycleId=`), or a reminder deep link
 * (`?fieldCode=F1&operation=spray`), which pre-picks the field's open cycle.
 */
export default function LogActivityRoute() {
  const params = useLocalSearchParams<{
    cropCycleId?: string;
    fieldCode?: string;
    operation?: string;
  }>();
  const fields = useFields();
  const cycles = useCropCycles();

  const cropCycleId = parseRouteId(params.cropCycleId);
  const cycle = cycles.data?.find((c) => c.cropCycleId === cropCycleId);
  const fieldByCode = fields.data?.fields.find(
    (f) => f.code === params.fieldCode,
  );
  // A reminder names a field; its newest open cycle is the one being worked on.
  const fieldCycle = fieldByCode
    ? cycles.data?.find(
        (c) => c.fieldId === fieldByCode.fieldId && !isEndedStatus(c.status),
      )
    : undefined;

  // Wait for the lookups a deep link needs, so the form mounts pre-filled.
  const waiting =
    (params.fieldCode !== undefined &&
      (fields.isPending || cycles.isPending)) ||
    (cropCycleId !== undefined && cycles.isPending);
  if (waiting) return null;

  const picked = cycle ?? fieldCycle;

  return (
    <ActivityFormScreen
      preset={{
        activityType: activityTypeForOperation(params.operation),
        cropCycleId: picked?.cropCycleId,
        fieldId: picked?.fieldId ?? fieldByCode?.fieldId,
      }}
      onClose={() => router.back()}
      onSaved={() => router.back()}
    />
  );
}
