import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Ban, EllipsisVertical, Pencil } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { ActionsSheet } from '@/components/actions-sheet';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { DetailList } from '@/components/detail-list';
import {
  AppHeader,
  Callout,
  MicroLabel,
  Screen,
  Text,
  TextField,
} from '@/components/ui';
import { useCropCycles, useCycleNames } from '@/features/crop-cycles';
import { useWorkers } from '@/features/workers';
import type { ActivityDto } from '@/lib/activities';
import { colors } from '@/theme';

import { apiCostLabel } from '../costs';
import { activityApiErrorMessage } from '../errors';
import { useUnitsOfMeasure, useVoidActivity } from '../hooks';
import {
  activityStatusLabel,
  activityTypeLabel,
  payBasisLabel,
  payBasisNeeds,
} from '../model';

export interface ActivityDetailScreenProps {
  activity: ActivityDto;
  onBack: () => void;
  onEdit: () => void;
}

function LineRow({
  title,
  sub,
  amount,
}: {
  title: string;
  sub: string;
  amount: number;
}) {
  return (
    <View className="flex-row items-center gap-4 border-b-hairline border-divider py-3">
      <View className="flex-1">
        <Text variant="row">{title}</Text>
        <Text variant="caption" tone="muted">
          {sub}
        </Text>
      </View>
      <Text className="font-archivo-bold text-label">
        {apiCostLabel(amount)}
      </Text>
    </View>
  );
}

const VOID_REASON_MAX = 300;

/**
 * Activity detail: what was done where, and every input, labor and machine
 * line with its cost. ⋮ offers Edit and Void — activities are never deleted;
 * voiding keeps the record but takes its cost out of every P&L.
 */
export function ActivityDetailScreen({
  activity,
  onBack,
  onEdit,
}: ActivityDetailScreenProps) {
  const actionsRef = useRef<BottomSheetModal>(null);
  const [voiding, setVoiding] = useState(false);
  const [reason, setReason] = useState('');
  const [triedVoid, setTriedVoid] = useState(false);
  const voidMutation = useVoidActivity(activity.activityId);
  const names = useCycleNames();
  const cycles = useCropCycles();
  const workers = useWorkers();
  const units = useUnitsOfMeasure();

  const cycleCode = cycles.data?.find(
    (c) => c.cropCycleId === activity.cropCycleId,
  )?.cycleCode;
  const workerName = (id: number | null) =>
    workers.data?.find((w) => w.workerId === id)?.name ?? 'Worker';
  const unitCode = (id: number | null) =>
    units.data?.find((u) => u.uomId === id)?.code ?? '';

  const reasonError =
    reason.trim() === ''
      ? 'Say why — it stays on the record'
      : reason.trim().length > VOID_REASON_MAX
        ? `Max ${VOID_REASON_MAX} characters`
        : undefined;

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        compact
        kicker={activityTypeLabel(activity.activityType)}
        title={activity.title}
        onBack={onBack}
        right={
          activity.isVoid ? undefined : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Activity actions"
              hitSlop={12}
              onPress={() => actionsRef.current?.present()}
            >
              <EllipsisVertical size={20} color={colors.ink} />
            </Pressable>
          )
        }
      />
      <ScrollView
        className="bg-neutral-0"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {activity.isVoid ? (
          <Callout className="mx-4 mt-4">
            Voided{activity.voidReason ? ` — ${activity.voidReason}` : ''}. Its
            cost no longer counts toward any P&amp;L.
          </Callout>
        ) : null}

        <DetailList
          items={[
            { label: 'Date', value: activity.activityDate },
            { label: 'Status', value: activityStatusLabel(activity.status) },
            {
              label: 'Done on',
              value:
                cycleCode ??
                (activity.fieldId !== null
                  ? (names.field(activity.fieldId) ?? null)
                  : activity.isFarmLevel
                    ? 'Whole farm'
                    : null),
            },
            { label: 'Notes', value: activity.description },
            { label: 'Inputs', value: apiCostLabel(activity.totalInputCost) },
            { label: 'Labor', value: apiCostLabel(activity.totalLaborCost) },
            {
              label: 'Machinery',
              value: apiCostLabel(activity.totalMachineCost),
            },
            { label: 'Total cost', value: apiCostLabel(activity.totalCost) },
          ]}
        />

        {activity.inputs.length > 0 ? (
          <View className="px-4 pt-5">
            <MicroLabel>Inputs</MicroLabel>
            {activity.inputs.map((line) => (
              <LineRow
                key={line.id}
                title={line.itemName}
                sub={`${String(line.quantityValue)} ${unitCode(line.uomId)} × ${apiCostLabel(line.unitCost)}`}
                amount={line.totalCost}
              />
            ))}
          </View>
        ) : null}

        {activity.laborLines.length > 0 ? (
          <View className="px-4 pt-5">
            <MicroLabel>Labor</MicroLabel>
            {activity.laborLines.map((line) => {
              const needs = payBasisNeeds(line.payBasis);
              const detail =
                needs === 'hours' && line.hours !== null
                  ? `${String(line.hours)} h × ${apiCostLabel(line.rate)}`
                  : needs === 'units' && line.units !== null
                    ? `${String(line.units)} units × ${apiCostLabel(line.rate)}`
                    : payBasisLabel(line.payBasis);
              return (
                <LineRow
                  key={line.id}
                  title={workerName(line.workerId)}
                  sub={detail}
                  amount={line.amount}
                />
              );
            })}
          </View>
        ) : null}

        {activity.machineLines.length > 0 ? (
          <View className="px-4 pt-5">
            <MicroLabel>Machinery</MicroLabel>
            {activity.machineLines.map((line) => (
              <LineRow
                key={line.id}
                title={line.machineName}
                sub={[
                  `${String(line.hours)} h × ${apiCostLabel(line.hourlyChargeRate)}`,
                  line.operatorWorkerId !== null
                    ? workerName(line.operatorWorkerId)
                    : null,
                  line.fuelQuantity !== null
                    ? `${String(line.fuelQuantity)} L fuel`
                    : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
                amount={line.amount}
              />
            ))}
          </View>
        ) : null}
      </ScrollView>

      <ActionsSheet
        ref={actionsRef}
        title={activity.title}
        actions={[
          {
            key: 'edit',
            icon: Pencil,
            label: 'Edit activity',
            sub: 'Type, date, target, inputs, labor and machinery',
            onPress: onEdit,
          },
          {
            key: 'void',
            icon: Ban,
            label: 'Void activity',
            sub: 'Logged by mistake — keeps the record, drops its cost',
            destructive: true,
            onPress: () => {
              voidMutation.reset();
              setReason('');
              setTriedVoid(false);
              setVoiding(true);
            },
          },
        ]}
      />

      <ConfirmDialog
        visible={voiding}
        title="Void this activity?"
        message="It stays on the record with your reason, but its cost is removed from every P&L. This can't be undone."
        confirmLabel="Void"
        loading={voidMutation.isPending}
        errorMessage={
          voidMutation.isError
            ? activityApiErrorMessage(voidMutation.error)
            : undefined
        }
        onCancel={() => setVoiding(false)}
        onConfirm={() => {
          setTriedVoid(true);
          if (reasonError) return;
          voidMutation.mutate(reason.trim(), {
            onSuccess: () => setVoiding(false),
          });
        }}
      >
        <TextField
          label="Reason"
          placeholder="e.g. Logged twice"
          value={reason}
          onChangeText={setReason}
          error={triedVoid || reason !== '' ? reasonError : undefined}
        />
      </ConfirmDialog>
    </Screen>
  );
}
