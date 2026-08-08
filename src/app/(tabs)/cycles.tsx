import { Sprout } from 'lucide-react-native';
import { View } from 'react-native';

import { AppHeader, Screen, Text } from '@/components/ui';
import { colors } from '@/theme';

// Placeholder until the Crop P&L / cycles domain screen is built.
export default function CyclesRoute() {
  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader kicker="Greenfield Farms" title="Cycles" />
      <View className="flex-1 items-center justify-center gap-3 px-8">
        <Sprout size={32} color={colors.neutral[400]} />
        <Text tone="muted" className="text-center">
          Crop cycles are coming soon.
        </Text>
      </View>
    </Screen>
  );
}
