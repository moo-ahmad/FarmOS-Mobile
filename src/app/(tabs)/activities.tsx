import { router, useLocalSearchParams } from 'expo-router';

import { ActivitiesScreen } from '@/features/activities';
import { parseRouteId } from '@/lib/route-params';

/** `/activities`, or `/activities?cropCycleId=` for one cycle's log. */
export default function ActivitiesRoute() {
  const { cropCycleId } = useLocalSearchParams<{ cropCycleId?: string }>();
  const cycleId = parseRouteId(cropCycleId);

  return (
    <ActivitiesScreen
      cropCycleId={cycleId}
      onBack={() => router.back()}
      onLogActivity={() =>
        router.push(
          cycleId === undefined
            ? '/capture/activity'
            : `/capture/activity?cropCycleId=${cycleId}`,
        )
      }
      onOpenActivity={(id) => router.push(`/activity/${id}`)}
    />
  );
}
