import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ArrowRight, Info, Sprout } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import {
  AppHeader,
  Button,
  Divider,
  HeroFigure,
  Kicker,
  MicroLabel,
  Screen,
  Tag,
  Text,
} from '@/components/ui';
import { Fonts } from '@/constants/theme';
import { formatMoneyDisplay, quantityToString } from '@/lib/decimal';
import { cn } from '@/lib/cn';
import { colors } from '@/theme';

import type { SeasonDetail, SeasonStatus } from '../model';
import {
  formatProfit,
  seasonDateRangeLabel,
  seasonProfit,
} from '../season-math';
import { CloseSeasonSheet } from './close-season-sheet';
import { SeasonCycleRow } from './season-cycle-row';

export interface SeasonDetailScreenProps {
  season: SeasonDetail;
  onBack?: () => void;
  onEdit?: (seasonId: string) => void;
  onOpenCycle?: (cycleId: string) => void;
  onPlanCycle?: () => void;
  onClosed?: (seasonId: string) => void;
}

function Kpi({
  label,
  value,
  index,
}: {
  label: string;
  value: string;
  index: number;
}) {
  return (
    <View
      className={cn(
        'w-1/2 px-4 py-3',
        index % 2 === 0 && 'border-r-hairline border-divider',
        index < 2 && 'border-b-hairline border-divider',
      )}
    >
      <MicroLabel>{label}</MicroLabel>
      <Text className="mt-0.5 font-archivo-bold text-[21px]">{value}</Text>
    </View>
  );
}

/**
 * Season detail & close (design handoff: "10 - Seasons"): season profit up
 * top, then the KPIs and this season's cycles, each opening its Crop P&L.
 * Close season opens a confirmation sheet; closing flips the screen to its
 * closed state (no Edit/Close, "can't be reopened" hint).
 */
export function SeasonDetailScreen({
  season,
  onBack,
  onEdit,
  onOpenCycle,
  onPlanCycle,
  onClosed,
}: SeasonDetailScreenProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [status, setStatus] = useState<SeasonStatus>(season.status);
  const isOpen = status === 'open';
  const profit = seasonProfit(season);

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        compact
        kicker={`${season.kind} · ${season.codeSuffix}`}
        title={season.name}
        onBack={onBack}
      />
      <ScrollView className="bg-neutral-0">
        <View className="p-4">
          <View className="flex-row flex-wrap items-center gap-2">
            <Tag
              label={isOpen ? 'Open' : 'Closed'}
              variant={isOpen ? 'ink' : 'neutral'}
            />
            <Tag label={season.kind} variant="accent" />
            <Text variant="caption" tone="muted">
              {seasonDateRangeLabel(season)}
            </Text>
          </View>
          <View className="mt-3.5">
            <Kicker>Season profit</Kicker>
            <HeroFigure className="mt-1.5">{formatProfit(profit)}</HeroFigure>
          </View>
          <Text variant="caption" tone="muted" className="mt-2">
            Cycle-code suffix{' '}
            <Text
              variant="caption"
              className="font-archivo-bold"
              style={{ fontFamily: Fonts?.mono }}
            >
              {season.codeSuffix}
            </Text>
          </Text>
        </View>

        <Divider />
        <View className="flex-row flex-wrap">
          <Kpi index={0} label="Cycles" value={String(season.cycles.length)} />
          <Kpi
            index={1}
            label="Planted"
            value={`${quantityToString(season.plantedHectares)} ha`}
          />
          <Kpi
            index={2}
            label="Total cost"
            value={`$${formatMoneyDisplay(season.cost)}`}
          />
          <Kpi
            index={3}
            label="Revenue"
            value={`$${formatMoneyDisplay(season.revenue)}`}
          />
        </View>
        <Divider />

        <View className="flex-row justify-between px-4 pb-1.5 pt-3.5">
          <MicroLabel>Crop cycles</MicroLabel>
          {season.cycles.length > 0 ? (
            <Text variant="label" tone="muted">
              {season.cycles.length}
            </Text>
          ) : null}
        </View>
        {season.cycles.length === 0 ? (
          <View className="px-4 py-5">
            <View className="h-11 w-11 items-center justify-center border-field border-divider">
              <Sprout size={22} color={colors.neutral[600]} />
            </View>
            <Text variant="row" className="mt-3 text-[15px]">
              No crop cycles in this season
            </Text>
            <Text variant="caption" tone="muted" className="mt-1">
              Crop cycles you plan for a season show up here with their cost and
              revenue.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={onPlanCycle}
              className="mt-3 min-h-tap flex-row items-center gap-1.5 self-start"
            >
              <Text tone="accent" className="font-archivo-bold text-label">
                Plan a crop cycle
              </Text>
              <ArrowRight size={16} color={colors.accent.DEFAULT} />
            </Pressable>
          </View>
        ) : (
          season.cycles.map((cycle, index) => (
            <View key={cycle.id}>
              <SeasonCycleRow
                cycle={cycle}
                onPress={() => onOpenCycle?.(cycle.id)}
              />
              {index < season.cycles.length - 1 ? (
                <Divider className="mx-4" />
              ) : null}
            </View>
          ))
        )}
      </ScrollView>

      <View className="border-t-hairline border-divider bg-neutral-0 px-4 py-3">
        {isOpen ? (
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Button
                title="Edit"
                variant="secondary"
                onPress={() => onEdit?.(season.id)}
              />
            </View>
            <View className="flex-1">
              <Button
                title="Close season"
                onPress={() => sheetRef.current?.present()}
              />
            </View>
          </View>
        ) : (
          <>
            <View className="mb-2 flex-row items-center gap-1.5">
              <Info size={14} color={colors.neutral[500]} />
              <Text variant="caption" tone="muted">
                Closed seasons can&apos;t be edited or reopened.
              </Text>
            </View>
            {season.cycles.length === 0 ? (
              <Button
                title="Plan a crop cycle"
                variant="secondary"
                onPress={onPlanCycle}
              />
            ) : null}
          </>
        )}
      </View>

      <CloseSeasonSheet
        ref={sheetRef}
        season={season}
        onCancel={() => sheetRef.current?.dismiss()}
        onConfirm={() => {
          sheetRef.current?.dismiss();
          setStatus('closed');
          onClosed?.(season.id);
        }}
      />
    </Screen>
  );
}
