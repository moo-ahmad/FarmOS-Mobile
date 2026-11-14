import { ActivityIndicator, View } from 'react-native';

import { AppHeader, Callout, Screen } from '@/components/ui';
import { colors } from '@/theme';

export interface FieldLookupFallbackProps {
  code: string | undefined;
  loading: boolean;
  onBack: () => void;
}

/** What a `/field/[code]` route shows while the field loads or isn't found. */
export function FieldLookupFallback({
  code,
  loading,
  onBack,
}: FieldLookupFallbackProps) {
  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader kicker={code} title="Field" onBack={onBack} />
      <View className="flex-1 items-center justify-center px-8">
        {loading ? (
          <ActivityIndicator color={colors.ink} />
        ) : (
          <Callout>Couldn&apos;t find field &quot;{code}&quot;.</Callout>
        )}
      </View>
    </Screen>
  );
}
