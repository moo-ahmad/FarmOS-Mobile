import { router } from 'expo-router';

import { SeasonsScreen } from '@/features/seasons';

// Edit/Close are left unwired until their screens exist.
export default function SeasonsRoute() {
  return (
    <SeasonsScreen
      onBack={() => router.back()}
      onNewSeason={() => router.push('/season/new')}
      onViewSeason={(id) => router.push(`/season/${id}`)}
    />
  );
}
