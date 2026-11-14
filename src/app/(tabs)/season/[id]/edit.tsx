import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { existingSeasons, SeasonFormScreen } from '@/features/season-form';

export default function EditSeasonRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const season = existingSeasons.find((s) => s.id === id);

  if (!season) {
    return <Redirect href="/" />;
  }

  return (
    <SeasonFormScreen
      season={season}
      existingSeasons={existingSeasons}
      onClose={() => router.back()}
      onSave={() => router.back()}
    />
  );
}
