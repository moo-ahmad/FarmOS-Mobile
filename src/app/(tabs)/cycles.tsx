import { router } from 'expo-router';
import { Sprout } from 'lucide-react-native';
import { View } from 'react-native';

import { AppHeader, Button, Screen, Text } from '@/components/ui';
import { colors } from '@/theme';

// Placeholder until the Crop P&L / cycles domain screen is built. Fields is
// reachable from here per the design ("reached via Home/Cycles").
export default function CyclesRoute() {
  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader kicker="Greenfield Farms" title="Cycles" />
      <View className="flex-1 items-center justify-center gap-4 px-8">
        <Sprout size={32} color={colors.neutral[400]} />
        <Text tone="muted" className="text-center">
          Crop cycles are coming soon.
        </Text>
        <Button
          title="View fields"
          variant="secondary"
          onPress={() => router.push('/fields')}
        />
      </View>
    </Screen>
  );
}
