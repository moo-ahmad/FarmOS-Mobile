import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { HeroFigure, Kicker, MicroLabel, Text } from '@/components/ui';
import { formatMoneyDisplay, type Money } from '@/lib/decimal';
import { colors } from '@/theme';

export interface NetCashSummaryProps {
  month: string;
  netCash: Money;
  moneyIn: Money;
  moneyOut: Money;
  onPressMoneyIn?: () => void;
  onPressMoneyOut?: () => void;
}

/** "Net cash · <month>" hero figure with a money-in / money-out split below. */
export function NetCashSummary({
  month,
  netCash,
  moneyIn,
  moneyOut,
  onPressMoneyIn,
  onPressMoneyOut,
}: NetCashSummaryProps) {
  return (
    <View className="gap-2 px-4 py-4">
      <Kicker>Net cash · {month}</Kicker>
      <HeroFigure large>${formatMoneyDisplay(netCash)}</HeroFigure>
      <View className="mt-2 flex-row border-t-hairline border-divider pt-3">
        <Pressable
          accessibilityRole="button"
          onPress={onPressMoneyIn}
          className="flex-1 flex-row items-center gap-1.5"
        >
          <View className="flex-1 gap-1">
            <MicroLabel>Money in</MicroLabel>
            <Text variant="row">${formatMoneyDisplay(moneyIn)}</Text>
          </View>
          <ChevronRight size={16} color={colors.accent.DEFAULT} />
        </Pressable>
        <View className="w-px bg-divider" />
        <Pressable
          accessibilityRole="button"
          onPress={onPressMoneyOut}
          className="flex-1 flex-row items-center gap-1.5 pl-4"
        >
          <View className="flex-1 gap-1">
            <MicroLabel>Money out</MicroLabel>
            <Text variant="row" tone="accent">
              ${formatMoneyDisplay(moneyOut)}
            </Text>
          </View>
          <ChevronRight size={16} color={colors.accent.DEFAULT} />
        </Pressable>
      </View>
    </View>
  );
}
