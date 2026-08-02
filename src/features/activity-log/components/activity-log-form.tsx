import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Button, NumericField, Text, TextField } from '@/components/ui';
import { cn } from '@/lib/cn';

import { ACTIVITY_TYPE_TKEY, ACTIVITY_TYPES, UNITS } from '../model';
import { activityLogFormSchema, type ActivityLogFormValues } from '../schema';

interface OptionRowProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labelFor?: (value: T) => string;
}

function OptionRow<T extends string>({
  options,
  value,
  onChange,
  labelFor,
}: OptionRowProps<T>) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option)}
            className={cn(
              'min-h-tap justify-center rounded-xl border px-4',
              selected
                ? 'border-primary-600 bg-primary-600'
                : 'border-neutral-200 dark:border-neutral-700',
            )}
          >
            <Text tone={selected ? 'inverse' : 'default'}>
              {labelFor ? labelFor(option) : option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-1">
      <Text variant="label" tone="muted">
        {label}
      </Text>
      {children}
    </View>
  );
}

export interface ActivityLogFormProps {
  onSubmit: (values: ActivityLogFormValues) => void;
  submitting?: boolean;
}

export function ActivityLogForm({
  onSubmit,
  submitting,
}: ActivityLogFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivityLogFormValues>({
    resolver: zodResolver(activityLogFormSchema),
    defaultValues: {
      activityType: 'irrigation',
      quantity: '',
      unit: 'kg',
      cost: '',
      notes: '',
    },
  });

  const submit = handleSubmit((values) => {
    onSubmit(values);
    reset();
  });

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="activityType"
        render={({ field }) => (
          <Field label={t('activity.fields.type')}>
            <OptionRow
              options={ACTIVITY_TYPES}
              value={field.value}
              onChange={field.onChange}
              labelFor={(type) => t(ACTIVITY_TYPE_TKEY[type])}
            />
          </Field>
        )}
      />

      <View className="flex-row gap-3">
        <Controller
          control={control}
          name="quantity"
          render={({ field }) => (
            <NumericField
              containerClassName="flex-1"
              label={t('activity.fields.quantity')}
              value={field.value}
              onChangeText={field.onChange}
              error={
                errors.quantity ? t(errors.quantity.message ?? '') : undefined
              }
            />
          )}
        />
        <Controller
          control={control}
          name="unit"
          render={({ field }) => (
            <Field label={t('activity.fields.unit')}>
              <OptionRow
                options={UNITS}
                value={field.value}
                onChange={field.onChange}
              />
            </Field>
          )}
        />
      </View>

      <Controller
        control={control}
        name="cost"
        render={({ field }) => (
          <NumericField
            label={t('activity.fields.cost')}
            value={field.value ?? ''}
            onChangeText={field.onChange}
            error={errors.cost ? t(errors.cost.message ?? '') : undefined}
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field }) => (
          <TextField
            label={t('activity.fields.notes')}
            value={field.value ?? ''}
            onChangeText={field.onChange}
            multiline
            error={errors.notes ? t(errors.notes.message ?? '') : undefined}
          />
        )}
      />

      <Button
        title={t('common.save')}
        haptic="success"
        loading={submitting}
        onPress={submit}
      />
    </View>
  );
}
