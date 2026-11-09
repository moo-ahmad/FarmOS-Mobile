import { router } from 'expo-router';

import { CropCycleFormScreen } from '@/features/crop-cycle-form';

// Saving only closes the screen until a crop-cycles API exists to persist to.
export default function NewCropCycleRoute() {
  return (
    <CropCycleFormScreen
      onClose={() => router.back()}
      onSave={() => router.back()}
    />
  );
}
