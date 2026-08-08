import { View } from 'react-native';

import { MicroLabel, Text } from '@/components/ui';
import { cn } from '@/lib/cn';
import { formatMoneyDisplay, moneyToString } from '@/lib/decimal';

import type { CostLine } from '../compute-pnl';

export interface CostBreakdownProps {
  lines: CostLine[];
  /** Pre-formatted "$5,120". */
  totalLabel: string;
}

/** 18px stacked bar (one segment per cost line) + a swatch/label/amount legend. */
export function CostBreakdown({ lines, totalLabel }: CostBreakdownProps) {
  const totalCents = lines.reduce(
    (sum, line) => sum + Number(moneyToString(line.amount)),
    0,
  );

  return (
    <View className="px-4 py-4">
      <View className="mb-3 flex-row items-baseline justify-between">
        <MicroLabel>Cost breakdown</MicroLabel>
        <Text className="font-archivo-bold text-label">{totalLabel}</Text>
      </View>

      <View className="h-[18px] w-full flex-row overflow-hidden">
        {lines.map((line) => {
          const amount = Number(moneyToString(line.amount));
          const widthPercent = totalCents > 0 ? (amount / totalCents) * 100 : 0;
          return (
            <View
              key={line.label}
              style={{ width: `${widthPercent}%` }}
              className={cn('h-full', line.colorClass)}
            />
          );
        })}
      </View>

      <View className="mt-3.5 gap-2">
        {lines.map((line) => (
          <View key={line.label} className="flex-row items-center gap-2.5">
            <View className={cn('h-2.5 w-2.5', line.colorClass)} />
            <Text variant="caption" className="flex-1">
              {line.label}
            </Text>
            <Text className="font-archivo-bold text-caption">
              ${formatMoneyDisplay(line.amount)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
