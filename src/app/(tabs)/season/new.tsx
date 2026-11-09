import { router } from 'expo-router';

import { SeasonFormScreen } from '@/features/season-form';

// Saving only closes the screen until a seasons API exists to persist to.
export default function NewSeasonRoute() {
  return (
    <SeasonFormScreen
      onClose={() => router.back()}
      onSave={() => router.back()}
    />
  );
}
