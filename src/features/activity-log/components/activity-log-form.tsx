import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Droplet } from 'lucide-react-native';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, View } from 'react-native';

import {
  Callout,
  ChipRow,
  MicroLabel,
  NumericField,
  SquareBadge,
  Tag,
  Text,
  TextField,
} from '@/components/ui';
import type { CropCycle } from '@/features/home';
import { colors } from '@/theme';

import { currentConditions } from '../fixtures';
import {
  DOSE_UNIT,
  OPERATIONS,
  OPERATION_LABEL,
  requiresSprayDetails,
  WATER_UNIT,
  type Operation,
} from '../model';
import { computeSafeHarvestDate, lookupPhiDays } from '../phi';
import { activityLogFormSchema, type ActivityLogFormValues } from '../schema';
import { FieldCropPicker } from './field-crop-picker';

export interface ActivityLogFormProps {
  onSubmit: (values: ActivityLogFormValues) => void;
  /** Pre-fills the field/crop selector — the reminder deep-link path. */
  initialCycle?: CropCycle;
  /** Pre-selects the operation chip — also part of the deep-link path. */
  initialOperation?: Operation;
}

/** Imperative handle so the screen's fixed footer button can trigger submit. */
export interface ActivityLogFormHandle {
  submit: () => void;
}

export const ActivityLogForm = forwardRef<
  ActivityLogFormHandle,
  ActivityLogFormProps
>(function ActivityLogForm({ onSubmit, initialCycle, initialOperation }, ref) {
  const pickerRef = useRef<BottomSheetModal>(null);
  const { control, handleSubmit, setValue } = useForm<ActivityLogFormValues>({
    resolver: zodResolver(activityLogFormSchema),
    defaultValues: {
      operation: initialOperation ?? 'spray',
      fieldCode: initialCycle?.fieldCode ?? '',
      cropLabel: initialCycle?.title ?? '',
      product: '',
      doseValue: '',
      waterValue: '',
    },
  });

  const operation = useWatch({ control, name: 'operation' });
  const fieldCode = useWatch({ control, name: 'fieldCode' });
  const cropLabel = useWatch({ control, name: 'cropLabel' });
  const product = useWatch({ control, name: 'product' });
  const isSpray = requiresSprayDetails(operation);

  const phi = useMemo(() => {
    if (!isSpray || !product) return undefined;
    const days = lookupPhiDays(product);
    if (days === undefined) return undefined;
    return {
      days,
      safeHarvestDate: computeSafeHarvestDate(new Date().toISOString(), days),
    };
  }, [isSpray, product]);

  useImperativeHandle(
    ref,
    () => ({ submit: () => void handleSubmit(onSubmit)() }),
    [handleSubmit, onSubmit],
  );

  return (
    <View className="px-4 py-4">
      <MicroLabel>Operation</MicroLabel>
      <Controller
        control={control}
        name="operation"
        render={({ field }) => (
          <ChipRow
            className="mb-[18px] mt-2"
            options={OPERATIONS}
            value={field.value}
            onChange={field.onChange}
            labelFor={(op) => OPERATION_LABEL[op]}
          />
        )}
      />

      <MicroLabel>Field &amp; crop</MicroLabel>
      <Pressable
        accessibilityRole="button"
        onPress={() => pickerRef.current?.present()}
        className="mb-[18px] mt-2 min-h-tap flex-row items-center gap-2.5 border-field border-ink px-3.5 py-2.5"
      >
        {fieldCode ? <SquareBadge code={fieldCode} size={30} /> : null}
        <View className="flex-1">
          <Text variant="row">{cropLabel || 'Select field & crop'}</Text>
          {fieldCode ? (
            <Text variant="caption" tone="muted">
              Field {fieldCode.replace('F', '')}
            </Text>
          ) : null}
        </View>
        <ChevronRight size={18} color={colors.accent.DEFAULT} strokeWidth={2} />
      </Pressable>
      <FieldCropPicker
        ref={pickerRef}
        onSelect={(cycle) => {
          setValue('fieldCode', cycle.fieldCode, { shouldValidate: true });
          setValue('cropLabel', cycle.title, { shouldValidate: true });
          pickerRef.current?.dismiss();
        }}
      />

      {isSpray ? (
        <>
          <Controller
            control={control}
            name="product"
            render={({ field, fieldState }) => (
              <TextField
                label="Product"
                placeholder="e.g. Emamectin 1.9EC"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error ? 'Required' : undefined}
                containerClassName="mb-3"
              />
            )}
          />

          <View className="mb-[18px] flex-row gap-2.5">
            <Controller
              control={control}
              name="doseValue"
              render={({ field, fieldState }) => (
                <NumericField
                  label="Dose / acre"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error ? 'Required' : undefined}
                  containerClassName="flex-1"
                  className="text-[15px]"
                  trailing={
                    <Text variant="caption" tone="muted">
                      {DOSE_UNIT}
                    </Text>
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="waterValue"
              render={({ field, fieldState }) => (
                <NumericField
                  label="Water"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error ? 'Required' : undefined}
                  containerClassName="flex-1"
                  className="text-[15px]"
                  trailing={
                    <Text variant="caption" tone="muted">
                      {WATER_UNIT}
                    </Text>
                  }
                />
              )}
            />
          </View>

          <MicroLabel>Conditions at spray</MicroLabel>
          <View className="mb-[18px] mt-2 flex-row flex-wrap gap-2">
            <Tag variant="neutral" label={`${currentConditions.tempC}°C`} />
            <Tag
              variant="neutral"
              label={`Wind ${currentConditions.windKph} kph`}
            />
            <Tag variant="neutral" label="PPE ✓" />
          </View>

          {phi ? (
            <Callout
              icon={
                <Droplet
                  size={20}
                  color={colors.accent[700]}
                  strokeWidth={1.9}
                />
              }
            >
              Safe to harvest after{' '}
              <Text className="font-archivo-bold text-caption text-accent-800">
                {new Date(phi.safeHarvestDate).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'short',
                })}
              </Text>{' '}
              · PHI {phi.days} days
            </Callout>
          ) : null}
        </>
      ) : null}
    </View>
  );
});
