import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { SquareBadge, Tag, Text } from '@/components/ui';
import { quantityToString } from '@/lib/decimal';
import { colors } from '@/theme';

import type { SeasonCycle } from '../model';

export interface SeasonCycleRowProps {
  cycle: SeasonCycle;
  onPress?: () => void;
}

/** One crop cycle in a season: field badge, crop, code + area, status, chevron. */
export function SeasonCycleRow({ cycle, onPress }: SeasonCycleRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3"
    >
      <SquareBadge code={cycle.fieldCode} size={38} />
      <View className="flex-1">
        <Text variant="row">{cycle.title}</Text>
        <Text variant="caption" tone="muted">
          {cycle.cycleCode} · {quantityToString(cycle.areaHectares)} ha
        </Text>
      </View>
      <Tag label={cycle.status} />
      <ChevronRight size={18} color={colors.accent.DEFAULT} strokeWidth={2} />
    </Pressable>
  );
}
