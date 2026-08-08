import { router, useLocalSearchParams } from 'expo-router';

import { cropPnlByCycleId, CropPnlScreen } from '@/features/crop-pnl';
import { cropCycles } from '@/features/home';

export default function CropPnlRoute() {
  const { cycleId } = useLocalSearchParams<{ cycleId?: string }>();
  const cycle = cropCycles.find((c) => c.id === cycleId) ?? cropCycles[0];

  if (!cycle) return null;

  const inputs =
    cropPnlByCycleId[cycle.id] ?? cropPnlByCycleId[cropCycles[0]!.id];

  if (!inputs) return null;

  return (
    <CropPnlScreen cycle={cycle} inputs={inputs} onBack={() => router.back()} />
  );
}
