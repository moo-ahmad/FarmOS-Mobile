import { ActivityIndicator, View } from 'react-native';

import { AppHeader, Callout, Screen } from '@/components/ui';
import { colors } from '@/theme';

export interface LookupFallbackProps {
  /** e.g. "Customer". */
  title: string;
  loading: boolean;
  /** Shown when loading finished and nothing was found. */
  notFoundMessage: string;
  onBack: () => void;
}

/** What a record's detail/edit route shows while it loads or isn't found. */
export function LookupFallback({
  title,
  loading,
  notFoundMessage,
  onBack,
}: LookupFallbackProps) {
  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader title={title} onBack={onBack} />
      <View className="flex-1 items-center justify-center px-8">
        {loading ? (
          <ActivityIndicator color={colors.ink} />
        ) : (
          <Callout>{notFoundMessage}</Callout>
        )}
      </View>
    </Screen>
  );
}
