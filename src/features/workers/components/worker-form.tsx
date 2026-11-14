import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { View } from 'react-native';

import { SelectField } from '@/components/select-field';
import { MicroLabel, NumericField, Text, TextField } from '@/components/ui';

import { EMPLOYMENT_TYPE_OPTIONS, isNotionallyWaged } from '../model';
import { workerFormSchema, type WorkerFormValues } from '../schema';

export interface WorkerFormProps {
  /** Starting values; read once, on mount. */
  initialValues: WorkerFormValues;
  onSubmit: (values: WorkerFormValues) => void;
}

export interface WorkerFormHandle {
  submit: () => void;
}

/**
 * Add/Edit Worker fields, wired to the `POST`/`PUT /api/workers` contract.
 * Every rate is optional (piece-rate and contract hands may have none) and
 * uses the decimal keypad; rates stay strings end to end.
 */
export const WorkerForm = forwardRef<WorkerFormHandle, WorkerFormProps>(
  function WorkerForm({ initialValues, onSubmit }, ref) {
    const { control, handleSubmit } = useForm<WorkerFormValues>({
      resolver: zodResolver(workerFormSchema),
      defaultValues: initialValues,
    });
    const employmentType = useWatch({ control, name: 'employmentType' });

    useImperativeHandle(
      ref,
      () => ({ submit: () => void handleSubmit(onSubmit)() }),
      [handleSubmit, onSubmit],
    );

    return (
      <View className="px-4 py-4">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextField
              label="Name"
              placeholder="e.g. Rizwan"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="employmentType"
          render={({ field }) => (
            <SelectField
              label="Employment type"
              value={field.value}
              options={EMPLOYMENT_TYPE_OPTIONS}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="joinDate"
          render={({ field, fieldState }) => (
            <TextField
              label="Joined on"
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              containerClassName="mt-4"
            />
          )}
        />

        <View className="mt-[18px]">
          <MicroLabel>Pay</MicroLabel>
          {isNotionallyWaged(employmentType) ? (
            <Text variant="caption" tone="muted" className="mt-1">
              Unpaid, but set a notional daily wage so this labor is counted in
              crop costs.
            </Text>
          ) : null}
        </View>
        <View className="mt-2 flex-row gap-2.5">
          <Controller
            control={control}
            name="dailyWage"
            render={({ field, fieldState }) => (
              <NumericField
                label="Daily wage"
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
            name="hourlyRate"
            render={({ field, fieldState }) => (
              <NumericField
                label="Hourly rate"
                placeholder="—"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
                containerClassName="flex-1"
              />
            )}
          />
        </View>
        <View className="mt-4 flex-row gap-2.5">
          <Controller
            control={control}
            name="monthlySalary"
            render={({ field, fieldState }) => (
              <NumericField
                label="Monthly salary"
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
            name="overtimeMultiplier"
            render={({ field, fieldState }) => (
              <NumericField
                label="Overtime ×"
                placeholder="1.5"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
                containerClassName="flex-1"
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <TextField
              label="Phone (optional)"
              placeholder="0300-1234567"
              keyboardType="phone-pad"
              inputMode="tel"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              containerClassName="mt-4"
            />
          )}
        />

        <Controller
          control={control}
          name="cnicOrId"
          render={({ field, fieldState }) => (
            <TextField
              label="CNIC / ID (optional)"
              placeholder="35202-1234567-1"
              keyboardType="numbers-and-punctuation"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              containerClassName="mt-4"
            />
          )}
        />

        <Controller
          control={control}
          name="skills"
          render={({ field, fieldState }) => (
            <TextField
              label="Skills (optional)"
              placeholder="e.g. Tractor, spraying"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              containerClassName="mt-4"
            />
          )}
        />
      </View>
    );
  },
);
