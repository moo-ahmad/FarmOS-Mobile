import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { View } from 'react-native';

import { AppHeader, Screen, Text } from '@/components/ui';
import { colors } from '@/theme';

// Add-field is not one of the 10 designed screens in the handoff — a
// placeholder until a real design exists, so the Fields "+" button has a
// real destination instead of a dead link.
export default function AddFieldRoute() {
  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        kicker="New entry"
        title="Add field"
        onBack={() => router.back()}
      />
      <View className="flex-1 items-center justify-center gap-3 px-8">
        <Plus size={32} color={colors.neutral[400]} />
        <Text tone="muted" className="text-center">
          The add-field form is coming soon.
        </Text>
      </View>
    </Screen>
  );
}
