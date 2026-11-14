import { router, useLocalSearchParams } from 'expo-router';

import { LookupFallback } from '@/components/lookup-fallback';
import { WorkerDetailScreen, useWorker } from '@/features/workers';
import { parseRouteId } from '@/lib/route-params';

export default function WorkerDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { worker, isPending } = useWorker(parseRouteId(id));

  if (!worker) {
    return (
      <LookupFallback
        title="Worker"
        loading={isPending}
        notFoundMessage="Couldn't find this worker."
        onBack={() => router.back()}
      />
    );
  }

  return (
    <WorkerDetailScreen
      worker={worker}
      onBack={() => router.back()}
      onEdit={() => router.push(`/worker/${worker.workerId}/edit`)}
      onDeleted={() => router.back()}
    />
  );
}
