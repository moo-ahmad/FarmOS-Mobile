import { router } from 'expo-router';

import { CropCyclesScreen } from '@/features/crop-cycles';

export default function CropCyclesRoute() {
  return (
    <CropCyclesScreen
      onAddCycle={() => router.push('/cycle/new')}
      onOpenCycle={(id) => router.push(`/cycle/${id}`)}
    />
  );
}
