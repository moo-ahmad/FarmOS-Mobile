import { router, useLocalSearchParams } from 'expo-router';

import { HarvestScreen } from '@/features/harvest';
import { cropCycles } from '@/features/home';

// Reached via the quick-capture chooser. No field/crop picker in the design —
// Harvest is contextual to a specific cycle (deep-linked via fieldCode, or the
// first active cycle by default).
export default function LogHarvestRoute() {
  const { fieldCode } = useLocalSearchParams<{ fieldCode?: string }>();
  const cycle =
    cropCycles.find((c) => c.fieldCode === fieldCode) ?? cropCycles[0];

  if (!cycle) return null;

  return (
    <HarvestScreen
      cycle={cycle}
      onClose={() => router.back()}
      onSaved={() => router.back()}
    />
  );
}
