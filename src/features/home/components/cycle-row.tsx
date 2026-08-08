import { Pressable, View } from 'react-native';

import { MicroLabel, ProgressBar, SquareBadge, Text } from '@/components/ui';
import { moneyToString } from '@/lib/decimal';

import type { CropCycle } from '../fixtures';
import { moneyRatio } from '../money-ratio';

export interface CycleRowProps {
  cycle: CropCycle;
  onPress?: () => void;
}

/** One active-cycle row: badge, title/sub, days-to-harvest, cost/budget bar. */
export function CycleRow({ cycle, onPress }: CycleRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="gap-2 px-4 py-3"
    >
      <View className="flex-row items-center gap-3">
        <SquareBadge code={cycle.fieldCode} />
        <View className="flex-1">
          <Text variant="row">{cycle.title}</Text>
          <Text variant="caption" tone="muted">
            {cycle.sub}
          </Text>
        </View>
        <View className="items-end">
          <Text tone="accent" className="font-archivo-bold text-[17px]">
            {cycle.daysToHarvest}d
          </Text>
          <MicroLabel>to harvest</MicroLabel>
        </View>
      </View>
      <View className="gap-1 pl-[48px]">
        <Text variant="caption" tone="muted">
          Cost ${moneyToString(cycle.cost)} / Budget $
          {moneyToString(cycle.budget)}
        </Text>
        <ProgressBar value={moneyRatio(cycle.cost, cycle.budget)} />
      </View>
    </Pressable>
  );
}
