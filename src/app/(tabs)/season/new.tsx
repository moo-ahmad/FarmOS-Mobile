import { router } from 'expo-router';
import { useMemo } from 'react';

import {
  SeasonFormScreen,
  seasonApiErrorMessage,
  toExistingSeason,
  useCreateSeason,
  useSeasons,
  type ExistingSeason,
} from '@/features/season-form';

export default function NewSeasonRoute() {
  const seasons = useSeasons();
  const createSeason = useCreateSeason();

  const existingSeasons = useMemo(
    () =>
      (seasons.data ?? [])
        .map(toExistingSeason)
        .filter((season): season is ExistingSeason => season !== null),
    [seasons.data],
  );

  return (
    <SeasonFormScreen
      existingSeasons={existingSeasons}
      onClose={() => router.back()}
      onSave={(values) =>
        createSeason.mutate(values, { onSuccess: () => router.back() })
      }
      saving={createSeason.isPending}
      errorMessage={
        createSeason.isError
          ? seasonApiErrorMessage(createSeason.error)
          : undefined
      }
    />
  );
}
