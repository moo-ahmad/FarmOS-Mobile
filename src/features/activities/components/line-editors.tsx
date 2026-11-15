import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Controller, useWatch, type Control } from 'react-hook-form';
import { Pressable, View } from 'react-native';

import { SelectField } from '@/components/select-field';
import {
  MicroLabel,
  NumericField,
  SelectorRow,
  Text,
  TextField,
} from '@/components/ui';
import { colors } from '@/theme';

import {
  costLabel,
  inputLineCost,
  laborLineCost,
  machineLineCost,
} from '../costs';
import { PAY_BASIS_OPTIONS, payBasisNeeds } from '../model';
import type { ActivityFormValues } from '../schema';

interface LineCardProps {
  title: string;
  cost: string;
  onRemove: () => void;
  children: ReactNode;
}

/** One cost line: a hairline box with its running cost and a ✕ to drop it. */
function LineCard({ title, cost, onRemove, children }: LineCardProps) {
  return (
    <View className="mt-3 border-field border-divider px-3 pb-3 pt-2">
      <View className="min-h-tap flex-row items-center gap-3">
        <View className="flex-1">
          <MicroLabel>{title}</MicroLabel>
        </View>
        <Text className="font-archivo-bold text-label">{cost}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${title}`}
          hitSlop={12}
          onPress={onRemove}
          className="min-h-tap min-w-tap items-center justify-center"
        >
          <X size={18} color={colors.ink} />
        </Pressable>
      </View>
      {children}
    </View>
  );
}

const errorText = (message: string | undefined) =>
  message ? (
    <Text variant="caption" tone="accent" className="mt-1">
      {message}
    </Text>
  ) : null;

interface LineEditorProps {
  control: Control<ActivityFormValues>;
  index: number;
  onRemove: () => void;
}

export function InputLineEditor({
  control,
  index,
  onRemove,
  unitLabel,
  onPickUnit,
}: LineEditorProps & {
  unitLabel: (uomId: number | null) => string;
  onPickUnit: () => void;
}) {
  const line = useWatch({ control, name: `inputs.${index}` });
  return (
    <LineCard
      title={`Input ${index + 1}`}
      cost={costLabel(inputLineCost(line))}
      onRemove={onRemove}
    >
      <Controller
        control={control}
        name={`inputs.${index}.itemName`}
        render={({ field, fieldState }) => (
          <TextField
            label="Item"
            placeholder="e.g. Urea, DAP, Confidor"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <View className="mt-3 flex-row gap-2.5">
        <Controller
          control={control}
          name={`inputs.${index}.quantityValue`}
          render={({ field, fieldState }) => (
            <NumericField
              label="Quantity"
              placeholder="e.g. 50"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              containerClassName="flex-1"
            />
          )}
        />
        <Controller
          control={control}
          name={`inputs.${index}.uomId`}
          render={({ field, fieldState }) => (
            <View className="flex-1 gap-1.5">
              <MicroLabel>Unit</MicroLabel>
              <SelectorRow
                title={unitLabel(field.value)}
                onPress={onPickUnit}
              />
              {errorText(fieldState.error?.message)}
            </View>
          )}
        />
      </View>
      <Controller
        control={control}
        name={`inputs.${index}.unitCost`}
        render={({ field, fieldState }) => (
          <NumericField
            label={`Cost per ${line.uomId === null ? 'unit' : unitLabel(line.uomId)} (Rs)`}
            placeholder="e.g. 4500"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
            containerClassName="mt-3"
          />
        )}
      />
    </LineCard>
  );
}

export function LaborLineEditor({
  control,
  index,
  onRemove,
  workerName,
  onPickWorker,
  onPayBasisChange,
}: LineEditorProps & {
  workerName: (workerId: number | null) => string;
  onPickWorker: () => void;
  /** Changes the basis and re-prices the rate from the worker's saved rates. */
  onPayBasisChange: (payBasis: number) => void;
}) {
  const line = useWatch({ control, name: `laborLines.${index}` });
  const needs = payBasisNeeds(line.payBasis);
  return (
    <LineCard
      title={`Labor ${index + 1}`}
      cost={costLabel(laborLineCost(line))}
      onRemove={onRemove}
    >
      <Controller
        control={control}
        name={`laborLines.${index}.workerId`}
        render={({ field, fieldState }) => (
          <View className="gap-1.5">
            <MicroLabel>Worker</MicroLabel>
            <SelectorRow
              title={workerName(field.value)}
              onPress={onPickWorker}
            />
            {errorText(fieldState.error?.message)}
          </View>
        )}
      />
      <Controller
        control={control}
        name={`laborLines.${index}.payBasis`}
        render={({ field }) => (
          <SelectField
            label="Paid"
            value={field.value}
            options={PAY_BASIS_OPTIONS}
            onChange={onPayBasisChange}
            className="mt-3"
          />
        )}
      />
      <View className="mt-3 flex-row gap-2.5">
        {needs === 'units' ? (
          <Controller
            control={control}
            name={`laborLines.${index}.units`}
            render={({ field, fieldState }) => (
              <NumericField
                label="Units done"
                placeholder="e.g. 40"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
                containerClassName="flex-1"
              />
            )}
          />
        ) : (
          <Controller
            control={control}
            name={`laborLines.${index}.hours`}
            render={({ field, fieldState }) => (
              <NumericField
                label={needs === 'hours' ? 'Hours' : 'Hours (optional)'}
                placeholder="e.g. 8"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
                containerClassName="flex-1"
              />
            )}
          />
        )}
        <Controller
          control={control}
          name={`laborLines.${index}.rate`}
          render={({ field, fieldState }) => (
            <NumericField
              label={
                needs === 'hours'
                  ? 'Rate / hour'
                  : needs === 'units'
                    ? 'Rate / unit'
                    : 'Amount (Rs)'
              }
              placeholder="e.g. 1200"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              containerClassName="flex-1"
            />
          )}
        />
      </View>
    </LineCard>
  );
}

export function MachineLineEditor({
  control,
  index,
  onRemove,
  workerName,
  onPickOperator,
}: LineEditorProps & {
  workerName: (workerId: number | null) => string;
  onPickOperator: () => void;
}) {
  const line = useWatch({ control, name: `machineLines.${index}` });
  return (
    <LineCard
      title={`Machine ${index + 1}`}
      cost={costLabel(machineLineCost(line))}
      onRemove={onRemove}
    >
      <Controller
        control={control}
        name={`machineLines.${index}.machineName`}
        render={({ field, fieldState }) => (
          <TextField
            label="Machine"
            placeholder="e.g. Tractor, rotavator"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <View className="mt-3 flex-row gap-2.5">
        <Controller
          control={control}
          name={`machineLines.${index}.hours`}
          render={({ field, fieldState }) => (
            <NumericField
              label="Hours"
              placeholder="e.g. 3"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              containerClassName="flex-1"
            />
          )}
        />
        <Controller
          control={control}
          name={`machineLines.${index}.hourlyChargeRate`}
          render={({ field, fieldState }) => (
            <NumericField
              label="Rate / hour"
              placeholder="e.g. 2500"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              containerClassName="flex-1"
            />
          )}
        />
      </View>
      <View className="mt-3 flex-row gap-2.5">
        <Controller
          control={control}
          name={`machineLines.${index}.fuelQuantity`}
          render={({ field, fieldState }) => (
            <NumericField
              label="Fuel, L (optional)"
              placeholder="—"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              containerClassName="flex-1"
            />
          )}
        />
        <Controller
          control={control}
          name={`machineLines.${index}.fuelCost`}
          render={({ field, fieldState }) => (
            <NumericField
              label="Fuel cost (optional)"
              placeholder="—"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              containerClassName="flex-1"
            />
          )}
        />
      </View>
      <View className="mt-3 gap-1.5">
        <MicroLabel>Operator (optional)</MicroLabel>
        <SelectorRow
          title={workerName(line.operatorWorkerId)}
          onPress={onPickOperator}
        />
      </View>
    </LineCard>
  );
}
