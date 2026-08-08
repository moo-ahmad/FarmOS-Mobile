import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { AppHeader, Screen, SquareBadge, Tag, Text } from '@/components/ui';
import { fields } from '@/features/fields';

// Field detail is not one of the 10 designed screens in the handoff —
// this is a placeholder (summary + "coming soon") until a real design exists,
// giving field-row taps a real destination instead of a dead link.
export default function FieldDetailRoute() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const field = fields.find((f) => f.code === code);

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        kicker={field?.code ?? code}
        title={field?.title ?? 'Field'}
        onBack={() => router.back()}
      />
      <View className="flex-1 items-center justify-center gap-4 px-8">
        {field ? (
          <>
            <SquareBadge code={field.code} size={44} muted={field.fallow} />
            <Text tone="muted" className="text-center">
              {field.areaHa} ha · {field.note}
            </Text>
            <Tag label={field.tagLabel} variant={field.tagVariant} />
          </>
        ) : null}
        <Text tone="muted" className="text-center">
          Full field detail is coming soon.
        </Text>
      </View>
    </Screen>
  );
}
