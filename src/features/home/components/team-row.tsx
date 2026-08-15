import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { formatMoneyDisplay, type Money } from '@/lib/decimal';
import { colors } from '@/theme';

export interface TeamRowProps {
  workerCount: number;
  weeklyWages: Money;
  onPress: () => void;
}

/** "Team" summary row: worker count + this week's wages, accent chevron. */
export function TeamRow({ workerCount, weeklyWages, onPress }: TeamRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3.5"
    >
      <View className="flex-1">
        <Text variant="row">Team</Text>
        <Text variant="caption" tone="muted">
          {workerCount} workers · ${formatMoneyDisplay(weeklyWages)} this week
        </Text>
      </View>
      <ChevronRight size={18} color={colors.accent.DEFAULT} strokeWidth={2} />
    </Pressable>
  );
}
