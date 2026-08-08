import { View } from 'react-native';

import { MicroLabel, Text, TotalRule } from '@/components/ui';
import { formatMoneyDisplay, quantityToString } from '@/lib/decimal';

import type { CropPnl } from '../compute-pnl';

export interface RevenueDeductionsProps {
  pnl: Pick<
    CropPnl,
    'quantitySoldKg' | 'grossRevenue' | 'deductions' | 'netReceived'
  >;
}

/** "N kg sold $X" + deduction rows + a total rule + "Net received". */
export function RevenueDeductions({ pnl }: RevenueDeductionsProps) {
  return (
    <View className="px-4 pb-[22px] pt-4">
      <MicroLabel>Revenue &amp; deductions</MicroLabel>
      <View className="mt-3 flex-row items-baseline justify-between py-0.5">
        <Text variant="caption">
          {Number(quantityToString(pnl.quantitySoldKg)).toLocaleString()} kg
          sold
        </Text>
        <Text variant="caption" className="font-archivo-bold">
          ${formatMoneyDisplay(pnl.grossRevenue)}
        </Text>
      </View>
      {pnl.deductions.map((line) => (
        <View
          key={line.label}
          className="flex-row items-baseline justify-between py-0.5"
        >
          <Text variant="caption" tone="muted">
            {line.label}
          </Text>
          <Text variant="caption" tone="muted">
            −${formatMoneyDisplay(line.amount)}
          </Text>
        </View>
      ))}
      <TotalRule className="my-2" />
      <View className="flex-row items-baseline justify-between">
        <Text variant="label" className="font-archivo-bold">
          Net received
        </Text>
        <Text variant="heading">${formatMoneyDisplay(pnl.netReceived)}</Text>
      </View>
    </View>
  );
}
