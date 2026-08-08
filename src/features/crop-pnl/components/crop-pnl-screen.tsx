import { EllipsisVertical } from 'lucide-react-native';
import { Alert, Pressable, ScrollView, View } from 'react-native';

import {
  AppHeader,
  Divider,
  HeroFigure,
  Kicker,
  Screen,
  Tag,
  Text,
} from '@/components/ui';
import type { CropCycle } from '@/features/home';
import { formatMoneyDisplay } from '@/lib/decimal';
import { colors } from '@/theme';

import { computeCropPnl, type CropPnlInputs } from '../compute-pnl';
import { CostBreakdown } from './cost-breakdown';
import { KpiGrid, type KpiCellData } from './kpi-grid';
import { RevenueDeductions } from './revenue-deductions';

function cropLabelFor(cycle: CropCycle): string {
  return cycle.title.split(' · ')[0] ?? cycle.title;
}

export interface CropPnlScreenProps {
  cycle: CropCycle;
  inputs: CropPnlInputs;
  onBack: () => void;
}

/** Crop P&L (canvas `1a`, frame 2): a derived, always-reconciling per-cycle P&L. */
export function CropPnlScreen({ cycle, inputs, onBack }: CropPnlScreenProps) {
  const pnl = computeCropPnl(inputs);

  const kpiCells: [KpiCellData, KpiCellData, KpiCellData, KpiCellData] = [
    { label: 'Yield / ha', value: pnl.yieldPerHaLabel },
    { label: 'Cost / kg', value: `$${formatMoneyDisplay(pnl.costPerKg)}` },
    {
      label: 'Break-even',
      value: `$${formatMoneyDisplay(pnl.breakEvenPerKg)}`,
      suffix: '/kg',
    },
    {
      label: 'Sold at',
      value: `$${formatMoneyDisplay(pnl.soldAtPerKg)}`,
      suffix: '/kg',
      accent: true,
    },
  ];

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        compact
        kicker={`${cycle.fieldCode} · ${cropLabelFor(cycle)} · ${pnl.season}`}
        title="Crop P&L"
        onBack={onBack}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="More options"
            hitSlop={8}
            onPress={() =>
              Alert.alert('Crop P&L', 'More actions are coming soon.')
            }
          >
            <EllipsisVertical size={20} color={colors.ink} />
          </Pressable>
        }
      />
      <ScrollView className="bg-neutral-0">
        <View className="px-4 py-4">
          <Kicker>Net profit · projected</Kicker>
          <HeroFigure large className="mt-1.5">
            ${formatMoneyDisplay(pnl.netProfit)}
          </HeroFigure>
          <View className="mt-3 flex-row items-center gap-2">
            <Tag variant="solid" label={`+${pnl.roiPercent}% ROI`} />
            <Text variant="caption" tone="muted">
              Gross margin{' '}
              <Text className="font-archivo-bold" tone="default">
                ${formatMoneyDisplay(pnl.grossMargin)}
              </Text>
            </Text>
          </View>
        </View>
        <Divider />
        <KpiGrid cells={kpiCells} />
        <Divider />
        <CostBreakdown
          lines={pnl.costBreakdown}
          totalLabel={`$${formatMoneyDisplay(pnl.totalCost)}`}
        />
        <Divider />
        <RevenueDeductions pnl={pnl} />
      </ScrollView>
    </Screen>
  );
}
