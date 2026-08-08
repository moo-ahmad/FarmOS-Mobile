import { Package } from 'lucide-react-native';
import { View } from 'react-native';

import { AppHeader, Screen, Text } from '@/components/ui';
import { colors } from '@/theme';

// Placeholder until the Inventory / stock domain screen is built.
export default function StockRoute() {
  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader kicker="Greenfield Farms" title="Inventory" />
      <View className="flex-1 items-center justify-center gap-3 px-8">
        <Package size={32} color={colors.neutral[400]} />
        <Text tone="muted" className="text-center">
          Inventory is coming soon.
        </Text>
      </View>
    </Screen>
  );
}
