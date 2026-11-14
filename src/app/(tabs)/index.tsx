import { router } from 'expo-router';

import { HomeScreen } from '@/features/home';

export default function HomeRoute() {
  return (
    <HomeScreen
      onOpenCycle={(cycleId) => router.push(`/crop-pnl/${cycleId}`)}
      onOpenFields={() => router.push('/fields')}
      onAddSeason={() => router.push('/season/new')}
      onAddIrrigationSource={() => router.push('/irrigation-source/new')}
    />
  );
}
