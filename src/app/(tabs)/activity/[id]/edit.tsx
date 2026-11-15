import { router, useLocalSearchParams } from 'expo-router';

import { LookupFallback } from '@/components/lookup-fallback';
import { ActivityFormScreen, useActivity } from '@/features/activities';
import { parseRouteId } from '@/lib/route-params';

export default function EditActivityRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activity, isPending } = useActivity(parseRouteId(id));

  if (!activity) {
    return (
      <LookupFallback
        title="Activity"
        loading={isPending}
        notFoundMessage="Couldn't find this activity."
        onBack={() => router.back()}
      />
    );
  }

  return (
    <ActivityFormScreen
      activity={activity}
      onClose={() => router.back()}
      onSaved={() => router.back()}
    />
  );
}
