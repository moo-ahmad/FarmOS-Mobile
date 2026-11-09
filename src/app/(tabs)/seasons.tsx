import { router } from 'expo-router';

import { SeasonsScreen } from '@/features/seasons';

// New/View/Edit/Close are left unwired until their screens exist.
export default function SeasonsRoute() {
  return <SeasonsScreen onBack={() => router.back()} />;
}
