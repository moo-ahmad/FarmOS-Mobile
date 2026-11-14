import { ChevronRight, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

import {
  AppHeader,
  Callout,
  Divider,
  Screen,
  Tag,
  Text,
} from '@/components/ui';
import type { WorkerDto } from '@/lib/workers';
import { colors } from '@/theme';

import { useWorkers } from '../hooks';
import { employmentTypeLabel } from '../model';
import { payLabel } from '../worker-display';

export interface WorkersScreenProps {
  onBack?: () => void;
  onAddWorker: () => void;
  onOpenWorker: (workerId: number) => void;
}

function WorkerRow({
  worker,
  onPress,
}: {
  worker: WorkerDto;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-tap flex-row items-center gap-3 px-4 py-3.5"
    >
      <View className="flex-1">
        <Text variant="row">{worker.name}</Text>
        <Text variant="caption" tone="muted">
          {employmentTypeLabel(worker.employmentType)} · {payLabel(worker)}
        </Text>
      </View>
      {worker.isActive ? null : <Tag label="Left" variant="neutral" />}
      <ChevronRight size={18} color={colors.neutral[500]} strokeWidth={2} />
    </Pressable>
  );
}

/**
 * Team: the farm's workers, wired to `GET /api/workers`. Active workers by
 * default; ones who have left sit behind a toggle so they can be reopened
 * and reactivated (e.g. a seasonal hand returning).
 */
export function WorkersScreen({
  onBack,
  onAddWorker,
  onOpenWorker,
}: WorkersScreenProps) {
  const { data, isPending, isError, refetch } = useWorkers();
  const [showInactive, setShowInactive] = useState(false);

  const all = useMemo(() => data ?? [], [data]);
  const activeCount = all.filter((w) => w.isActive).length;
  const inactiveCount = all.length - activeCount;
  const shown = showInactive ? all : all.filter((w) => w.isActive);

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        kicker={`${activeCount} active`}
        title="Team"
        onBack={onBack}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add worker"
            hitSlop={12}
            onPress={onAddWorker}
          >
            <Plus size={24} color={colors.ink} strokeWidth={1.9} />
          </Pressable>
        }
      />
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
            Couldn&apos;t load workers.{' '}
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
            <Text variant="row">No workers yet</Text>
            <Text variant="caption" tone="muted" className="text-center">
              Add your hands — and yourself, with a notional wage — so
              attendance and labor costs can be tracked.
            </Text>
          </View>
        ) : (
          shown.map((worker, index) => (
            <View key={worker.workerId}>
              <WorkerRow
                worker={worker}
                onPress={() => onOpenWorker(worker.workerId)}
              />
              {index < shown.length - 1 ? <Divider className="mx-4" /> : null}
            </View>
          ))
        )}

        {inactiveCount > 0 ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowInactive((value) => !value)}
            className="min-h-tap justify-center px-4"
          >
            <Text tone="accent" className="font-archivo-bold text-label">
              {showInactive
                ? 'Hide past workers'
                : `Show past workers (${inactiveCount})`}
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
