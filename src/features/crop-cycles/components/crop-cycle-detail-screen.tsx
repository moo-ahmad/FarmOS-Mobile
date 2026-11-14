import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  Ban,
  CircleCheck,
  EllipsisVertical,
  Pencil,
  Sprout,
  Trash2,
  Wheat,
  type LucideIcon,
} from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { ActionsSheet, type SheetAction } from '@/components/actions-sheet';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { DetailList } from '@/components/detail-list';
import {
  AppHeader,
  Callout,
  MicroLabel,
  Screen,
  Tag,
  Text,
  TextField,
} from '@/components/ui';
import type { CropCycleDto } from '@/lib/crop-cycles';
import { formatMoneyDisplay, parseMoney } from '@/lib/decimal';
import { isLocalDate, todayLocalDate } from '@/lib/forms/rules';
import { colors } from '@/theme';

import { areaLabel, statusTagVariant } from '../display';
import {
  cropCycleApiErrorMessage,
  deleteCropCycleErrorMessage,
} from '../errors';
import {
  useCropVarieties,
  useCycleNames,
  useDeleteCropCycle,
  useTransitionCropCycle,
} from '../hooks';
import {
  CropCycleStatus,
  availableTransitions,
  cropCycleStatusLabel,
  isEndedStatus,
  type CycleTransition,
} from '../model';

export interface CropCycleDetailScreenProps {
  cycle: CropCycleDto;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}

const TRANSITION_ICON: Record<number, LucideIcon> = {
  [CropCycleStatus.Sown]: Sprout,
  [CropCycleStatus.Growing]: Sprout,
  [CropCycleStatus.Harvesting]: Wheat,
  [CropCycleStatus.Closed]: CircleCheck,
  [CropCycleStatus.Failed]: Ban,
  [CropCycleStatus.Abandoned]: Ban,
};

const range = (from: string | null, to: string | null) =>
  from && to && from !== to ? `${from} → ${to}` : (from ?? to);

/**
 * Crop cycle detail: what was planted where, its dates and growth stages,
 * with Edit / the next lifecycle step / Delete in the ⋮ menu.
 */
export function CropCycleDetailScreen({
  cycle,
  onBack,
  onEdit,
  onDeleted,
}: CropCycleDetailScreenProps) {
  const actionsRef = useRef<BottomSheetModal>(null);
  const names = useCycleNames();
  const varieties = useCropVarieties(cycle.cropId);
  const transition = useTransitionCropCycle(cycle.cropCycleId);
  const remove = useDeleteCropCycle(cycle.cropCycleId);

  const [pending, setPending] = useState<CycleTransition | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [date, setDate] = useState(todayLocalDate);
  const [reason, setReason] = useState('');

  const ended = isEndedStatus(cycle.status);
  const varietyName = varieties.data?.find(
    (v) => v.varietyId === cycle.varietyId,
  )?.name;

  const needsDate =
    pending?.input === 'sowDate' || pending?.input === 'harvestEnd';
  const dateError = !needsDate
    ? undefined
    : !isLocalDate(date)
      ? 'Enter a date as YYYY-MM-DD'
      : pending.input === 'harvestEnd' &&
          cycle.actualSowDate &&
          date < cycle.actualSowDate
        ? `Must be on or after sowing (${cycle.actualSowDate})`
        : undefined;

  const openTransition = (next: CycleTransition) => {
    transition.reset();
    setDate(
      next.input === 'harvestEnd'
        ? (cycle.actualHarvestEnd ?? todayLocalDate())
        : todayLocalDate(),
    );
    setReason('');
    setPending(next);
  };

  const sendTransition = () => {
    if (!pending || dateError) return;
    transition.mutate(
      {
        newStatus: pending.to,
        actualSowDate: pending.input === 'sowDate' ? date : null,
        actualHarvestEnd: pending.input === 'harvestEnd' ? date : null,
        terminationReason:
          pending.input === 'reason' && reason.trim() !== ''
            ? reason.trim()
            : null,
      },
      { onSuccess: () => setPending(null) },
    );
  };

  const actions: SheetAction[] = [
    ...(ended
      ? []
      : [
          {
            key: 'edit',
            icon: Pencil,
            label: 'Edit cycle',
            sub: 'Variety, area, planned dates, notes',
            onPress: onEdit,
          },
        ]),
    ...availableTransitions(cycle.status).map((next) => ({
      key: `to-${next.to}`,
      icon: TRANSITION_ICON[next.to] ?? Sprout,
      label: next.label,
      sub: next.sub,
      destructive: next.destructive,
      onPress: () => openTransition(next),
    })),
    {
      key: 'delete',
      icon: Trash2,
      label: 'Delete cycle',
      sub: 'Only for a cycle with no activities, harvests or costs yet',
      destructive: true,
      onPress: () => {
        remove.reset();
        setConfirmingDelete(true);
      },
    },
  ];

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        compact
        kicker={names.crop(cycle.cropId) ?? 'Crop cycle'}
        title={cycle.cycleCode}
        onBack={onBack}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Crop cycle actions"
            hitSlop={12}
            onPress={() => actionsRef.current?.present()}
          >
            <EllipsisVertical size={20} color={colors.ink} />
          </Pressable>
        }
      />
      <ScrollView
        className="bg-neutral-0"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="flex-row items-center gap-2 px-4 pt-4">
          <Tag
            label={cropCycleStatusLabel(cycle.status)}
            variant={statusTagVariant(cycle.status)}
          />
          {cycle.isIntercrop ? (
            <Tag label={`Intercrop · ${cycle.areaSharePct}%`} />
          ) : null}
        </View>
        {(cycle.status === CropCycleStatus.Failed ||
          cycle.status === CropCycleStatus.Abandoned) &&
        cycle.terminationReason ? (
          <Callout className="mx-4 mt-3">{cycle.terminationReason}</Callout>
        ) : null}

        <DetailList
          items={[
            { label: 'Field', value: names.field(cycle.fieldId) ?? null },
            { label: 'Season', value: names.season(cycle.seasonId) ?? null },
            { label: 'Variety', value: varietyName ?? null },
            {
              label: 'Area sown',
              value: areaLabel(cycle.areaSownValue, cycle.areaUomId),
            },
            { label: 'Planned sowing', value: cycle.plannedSowDate },
            { label: 'Sown', value: cycle.actualSowDate },
            { label: 'Planned harvest', value: cycle.plannedHarvestDate },
            {
              label: 'Harvest',
              value: range(cycle.actualHarvestStart, cycle.actualHarvestEnd),
            },
            {
              label: 'Yield',
              value:
                cycle.actualYieldKg !== null
                  ? `${String(cycle.actualYieldKg)} kg`
                  : null,
            },
            {
              label: 'Seed cost',
              value:
                cycle.seedCost === null
                  ? null
                  : `Rs ${formatMoneyDisplay(parseMoney(String(cycle.seedCost)))}`,
            },
            { label: 'Notes', value: cycle.notes },
          ]}
        />

        {cycle.stages.length > 0 ? (
          <View className="px-4 pt-5">
            <MicroLabel>Growth stages</MicroLabel>
            {cycle.stages.map((stage) => (
              <View
                key={stage.id}
                className="flex-row items-center justify-between gap-4 border-b-hairline border-divider py-3"
              >
                <Text variant="row" className="flex-1">
                  {stage.stageName}
                </Text>
                <Text variant="caption" tone="muted">
                  {stage.observedDate
                    ? `Seen ${stage.observedDate}`
                    : `Due ${stage.projectedDate}`}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <ActionsSheet
        ref={actionsRef}
        title={cycle.cycleCode}
        actions={actions}
      />

      <ConfirmDialog
        visible={pending !== null}
        title={pending ? `${pending.label}?` : ''}
        message={pending?.sub ?? ''}
        confirmLabel={pending?.label ?? 'Confirm'}
        loading={transition.isPending}
        errorMessage={
          transition.isError
            ? cropCycleApiErrorMessage(transition.error)
            : undefined
        }
        onCancel={() => setPending(null)}
        onConfirm={sendTransition}
      >
        {needsDate ? (
          <TextField
            label={pending.input === 'sowDate' ? 'Sown on' : 'Harvest ended on'}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
            value={date}
            onChangeText={setDate}
            error={dateError}
          />
        ) : pending?.input === 'reason' ? (
          <TextField
            label="Reason (optional)"
            placeholder="e.g. Flooded in August"
            value={reason}
            onChangeText={setReason}
          />
        ) : null}
      </ConfirmDialog>

      <ConfirmDialog
        visible={confirmingDelete}
        title="Delete this crop cycle?"
        message={`${cycle.cycleCode} will be removed for good. This only works if nothing has been recorded against it yet — otherwise mark it as abandoned.`}
        confirmLabel="Delete"
        loading={remove.isPending}
        errorMessage={
          remove.isError ? deleteCropCycleErrorMessage(remove.error) : undefined
        }
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() =>
          remove.mutate(undefined, {
            onSuccess: () => {
              setConfirmingDelete(false);
              onDeleted();
            },
          })
        }
      />
    </Screen>
  );
}
