import { View } from 'react-native';

import { Text } from '@/components/ui';
import { cn } from '@/lib/cn';
import {
  compareMoney,
  formatMoneyDisplay,
  scaleMoney,
  ZERO_MONEY,
} from '@/lib/decimal';

import type { CropHistoryEntry } from '../fixtures';

export interface CropHistoryRowProps {
  entry: CropHistoryEntry;
  /** Last row in the timeline — no connecting line or bottom divider. */
  isLast: boolean;
}

/**
 * One crop-rotation timeline row: month/year gutter, a dot-and-line spine
 * (filled accent square while active, an outlined square once completed),
 * and the cycle's crop/season plus its net result (or "Active").
 */
export function CropHistoryRow({ entry, isLast }: CropHistoryRowProps) {
  const isActive = entry.status === 'active';
  const isNegative = entry.netAmount
    ? compareMoney(entry.netAmount, ZERO_MONEY) < 0
    : false;
  const magnitude =
    entry.netAmount && isNegative
      ? scaleMoney(entry.netAmount, -1)
      : entry.netAmount;
  const amountLabel = magnitude
    ? `${isNegative ? '−' : '+'}$${formatMoneyDisplay(magnitude)}`
    : null;

  return (
    <View className="flex-row gap-2.5">
      <View className="w-[38px] items-end pt-3.5">
        <Text className="text-right font-archivo-bold text-[10px] text-neutral-500">
          {entry.month}
          {'\n'}
          <Text className="font-archivo-medium text-neutral-500">
            {entry.year}
          </Text>
        </Text>
      </View>
      <View className="w-3.5 items-center">
        <View
          className={cn(
            'mt-3.5 h-3 w-3',
            isActive ? 'bg-accent' : 'border-total border-ink bg-neutral-0',
          )}
        />
        {!isLast ? <View className="mt-0.5 w-0.5 flex-1 bg-divider" /> : null}
      </View>
      <View
        className={cn(
          'flex-1 flex-row items-center gap-2.5 py-2.5',
          !isLast && 'border-b-hairline border-divider',
        )}
      >
        <View className="flex-1">
          <Text variant="row">{entry.cropTitle}</Text>
          <Text variant="caption" tone="muted">
            {entry.seasonLabel}
          </Text>
        </View>
        {isActive ? (
          <Text tone="accent" className="font-archivo-bold text-label">
            Active
          </Text>
        ) : (
          <Text
            className={cn(
              'font-archivo-bold text-label',
              isNegative ? 'text-accent' : 'text-ink',
            )}
          >
            {amountLabel}
          </Text>
        )}
      </View>
    </View>
  );
}
