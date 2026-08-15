import { router, useLocalSearchParams } from 'expo-router';

import { AppHeader, Screen } from '@/components/ui';
import { FieldDetailScreen, fields } from '@/features/fields';

export default function FieldDetailRoute() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const field = fields.find((f) => f.code === code);

  if (!field) {
    return (
      <Screen edgeToEdgeBottom={false}>
        <AppHeader kicker={code} title="Field" onBack={() => router.back()} />
      </Screen>
    );
  }

  return (
    <FieldDetailScreen
      field={field}
      onBack={() => router.back()}
      onDeactivated={() => router.back()}
    />
  );
}
