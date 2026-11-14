import { router, useLocalSearchParams } from 'expo-router';

import { LookupFallback } from '@/components/lookup-fallback';
import { WorkerFormScreen, useWorker } from '@/features/workers';
import { parseRouteId } from '@/lib/route-params';

export default function EditWorkerRoute() {
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
    <WorkerFormScreen
      worker={worker}
      onClose={() => router.back()}
      onSaved={() => router.back()}
    />
  );
}
