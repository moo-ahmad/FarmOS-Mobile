import { router, useLocalSearchParams } from 'expo-router';

import { CropCycleFormScreen } from '@/features/crop-cycles';
import { parseRouteId } from '@/lib/route-params';

/** `/cycle/new`, optionally `?seasonId=` / `?fieldId=` to pre-pick them. */
export default function NewCropCycleRoute() {
  const { seasonId, fieldId } = useLocalSearchParams<{
    seasonId?: string;
    fieldId?: string;
  }>();

  return (
    <CropCycleFormScreen
      preset={{
        seasonId: parseRouteId(seasonId),
        fieldId: parseRouteId(fieldId),
      }}
      onClose={() => router.back()}
      onSaved={(saved) => router.replace(`/cycle/${saved.cropCycleId}`)}
    />
  );
}
