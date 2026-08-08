import { router } from 'expo-router';

import { cropCycles, HomeScreen } from '@/features/home';

export default function HomeRoute() {
  return (
    <HomeScreen
      onOpenCycle={(cycleId) => {
        const cycle = cropCycles.find((c) => c.id === cycleId);
        if (cycle) router.push(`/fields?focus=${cycle.fieldCode}`);
      }}
    />
  );
}
