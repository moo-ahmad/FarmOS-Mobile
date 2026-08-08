import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar } from 'lucide-react-native';
import { forwardRef, useImperativeHandle, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { View } from 'react-native';

import {
  MicroLabel,
  NumericField,
  SegmentedControl,
  Stepper,
  Text,
} from '@/components/ui';
import {
  addQuantity,
  subtractQuantity,
  toQuantity,
  quantityToString,
} from '@/lib/decimal';
import { formatInTimeZone, nowUtc } from '@/lib/datetime';
import { colors } from '@/theme';

import { GRADES, WEIGHT_STEP, WEIGHT_UNIT } from '../model';
import { computeNetWeight } from '../net-weight';
import { harvestFormSchema, type HarvestFormValues } from '../schema';

// Provisional until the farm's timezone comes from the API — same caveat as
// the activity-log screen.
const FARM_TIME_ZONE = 'Asia/Karachi';

export interface HarvestFormProps {
  onSubmit: (values: HarvestFormValues) => void;
  fieldCode: string;
  cropLabel: string;
}

export interface HarvestFormHandle {
  submit: () => void;
}

function formatWeight(value: string): string {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString() : value;
}

export const HarvestForm = forwardRef<HarvestFormHandle, HarvestFormProps>(
  function HarvestForm({ onSubmit, fieldCode, cropLabel }, ref) {
    const { control, handleSubmit } = useForm<HarvestFormValues>({
      resolver: zodResolver(harvestFormSchema),
      defaultValues: {
        fieldCode,
        cropLabel,
        grossWeight: '6240',
        fieldLossPercent: '5',
        grade: 'A',
        containers: '78',
        moisturePercent: '12.4',
      },
    });

    const grossWeight = useWatch({ control, name: 'grossWeight' });
    const fieldLossPercent = useWatch({ control, name: 'fieldLossPercent' });

    const netWeight = useMemo(() => {
      try {
        return quantityToString(
          computeNetWeight(toQuantity(grossWeight || '0'), fieldLossPercent),
        );
      } catch {
        return '0';
      }
    }, [grossWeight, fieldLossPercent]);

    useImperativeHandle(
      ref,
      () => ({ submit: () => void handleSubmit(onSubmit)() }),
      [handleSubmit, onSubmit],
    );

    return (
      <View className="px-4 py-4">
        <MicroLabel>Gross weight</MicroLabel>
        <Controller
          control={control}
          name="grossWeight"
          render={({ field }) => (
            <Stepper
              value={formatWeight(field.value)}
              unit={WEIGHT_UNIT}
              onDecrement={() =>
                field.onChange(
                  quantityToString(
                    subtractQuantity(
                      toQuantity(field.value || '0'),
                      toQuantity(WEIGHT_STEP),
                    ),
                  ),
                )
              }
              onIncrement={() =>
                field.onChange(
                  quantityToString(
                    addQuantity(
                      toQuantity(field.value || '0'),
                      toQuantity(WEIGHT_STEP),
                    ),
                  ),
                )
              }
            />
          )}
        />

        <View className="mt-4 flex-row gap-2.5">
          <Controller
            control={control}
            name="fieldLossPercent"
            render={({ field, fieldState }) => (
              <NumericField
                label="Field loss"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error ? 'Required' : undefined}
                containerClassName="flex-1"
                trailing={
                  <Text variant="caption" tone="muted">
                    %
                  </Text>
                }
              />
            )}
          />
          <View className="flex-[1.3] gap-1.5">
            <MicroLabel>Net weight</MicroLabel>
            <View className="min-h-tap flex-row items-baseline gap-1 border-field border-accent px-3">
              <Text className="font-archivo-bold text-label text-accent">
                {formatWeight(netWeight)}
              </Text>
              <Text variant="caption">{WEIGHT_UNIT}</Text>
            </View>
          </View>
        </View>

        <View className="mb-2 mt-[18px]">
          <MicroLabel>Grade</MicroLabel>
        </View>
        <Controller
          control={control}
          name="grade"
          render={({ field }) => (
            <SegmentedControl
              options={GRADES.map((g) => ({ value: g, label: g }))}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <View className="mt-4 flex-row gap-2.5">
          <Controller
            control={control}
            name="containers"
            render={({ field, fieldState }) => (
              <NumericField
                label="Containers"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error ? 'Required' : undefined}
                containerClassName="flex-1"
                trailing={
                  <Text variant="caption" tone="muted">
                    bags
                  </Text>
                }
              />
            )}
          />
          <Controller
            control={control}
            name="moisturePercent"
            render={({ field, fieldState }) => (
              <NumericField
                label="Moisture"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error ? 'Required' : undefined}
                containerClassName="flex-1"
                trailing={
                  <Text variant="caption" tone="muted">
                    %
                  </Text>
                }
              />
            )}
          />
        </View>

        <View className="mt-4 gap-1.5">
          <MicroLabel>Harvest date</MicroLabel>
          <View className="min-h-tap flex-row items-center gap-2 border-field border-divider bg-surface px-3">
            <Calendar size={17} color={colors.ink} strokeWidth={1.9} />
            <Text className="font-archivo-bold text-caption">
              Today · {formatInTimeZone(nowUtc(), FARM_TIME_ZONE, 'd MMM')}
            </Text>
          </View>
        </View>
      </View>
    );
  },
);
