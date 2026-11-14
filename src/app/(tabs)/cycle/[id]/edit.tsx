import { router, useLocalSearchParams } from 'expo-router';

import { LookupFallback } from '@/components/lookup-fallback';
import { CropCycleFormScreen, useCropCycle } from '@/features/crop-cycles';
import { parseRouteId } from '@/lib/route-params';

export default function EditCropCycleRoute() {
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
    <CropCycleFormScreen
      cycle={cycle}
      onClose={() => router.back()}
      onSaved={() => router.back()}
    />
  );
}
