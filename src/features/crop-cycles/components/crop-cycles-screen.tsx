import { ChevronRight, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

import {
  AppHeader,
  Callout,
  Divider,
  Screen,
  SegmentedControl,
  Tag,
  Text,
  type SegmentOption,
} from '@/components/ui';
import type { CropCycleDto } from '@/lib/crop-cycles';
import { colors } from '@/theme';

import { cycleDateLine, cycleSubtitle, statusTagVariant } from '../display';
import { useCropCycles, useCycleNames, type CycleNames } from '../hooks';
import {
  cropCycleStatusLabel,
  matchesFilter,
  type CycleFilter,
} from '../model';

const FILTER_OPTIONS: readonly SegmentOption<CycleFilter>[] = [
  { value: 'active', label: 'Active' },
  { value: 'ended', label: 'Ended' },
  { value: 'all', label: 'All' },
];

function CycleRow({
  cycle,
  names,
  onPress,
}: {
  cycle: CropCycleDto;
  names: CycleNames;
  onPress: () => void;
}) {
  const dateLine = cycleDateLine(cycle);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-tap flex-row items-center gap-3 px-4 py-3.5"
    >
      <View className="flex-1 gap-0.5">
        <Text variant="row">{cycle.cycleCode}</Text>
        <Text variant="caption" tone="muted">
          {cycleSubtitle(cycle, names)}
        </Text>
        {dateLine ? (
          <Text variant="caption" tone="muted">
            {dateLine}
          </Text>
        ) : null}
      </View>
      <Tag
        label={cropCycleStatusLabel(cycle.status)}
        variant={statusTagVariant(cycle.status)}
      />
      <ChevronRight size={18} color={colors.neutral[500]} strokeWidth={2} />
    </Pressable>
  );
}

export interface CropCyclesScreenProps {
  onAddCycle: () => void;
  onOpenCycle: (cropCycleId: number) => void;
}

/**
 * Cycles tab: every crop cycle on the farm, wired to `GET /api/crop-cycles`.
 * Active (planned through harvesting) by default; closed, failed and
 * abandoned cycles sit under Ended.
 */
export function CropCyclesScreen({
  onAddCycle,
  onOpenCycle,
}: CropCyclesScreenProps) {
  const { data, isPending, isError, refetch } = useCropCycles();
  const names = useCycleNames();
  const [filter, setFilter] = useState<CycleFilter>('active');

  const all = useMemo(() => data ?? [], [data]);
  const shown = all.filter((c) => matchesFilter(c.status, filter));
  const activeCount = all.filter((c) =>
    matchesFilter(c.status, 'active'),
  ).length;

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        kicker={`${activeCount} active`}
        title="Crop cycles"
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="New crop cycle"
            hitSlop={12}
            onPress={onAddCycle}
          >
            <Plus size={24} color={colors.ink} strokeWidth={1.9} />
          </Pressable>
        }
      />
      <View className="bg-neutral-0 px-4 pb-1 pt-3">
        <SegmentedControl
          options={FILTER_OPTIONS}
          value={filter}
          onChange={setFilter}
        />
      </View>
      <ScrollView
        className="bg-neutral-0"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {isPending ? (
          <View className="items-center py-12">
            <ActivityIndicator color={colors.ink} />
          </View>
        ) : isError ? (
          <Callout className="m-4">
            Couldn&apos;t load crop cycles.{' '}
            <Text
              tone="accent"
              className="font-archivo-bold"
              onPress={() => refetch()}
            >
              Retry
            </Text>
          </Callout>
        ) : shown.length === 0 ? (
          <View className="items-center gap-1 px-8 py-12">
            <Text variant="row">
              {filter === 'ended' ? 'No ended cycles' : 'No crop cycles yet'}
            </Text>
            <Text variant="caption" tone="muted" className="text-center">
              A cycle is one crop in one field for one season — every cost,
              harvest and sale is counted against it.
            </Text>
          </View>
        ) : (
          shown.map((cycle, index) => (
            <View key={cycle.cropCycleId}>
              <CycleRow
                cycle={cycle}
                names={names}
                onPress={() => onOpenCycle(cycle.cropCycleId)}
              />
              {index < shown.length - 1 ? <Divider className="mx-4" /> : null}
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
