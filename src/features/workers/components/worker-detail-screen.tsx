import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  Eye,
  EyeOff,
  EllipsisVertical,
  Pencil,
  Trash2,
} from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';

import { ActionsSheet } from '@/components/actions-sheet';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { DetailList } from '@/components/detail-list';
import { AppHeader, Callout, Screen, TextField } from '@/components/ui';
import { isLocalDate, todayLocalDate } from '@/lib/forms/rules';
import type { WorkerDto } from '@/lib/workers';
import { colors } from '@/theme';

import { deleteWorkerErrorMessage, workerApiErrorMessage } from '../errors';
import {
  useDeactivateWorker,
  useDeleteWorker,
  useReactivateWorker,
} from '../hooks';
import { employmentTypeLabel } from '../model';
import { rateLabel } from '../worker-display';

export interface WorkerDetailScreenProps {
  worker: WorkerDto;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}

/** Worker detail: pay rates and profile, with Edit / Mark as left / Delete in the ⋮ menu. */
export function WorkerDetailScreen({
  worker,
  onBack,
  onEdit,
  onDeleted,
}: WorkerDetailScreenProps) {
  const actionsRef = useRef<BottomSheetModal>(null);
  const [confirming, setConfirming] = useState<'deactivate' | 'delete' | null>(
    null,
  );
  const [exitDate, setExitDate] = useState(todayLocalDate);
  const deactivate = useDeactivateWorker(worker.workerId);
  const reactivate = useReactivateWorker(worker.workerId);
  const remove = useDeleteWorker(worker.workerId);

  const exitDateError = !isLocalDate(exitDate)
    ? 'Enter a date as YYYY-MM-DD'
    : exitDate < worker.joinDate
      ? `Must be on or after ${worker.joinDate}`
      : undefined;

  const closeConfirm = () => {
    setConfirming(null);
    deactivate.reset();
    remove.reset();
  };

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        compact
        kicker={employmentTypeLabel(worker.employmentType)}
        title={worker.name}
        onBack={onBack}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Worker actions"
            hitSlop={12}
            onPress={() => actionsRef.current?.present()}
          >
            <EllipsisVertical size={20} color={colors.ink} />
          </Pressable>
        }
      />
      <ScrollView className="bg-neutral-0">
        {worker.isActive ? null : (
          <Callout className="mx-4 mt-4">
            Left on {worker.exitDate ?? '—'} — hidden from attendance and active
            lists.
          </Callout>
        )}
        <DetailList
          items={[
            { label: 'Daily wage', value: rateLabel(worker.dailyWage) },
            { label: 'Hourly rate', value: rateLabel(worker.hourlyRate) },
            { label: 'Monthly salary', value: rateLabel(worker.monthlySalary) },
            {
              label: 'Overtime',
              value: `${String(worker.overtimeMultiplier)}×`,
            },
            { label: 'Joined', value: worker.joinDate },
            { label: 'Phone', value: worker.phone },
            { label: 'CNIC / ID', value: worker.cnicOrId },
            { label: 'Skills', value: worker.skills },
          ]}
        />
        {reactivate.isError ? (
          <Callout className="m-4">
            {workerApiErrorMessage(reactivate.error)}
          </Callout>
        ) : null}
      </ScrollView>

      <ActionsSheet
        ref={actionsRef}
        title={worker.name}
        actions={[
          {
            key: 'edit',
            icon: Pencil,
            label: 'Edit worker',
            sub: 'Name, type, pay rates, contact',
            onPress: onEdit,
          },
          worker.isActive
            ? {
                key: 'deactivate',
                icon: EyeOff,
                label: 'Mark as left',
                sub: 'Record an exit date; attendance and wage history is kept',
                onPress: () => {
                  setExitDate(todayLocalDate());
                  setConfirming('deactivate');
                },
              }
            : {
                key: 'reactivate',
                icon: Eye,
                label: 'Reactivate worker',
                sub: 'They are back — clears the exit date',
                onPress: () => reactivate.mutate(),
              },
          {
            key: 'delete',
            icon: Trash2,
            label: 'Delete worker',
            sub: 'Only for a worker with no attendance or wages yet',
            destructive: true,
            onPress: () => setConfirming('delete'),
          },
        ]}
      />

      <ConfirmDialog
        visible={confirming === 'deactivate'}
        title="Mark this worker as left?"
        message={`${worker.name} will be hidden from attendance and active lists. Their attendance and wage history stays intact.`}
        confirmLabel="Mark as left"
        loading={deactivate.isPending}
        errorMessage={
          deactivate.isError
            ? workerApiErrorMessage(deactivate.error)
            : undefined
        }
        onCancel={closeConfirm}
        onConfirm={() => {
          if (exitDateError) return;
          deactivate.mutate(exitDate, { onSuccess: () => setConfirming(null) });
        }}
      >
        <TextField
          label="Last day"
          placeholder="YYYY-MM-DD"
          keyboardType="numbers-and-punctuation"
          value={exitDate}
          onChangeText={setExitDate}
          error={exitDateError}
        />
      </ConfirmDialog>

      <ConfirmDialog
        visible={confirming === 'delete'}
        title="Delete this worker?"
        message={`${worker.name} will be removed for good. This only works if they have no attendance, labor or wage records — otherwise mark them as left.`}
        confirmLabel="Delete"
        loading={remove.isPending}
        errorMessage={
          remove.isError ? deleteWorkerErrorMessage(remove.error) : undefined
        }
        onCancel={closeConfirm}
        onConfirm={() =>
          remove.mutate(undefined, {
            onSuccess: () => {
              setConfirming(null);
              onDeleted();
            },
          })
        }
      />
    </Screen>
  );
}
