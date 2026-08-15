import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { AppHeader, Callout, Screen } from '@/components/ui';
import { FieldDetailScreen, useField, useFields } from '@/features/fields';
import { colors } from '@/theme';

export default function FieldDetailRoute() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const fieldsQuery = useFields();
  const summary = fieldsQuery.data?.fields.find((f) => f.code === code);
  // The list already has everything the detail screen needs; once the
  // dedicated GET /api/fields/{id} resolves it takes over as the source.
  const detailQuery = useField(summary?.fieldId);
  const field = detailQuery.data ?? summary;

  if (fieldsQuery.isPending) {
    return (
      <Screen edgeToEdgeBottom={false}>
        <AppHeader kicker={code} title="Field" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.ink} />
        </View>
      </Screen>
    );
  }

  if (!field) {
    return (
      <Screen edgeToEdgeBottom={false}>
        <AppHeader kicker={code} title="Field" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center px-8">
          <Callout>Couldn&apos;t find field &quot;{code}&quot;.</Callout>
        </View>
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
