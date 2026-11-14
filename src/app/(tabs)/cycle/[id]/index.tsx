import { router, useLocalSearchParams } from 'expo-router';

import { LookupFallback } from '@/components/lookup-fallback';
import { CropCycleDetailScreen, useCropCycle } from '@/features/crop-cycles';
import { parseRouteId } from '@/lib/route-params';

export default function CropCycleDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cycle, isPending } = useCropCycle(parseRouteId(id));

  if (!cycle) {
    return (
      <LookupFallback
        title="Crop cycle"
        loading={isPending}
        notFoundMessage="Couldn't find this crop cycle."
        onBack={() => router.back()}
      />
    );
  }

  return (
    <CropCycleDetailScreen
      cycle={cycle}
      onBack={() => router.back()}
      onEdit={() => router.push(`/cycle/${cycle.cropCycleId}/edit`)}
      onDeleted={() => router.back()}
    />
  );
}
