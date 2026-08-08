import { View } from 'react-native';

import { MicroLabel, Text } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface KpiCellData {
  label: string;
  value: string;
  /** Small muted suffix rendered after value, e.g. "/kg". */
  suffix?: string;
  accent?: boolean;
}

export interface KpiGridProps {
  cells: [KpiCellData, KpiCellData, KpiCellData, KpiCellData];
}

/** 2×2 KPI grid with 1px dividers as gridlines (Yield/ha, Cost/kg, Break-even, Sold at). */
export function KpiGrid({ cells }: KpiGridProps) {
  return (
    <View className="flex-row flex-wrap">
      {cells.map((cell, index) => (
        <View
          key={cell.label}
          className={cn(
            'w-1/2 bg-neutral-0 px-4 py-3.5',
            index % 2 === 0 && 'border-r-hairline border-divider',
            index < 2 && 'border-b-hairline border-divider',
          )}
        >
          <MicroLabel>{cell.label}</MicroLabel>
          <View className="mt-1 flex-row items-baseline">
            <Text
              className={cn(
                'font-archivo-bold text-heading',
                cell.accent && 'text-accent',
              )}
            >
              {cell.value}
            </Text>
            {cell.suffix ? <Text variant="caption">{cell.suffix}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
}
