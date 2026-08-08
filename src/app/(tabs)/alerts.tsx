import { Bell } from 'lucide-react-native';
import { View } from 'react-native';

import { AppHeader, Screen, Text } from '@/components/ui';
import { colors } from '@/theme';

// Placeholder until the Reminders / alerts domain screen is built.
export default function AlertsRoute() {
  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader kicker="Greenfield Farms" title="Reminders" />
      <View className="flex-1 items-center justify-center gap-3 px-8">
        <Bell size={32} color={colors.neutral[400]} />
        <Text tone="muted" className="text-center">
          Reminders are coming soon.
        </Text>
      </View>
    </Screen>
  );
}
