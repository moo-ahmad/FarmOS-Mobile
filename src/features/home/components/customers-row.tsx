import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { colors } from '@/theme';

export interface CustomersRowProps {
  /** Active customers; undefined while loading or offline. */
  activeCount: number | undefined;
  onPress: () => void;
}

/** "Customers" row under Team, same shape: live count, accent chevron. */
export function CustomersRow({ activeCount, onPress }: CustomersRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-tap flex-row items-center gap-3 px-4 py-3.5"
    >
      <View className="flex-1">
        <Text variant="row">Customers</Text>
        <Text variant="caption" tone="muted">
          {activeCount === undefined
            ? 'Arthis, traders and buyers'
            : `${activeCount} active`}
        </Text>
      </View>
      <ChevronRight size={18} color={colors.accent.DEFAULT} strokeWidth={2} />
    </Pressable>
  );
}
