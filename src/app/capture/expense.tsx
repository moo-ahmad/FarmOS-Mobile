import { router } from 'expo-router';
import { Receipt } from 'lucide-react-native';
import { View } from 'react-native';

import { CaptureHeader, Screen, Text } from '@/components/ui';
import { colors } from '@/theme';

// Log Expense (canvas `1a`, frame 8) is not built yet — a placeholder so the
// chooser has a real destination instead of a dead link.
export default function LogExpenseRoute() {
  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader
        kicker="New entry"
        title="Log expense"
        onClose={() => router.back()}
      />
      <View className="flex-1 items-center justify-center gap-3 px-8">
        <Receipt size={32} color={colors.neutral[400]} />
        <Text tone="muted" className="text-center">
          Log Expense is coming soon.
        </Text>
      </View>
    </Screen>
  );
}
