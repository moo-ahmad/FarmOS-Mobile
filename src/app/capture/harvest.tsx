import { router } from 'expo-router';
import { Wheat } from 'lucide-react-native';
import { View } from 'react-native';

import { CaptureHeader, Screen, Text } from '@/components/ui';
import { colors } from '@/theme';

// Log Harvest (canvas `1a`, frame 7) is not built yet — a placeholder so the
// chooser has a real destination instead of a dead link.
export default function LogHarvestRoute() {
  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader
        kicker="New entry"
        title="Log harvest"
        onClose={() => router.back()}
      />
      <View className="flex-1 items-center justify-center gap-3 px-8">
        <Wheat size={32} color={colors.neutral[400]} />
        <Text tone="muted" className="text-center">
          Log Harvest is coming soon.
        </Text>
      </View>
    </Screen>
  );
}
