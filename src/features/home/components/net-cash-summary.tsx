import { View } from 'react-native';

import { HeroFigure, Kicker, MicroLabel, Text } from '@/components/ui';
import { moneyToString, type Money } from '@/lib/decimal';

export interface NetCashSummaryProps {
  month: string;
  netCash: Money;
  moneyIn: Money;
  moneyOut: Money;
}

/** "Net cash · <month>" hero figure with a money-in / money-out split below. */
export function NetCashSummary({
  month,
  netCash,
  moneyIn,
  moneyOut,
}: NetCashSummaryProps) {
  return (
    <View className="gap-2 px-4 py-4">
      <Kicker>Net cash · {month}</Kicker>
      <HeroFigure large>${moneyToString(netCash)}</HeroFigure>
      <View className="mt-2 flex-row border-t-hairline border-divider pt-3">
        <View className="flex-1 gap-1">
          <MicroLabel>Money in</MicroLabel>
          <Text variant="row">${moneyToString(moneyIn)}</Text>
        </View>
        <View className="w-px bg-divider" />
        <View className="flex-1 gap-1 pl-4">
          <MicroLabel>Money out</MicroLabel>
          <Text variant="row" tone="accent">
            ${moneyToString(moneyOut)}
          </Text>
        </View>
      </View>
    </View>
  );
}
