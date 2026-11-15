import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react-native';
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type FieldPath,
} from 'react-hook-form';
import { Pressable, View } from 'react-native';

import { PickerSheet } from '@/components/picker-sheet';
import { SelectField } from '@/components/select-field';
import {
  MicroLabel,
  SegmentedControl,
  SelectorRow,
  Text,
  TextField,
} from '@/components/ui';
import {
  isEndedStatus,
  useCropCycles,
  useCycleNames,
} from '@/features/crop-cycles';
import { useFields } from '@/features/fields';
import { useWorkers } from '@/features/workers';
import { colors } from '@/theme';

import { activityCost, costLabel } from '../costs';
import {
  emptyInputLine,
  emptyMachineLine,
  laborLineFor,
  repriceLaborLine,
} from '../form-values';
import { useUnitsOfMeasure } from '../hooks';
import {
  ACTIVITY_STATUS_OPTIONS,
  ACTIVITY_TYPE_OPTIONS,
  INPUT_DIMENSIONS,
  TARGET_OPTIONS,
  activityTypeLabel,
  type ActivityTarget,
} from '../model';
import { activityFormSchema, type ActivityFormValues } from '../schema';
import {
  InputLineEditor,
  LaborLineEditor,
  MachineLineEditor,
} from './line-editors';

export interface ActivityFormProps {
  /** Starting values; read once, on mount. */
  initialValues: ActivityFormValues;
  onSubmit: (values: ActivityFormValues) => void;
}

export interface ActivityFormHandle {
  submit: () => void;
}

type WorkerPick =
  { kind: 'labor'; index: number } | { kind: 'operator'; index: number };

const NO_OPERATOR = 'none';

function AddLineButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="mt-2 min-h-tap flex-row items-center gap-1.5"
    >
      <Plus size={18} color={colors.accent.DEFAULT} />
      <Text tone="accent" className="font-archivo-bold text-label">
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Log/Edit activity fields, wired to `POST`/`PUT /api/activities`: what was
 * done, when, to which crop cycle / field / the whole farm, and the inputs,
 * labor and machinery it used — each line costed live as it's typed. The
 * server recomputes every amount; decimals stay strings end to end.
 */
export const ActivityForm = forwardRef<ActivityFormHandle, ActivityFormProps>(
  function ActivityForm({ initialValues, onSubmit }, ref) {
    const cycleSheet = useRef<BottomSheetModal>(null);
    const fieldSheet = useRef<BottomSheetModal>(null);
    const unitSheet = useRef<BottomSheetModal>(null);
    const workerSheet = useRef<BottomSheetModal>(null);
    const [unitLine, setUnitLine] = useState<number | null>(null);
    const [workerPick, setWorkerPick] = useState<WorkerPick | null>(null);

    const { control, handleSubmit, setValue, getValues } =
      useForm<ActivityFormValues>({
        resolver: zodResolver(activityFormSchema),
        defaultValues: initialValues,
      });
    const inputs = useFieldArray({ control, name: 'inputs' });
    const labor = useFieldArray({ control, name: 'laborLines' });
    const machines = useFieldArray({ control, name: 'machineLines' });
    const values = useWatch({ control }) as ActivityFormValues;

    const cyclesQuery = useCropCycles();
    const fieldsQuery = useFields();
    const workersQuery = useWorkers();
    const unitsQuery = useUnitsOfMeasure();
    const names = useCycleNames();

    // Open cycles, plus the one already chosen (an edit may be on a closed cycle).
    const cycles = useMemo(
      () =>
        (cyclesQuery.data ?? []).filter(
          (c) =>
            !isEndedStatus(c.status) ||
            c.cropCycleId === initialValues.cropCycleId,
        ),
      [cyclesQuery.data, initialValues.cropCycleId],
    );
    const fields = useMemo(
      () =>
        (fieldsQuery.data?.fields ?? []).filter(
          (f) => f.isActive || f.fieldId === initialValues.fieldId,
        ),
      [fieldsQuery.data, initialValues.fieldId],
    );
    const workers = useMemo(() => workersQuery.data ?? [], [workersQuery.data]);
    const units = useMemo(
      () =>
        (unitsQuery.data ?? []).filter((u) =>
          INPUT_DIMENSIONS.includes(u.dimension),
        ),
      [unitsQuery.data],
    );

    const cycle = cycles.find((c) => c.cropCycleId === values.cropCycleId);
    const field = fields.find((f) => f.fieldId === values.fieldId);
    const unitLabel = (uomId: number | null) =>
      unitsQuery.data?.find((u) => u.uomId === uomId)?.code ?? 'Pick a unit';
    const workerById = (workerId: number | null) =>
      workers.find((w) => w.workerId === workerId);
    const workerName = (workerId: number | null) =>
      workers.find((w) => w.workerId === workerId)?.name ??
      (workerId === null ? 'Pick a worker' : 'Unknown worker');

    useImperativeHandle(
      ref,
      () => ({ submit: () => void handleSubmit(onSubmit)() }),
      [handleSubmit, onSubmit],
    );

    const pickedWorkerId =
      workerPick?.kind === 'labor'
        ? values.laborLines[workerPick.index]?.workerId
        : workerPick?.kind === 'operator'
          ? values.machineLines[workerPick.index]?.operatorWorkerId
          : null;

    return (
      <View className="px-4 py-4">
        <Controller
          control={control}
          name="activityType"
          render={({ field: input }) => (
            <SelectField
              label="What was done"
              value={input.value}
              options={ACTIVITY_TYPE_OPTIONS}
              onChange={input.onChange}
              className="mt-0"
            />
          )}
        />

        <View className="mt-4 flex-row gap-2.5">
          <Controller
            control={control}
            name="activityDate"
            render={({ field: input, fieldState }) => (
              <TextField
                label="Date"
                placeholder="YYYY-MM-DD"
                keyboardType="numbers-and-punctuation"
                value={input.value}
                onChangeText={input.onChange}
                error={fieldState.error?.message}
                containerClassName="flex-1"
              />
            )}
          />
          <View className="flex-1">
            <Controller
              control={control}
              name="status"
              render={({ field: input }) => (
                <SelectField
                  label="Status"
                  value={input.value}
                  options={ACTIVITY_STATUS_OPTIONS}
                  onChange={input.onChange}
                  className="mt-0"
                />
              )}
            />
          </View>
        </View>

        <View className="mt-[18px] gap-2">
          <MicroLabel>Done on</MicroLabel>
          <Controller
            control={control}
            name="target"
            render={({ field: input }) => (
              <SegmentedControl<ActivityTarget>
                options={TARGET_OPTIONS}
                value={input.value}
                onChange={input.onChange}
              />
            )}
          />
          {values.target === 'cycle' ? (
            <Controller
              control={control}
              name="cropCycleId"
              render={({ fieldState }) => (
                <View>
                  <SelectorRow
                    title={cycle ? cycle.cycleCode : 'Select a crop cycle'}
                    sub={
                      cycle
                        ? [names.crop(cycle.cropId), names.field(cycle.fieldId)]
                            .filter(Boolean)
                            .join(' · ')
                        : 'Its costs count toward this crop’s P&L'
                    }
                    onPress={() => cycleSheet.current?.present()}
                  />
                  {fieldState.error ? (
                    <Text variant="caption" tone="accent" className="mt-1">
                      {fieldState.error.message}
                    </Text>
                  ) : null}
                </View>
              )}
            />
          ) : values.target === 'field' ? (
            <Controller
              control={control}
              name="fieldId"
              render={({ fieldState }) => (
                <View>
                  <SelectorRow
                    title={field ? field.name : 'Select a field'}
                    sub={
                      field
                        ? field.code
                        : 'Not tied to a crop, e.g. bund repair'
                    }
                    onPress={() => fieldSheet.current?.present()}
                  />
                  {fieldState.error ? (
                    <Text variant="caption" tone="accent" className="mt-1">
                      {fieldState.error.message}
                    </Text>
                  ) : null}
                </View>
              )}
            />
          ) : (
            <Text variant="caption" tone="muted">
              Farm-wide work, e.g. repairing the tubewell. Its cost is shared
              across crops later.
            </Text>
          )}
        </View>

        <Controller
          control={control}
          name="title"
          render={({ field: input, fieldState }) => (
            <TextField
              label="Title (optional)"
              placeholder={activityTypeLabel(values.activityType)}
              value={input.value}
              onChangeText={input.onChange}
              error={fieldState.error?.message}
              containerClassName="mt-4"
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field: input, fieldState }) => (
            <TextField
              label="Notes (optional)"
              placeholder="e.g. Second irrigation, canal water"
              value={input.value}
              onChangeText={input.onChange}
              error={fieldState.error?.message}
              multiline
              containerClassName="mt-4"
            />
          )}
        />

        <View className="mt-6">
          <MicroLabel>Inputs</MicroLabel>
          {inputs.fields.map((line, index) => (
            <InputLineEditor
              key={line.id}
              control={control}
              index={index}
              onRemove={() => inputs.remove(index)}
              unitLabel={unitLabel}
              onPickUnit={() => {
                setUnitLine(index);
                unitSheet.current?.present();
              }}
            />
          ))}
          <AddLineButton
            label="Add input"
            onPress={() => inputs.append(emptyInputLine())}
          />
        </View>

        <View className="mt-4">
          <MicroLabel>Labor</MicroLabel>
          {labor.fields.map((line, index) => (
            <LaborLineEditor
              key={line.id}
              control={control}
              index={index}
              onRemove={() => labor.remove(index)}
              workerName={workerName}
              onPayBasisChange={(payBasis) => {
                const prefix =
                  `laborLines.${index}` as const satisfies FieldPath<ActivityFormValues>;
                const current = getValues(prefix);
                const worker = workerById(current.workerId);
                setValue(
                  prefix,
                  repriceLaborLine(current, worker, worker, payBasis),
                  { shouldValidate: true },
                );
              }}
              onPickWorker={() => {
                setWorkerPick({ kind: 'labor', index });
                workerSheet.current?.present();
              }}
            />
          ))}
          <AddLineButton
            label="Add worker"
            onPress={() => labor.append(laborLineFor())}
          />
        </View>

        <View className="mt-4">
          <MicroLabel>Machinery</MicroLabel>
          {machines.fields.map((line, index) => (
            <MachineLineEditor
              key={line.id}
              control={control}
              index={index}
              onRemove={() => machines.remove(index)}
              workerName={(id) =>
                id === null ? 'No operator' : workerName(id)
              }
              onPickOperator={() => {
                setWorkerPick({ kind: 'operator', index });
                workerSheet.current?.present();
              }}
            />
          ))}
          <AddLineButton
            label="Add machine"
            onPress={() => machines.append(emptyMachineLine())}
          />
        </View>

        <View className="mt-4 flex-row items-center justify-between border-t-rule border-ink pt-3">
          <MicroLabel>Total cost</MicroLabel>
          <Text className="font-archivo-bold text-label">
            {costLabel(activityCost(values))}
          </Text>
        </View>

        <PickerSheet
          ref={cycleSheet}
          title="Crop cycle"
          value={
            values.cropCycleId === null ? null : String(values.cropCycleId)
          }
          emptyMessage="No open crop cycles. Plan one on the Cycles tab first."
          options={cycles.map((c) => ({
            value: String(c.cropCycleId),
            label: c.cycleCode,
            sub: [names.crop(c.cropId), names.field(c.fieldId)]
              .filter(Boolean)
              .join(' · '),
          }))}
          onSelect={(value) => {
            const picked = cycles.find((c) => String(c.cropCycleId) === value);
            setValue('cropCycleId', Number(value), { shouldValidate: true });
            // The cycle's field rides along so field-level lists include it.
            setValue('fieldId', picked?.fieldId ?? null);
            cycleSheet.current?.dismiss();
          }}
        />
        <PickerSheet
          ref={fieldSheet}
          title="Field"
          value={values.fieldId === null ? null : String(values.fieldId)}
          emptyMessage="No active fields yet. Add a field first."
          options={fields.map((f) => ({
            value: String(f.fieldId),
            label: f.name,
            sub: f.code,
          }))}
          onSelect={(value) => {
            setValue('fieldId', Number(value), { shouldValidate: true });
            setValue('cropCycleId', null);
            fieldSheet.current?.dismiss();
          }}
        />
        <PickerSheet
          ref={unitSheet}
          title="Unit"
          value={
            unitLine === null
              ? null
              : String(values.inputs[unitLine]?.uomId ?? '')
          }
          emptyMessage={
            unitsQuery.isError ? "Couldn't load units." : 'Loading units…'
          }
          options={units.map((u) => ({
            value: String(u.uomId),
            label: u.name,
            sub: u.code,
          }))}
          onSelect={(value) => {
            if (unitLine !== null) {
              setValue(`inputs.${unitLine}.uomId`, Number(value), {
                shouldValidate: true,
              });
            }
            unitSheet.current?.dismiss();
          }}
        />
        <PickerSheet
          ref={workerSheet}
          title={workerPick?.kind === 'operator' ? 'Operator' : 'Worker'}
          value={
            pickedWorkerId === null || pickedWorkerId === undefined
              ? workerPick?.kind === 'operator'
                ? NO_OPERATOR
                : null
              : String(pickedWorkerId)
          }
          emptyMessage="No workers yet. Add them under Team on Home."
          options={[
            ...(workerPick?.kind === 'operator'
              ? [{ value: NO_OPERATOR, label: 'No operator' }]
              : []),
            ...workers
              .filter((w) => w.isActive || w.workerId === pickedWorkerId)
              .map((w) => ({
                value: String(w.workerId),
                label: w.name,
              })),
          ]}
          onSelect={(value) => {
            if (workerPick?.kind === 'labor') {
              const prefix =
                `laborLines.${workerPick.index}` as const satisfies FieldPath<ActivityFormValues>;
              const current = getValues(prefix);
              setValue(
                prefix,
                repriceLaborLine(
                  current,
                  workerById(current.workerId),
                  workers.find((w) => String(w.workerId) === value),
                ),
                { shouldValidate: true },
              );
            } else if (workerPick?.kind === 'operator') {
              setValue(
                `machineLines.${workerPick.index}.operatorWorkerId`,
                value === NO_OPERATOR ? null : Number(value),
              );
            }
            workerSheet.current?.dismiss();
          }}
        />
      </View>
    );
  },
);
