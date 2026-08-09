import { View } from 'react-native';

import { LevelBar, Tag, Text } from '@/components/ui';
import { cn } from '@/lib/cn';

import type { StockItem } from '../model';

export interface StockRowProps {
  item: StockItem;
  showDivider?: boolean;
}

/** One inventory row: name + status tag, on-hand/reorder sub-row, level bar. */
export function StockRow({ item, showDivider = true }: StockRowProps) {
  const low = item.status === 'low';

  return (
    <View
      className={cn(
        'px-4 py-3.5',
        showDivider && 'border-b-hairline border-divider',
      )}
    >
      <View className="flex-row items-baseline gap-2">
        <Text variant="row" className="flex-1">
          {item.name}
        </Text>
        <Tag label={low ? 'Low' : 'OK'} variant={low ? 'solid' : 'neutral'} />
      </View>
      <View className="mt-1.5 flex-row justify-between">
        <Text variant="caption" tone="muted">
          {item.onHandLabel}
        </Text>
        <Text variant="caption" tone="muted">
          {item.reorderLabel}
        </Text>
      </View>
      <LevelBar
        value={item.fillFraction}
        threshold={item.thresholdFraction}
        low={low}
        className="mt-[5px]"
      />
    </View>
  );
}
