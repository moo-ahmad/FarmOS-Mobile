import { router } from 'expo-router';

import { IrrigationSourceFormScreen } from '@/features/irrigation-source-form';

export default function NewIrrigationSourceRoute() {
  return (
    <IrrigationSourceFormScreen
      onClose={() => router.back()}
      onSaved={() => router.back()}
    />
  );
}
