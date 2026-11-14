import { router } from 'expo-router';

import { FarmSetupScreen } from '@/features/farm-setup';

export default function FarmSetupRoute() {
  return (
    <FarmSetupScreen
      onAddSeason={() => router.push('/season/new')}
      onAddIrrigationSource={() => router.push('/irrigation-source/new')}
      onContinue={() => router.replace('/')}
    />
  );
}
