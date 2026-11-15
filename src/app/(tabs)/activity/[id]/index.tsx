import { router, useLocalSearchParams } from 'expo-router';

import { LookupFallback } from '@/components/lookup-fallback';
import { ActivityDetailScreen, useActivity } from '@/features/activities';
import { parseRouteId } from '@/lib/route-params';

export default function ActivityDetailRoute() {
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
    <ActivityDetailScreen
      activity={activity}
      onBack={() => router.back()}
      onEdit={() => router.push(`/activity/${activity.activityId}/edit`)}
    />
  );
}
