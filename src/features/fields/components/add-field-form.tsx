import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, MapPin } from 'lucide-react-native';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, View } from 'react-native';

import {
  MicroLabel,
  NumericField,
  SegmentedControl,
  SquareBadge,
  Tag,
  Text,
  TextField,
} from '@/components/ui';
import { colors } from '@/theme';

import {
  AREA_UNIT_LABEL,
  AREA_UNITS,
  IRRIGATION_SOURCE_LABEL,
  IRRIGATION_SOURCES,
  type IrrigationSource,
  SOIL_TYPE_LABEL,
  SOIL_TYPES,
  type SoilType,
} from '../model';
import { addFieldFormSchema, type AddFieldFormValues } from '../schema';
import { OptionPicker } from './option-picker';

export interface AddFieldFormProps {
  /** The next available field code (e.g. "F5"), pre-filled but editable. */
  nextCode: string;
  onSubmit: (values: AddFieldFormValues) => void;
}

export interface AddFieldFormHandle {
  submit: () => void;
}

/**
 * Add Field form (design handoff: FarmOS Land, "Add field" frame): field
 * code with a live badge preview, optional name, area + unit, soil type and
 * irrigation source pickers, and a not-yet-mapped boundary row. UI-first —
 * Save validates and returns to the screen it was opened from; persistence
 * isn't wired yet (same convention as ExpenseForm).
 */
export const AddFieldForm = forwardRef<AddFieldFormHandle, AddFieldFormProps>(
  function AddFieldForm({ nextCode, onSubmit }, ref) {
    const soilPickerRef = useRef<BottomSheetModal>(null);
    const irrigationPickerRef = useRef<BottomSheetModal>(null);

    const { control, handleSubmit } = useForm<AddFieldFormValues>({
      resolver: zodResolver(addFieldFormSchema),
      defaultValues: {
        code: nextCode,
        name: '',
        area: '',
        unit: 'ha',
        soilType: 'sandy-loam',
        irrigationSource: 'tubewell',
      },
    });

    useImperativeHandle(
      ref,
      () => ({ submit: () => void handleSubmit(onSubmit)() }),
      [handleSubmit, onSubmit],
    );

    return (
      <View className="px-4 py-4">
        <MicroLabel>Field code</MicroLabel>
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <>
              <View className="mt-2 flex-row items-center gap-3">
                <TextField
                  value={field.value}
                  onChangeText={(text) => field.onChange(text.toUpperCase())}
                  autoCapitalize="characters"
                  maxLength={4}
                  containerClassName="w-24"
                  fieldClassName="border-ink"
                  className="font-archivo-bold text-label"
                />
                <SquareBadge code={field.value || '—'} size={34} />
                <Text variant="caption" tone="muted">
                  Badge preview
                </Text>
              </View>
              <Text variant="caption" tone="muted" className="mt-1.5">
                Used as the short badge label throughout the app — e.g. F1, F2.
              </Text>
            </>
          )}
        />

        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField
              label="Field name · optional"
              placeholder="e.g. North plot"
              value={field.value}
              onChangeText={field.onChange}
              containerClassName="mt-4"
            />
          )}
        />

        <View className="mt-4 flex-row items-end gap-2.5">
          <Controller
            control={control}
            name="area"
            render={({ field, fieldState }) => (
              <NumericField
                label="Area"
                placeholder="0"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error ? 'Enter a valid area' : undefined}
                containerClassName="flex-[1.3]"
                fieldClassName="border-ink"
                className="font-archivo-bold text-heading"
              />
            )}
          />
          <Controller
            control={control}
            name="unit"
            render={({ field }) => (
              <View className="flex-1">
                <Text variant="micro" tone="muted" className="mb-1.5">
                  Unit
                </Text>
                <SegmentedControl
                  compact
                  options={AREA_UNITS.map((unit) => ({
                    value: unit,
                    label: AREA_UNIT_LABEL[unit],
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                />
              </View>
            )}
          />
        </View>

        <View className="mt-[18px]">
          <MicroLabel>Soil type</MicroLabel>
          <Controller
            control={control}
            name="soilType"
            render={({ field }) => (
              <>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => soilPickerRef.current?.present()}
                  className="mt-2 min-h-tap flex-row items-center justify-between border-field border-ink px-3"
                >
                  <Text className="font-archivo-bold text-label">
                    {SOIL_TYPE_LABEL[field.value]}
                  </Text>
                  <ChevronDown size={18} color={colors.accent.DEFAULT} />
                </Pressable>
                <OptionPicker
                  ref={soilPickerRef}
                  title="Soil type"
                  value={field.value}
                  options={SOIL_TYPES.map((soil) => ({
                    value: soil,
                    label: SOIL_TYPE_LABEL[soil],
                  }))}
                  onSelect={(value) => {
                    field.onChange(value as SoilType);
                    soilPickerRef.current?.dismiss();
                  }}
                />
              </>
            )}
          />
        </View>

        <View className="mt-4">
          <MicroLabel>Irrigation source</MicroLabel>
          <Controller
            control={control}
            name="irrigationSource"
            render={({ field }) => (
              <>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => irrigationPickerRef.current?.present()}
                  className="mt-2 min-h-tap flex-row items-center justify-between border-field border-ink px-3"
                >
                  <Text className="font-archivo-bold text-label">
                    {IRRIGATION_SOURCE_LABEL[field.value]}
                  </Text>
                  <ChevronDown size={18} color={colors.accent.DEFAULT} />
                </Pressable>
                <OptionPicker
                  ref={irrigationPickerRef}
                  title="Irrigation source"
                  value={field.value}
                  options={IRRIGATION_SOURCES.map((source) => ({
                    value: source,
                    label: IRRIGATION_SOURCE_LABEL[source],
                  }))}
                  onSelect={(value) => {
                    field.onChange(value as IrrigationSource);
                    irrigationPickerRef.current?.dismiss();
                  }}
                />
              </>
            )}
          />
        </View>

        <View className="mt-[18px]">
          <MicroLabel>Boundary</MicroLabel>
          <View className="mt-2 min-h-tap flex-row items-center gap-2.5 border-field border-divider bg-surface px-3">
            <Tag label="Not mapped" variant="neutral" />
            <View className="flex-1" />
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                Alert.alert(
                  'Map boundary',
                  'Mapping a field boundary is coming soon.',
                )
              }
              className="flex-row items-center gap-1.5 py-2.5"
            >
              <MapPin size={15} color={colors.accent[700]} />
              <Text tone="accent" className="font-archivo-bold text-label">
                Map boundary
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  },
);
