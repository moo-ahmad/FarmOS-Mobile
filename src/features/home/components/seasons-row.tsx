import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { colors } from '@/theme';

export interface SeasonsRowProps {
  /** Open (not closed) seasons; undefined while loading or offline. */
  openCount: number | undefined;
  onPress: () => void;
}

/** "Seasons" row beside Team and Customers, same shape: live count, accent chevron. */
export function SeasonsRow({ openCount, onPress }: SeasonsRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-tap flex-row items-center gap-3 px-4 py-3.5"
    >
      <View className="flex-1">
        <Text variant="row">Seasons</Text>
        <Text variant="caption" tone="muted">
          {openCount === undefined
            ? 'Rabi, Kharif and Zaid'
            : `${openCount} open`}
        </Text>
      </View>
      <ChevronRight size={18} color={colors.accent.DEFAULT} strokeWidth={2} />
    </Pressable>
  );
}
