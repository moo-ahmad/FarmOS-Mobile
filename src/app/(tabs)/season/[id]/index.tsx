import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { seasonDetails, SeasonDetailScreen } from '@/features/season-detail';

// Edit and Plan a crop cycle are left unwired until their routes land on master.
export default function SeasonDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const season = seasonDetails.find((s) => s.id === id);

  if (!season) {
    return <Redirect href="/" />;
  }

  return (
    <SeasonDetailScreen
      season={season}
      onBack={() => router.back()}
      onOpenCycle={(cycleId) => router.push(`/crop-pnl/${cycleId}`)}
    />
  );
}
