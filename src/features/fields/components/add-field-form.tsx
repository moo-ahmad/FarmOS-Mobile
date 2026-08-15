import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, MapPin } from 'lucide-react-native';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';

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

import { useIrrigationSources } from '../hooks';
import {
  AREA_UOMS,
  FIELD_USAGE_TYPE_LABEL,
  FIELD_USAGE_TYPES,
  FieldUsageType,
  SOIL_TEXTURES,
} from '../model';
import { addFieldFormSchema, type AddFieldFormValues } from '../schema';
import { OptionPicker } from './option-picker';

export interface AddFieldFormProps {
  /** The next available field code (e.g. "F-002"), pre-filled but editable. */
  nextCode: string;
  onSubmit: (values: AddFieldFormValues) => void;
}

export interface AddFieldFormHandle {
  submit: () => void;
}

const NONE_IRRIGATION_SOURCE = -1;

/**
 * Add Field form (design handoff: FarmOS Land, "Add field" frame), wired to
 * the real `POST /api/fields` contract. Two things the handoff doesn't show
 * were added because the backend requires them: a "Field type" picker
 * (`usageType` — `IsInEnum`, no default) and a required Field name (the
 * backend rejects an empty one; the handoff's "optional" label no longer
 * applies). Irrigation source is now the farm's own created sources
 * (`GET /api/irrigation-sources`), not a fixed list.
 */
export const AddFieldForm = forwardRef<AddFieldFormHandle, AddFieldFormProps>(
  function AddFieldForm({ nextCode, onSubmit }, ref) {
    const soilPickerRef = useRef<BottomSheetModal>(null);
    const irrigationPickerRef = useRef<BottomSheetModal>(null);
    const usagePickerRef = useRef<BottomSheetModal>(null);

    const irrigationSources = useIrrigationSources();

    const { control, handleSubmit } = useForm<AddFieldFormValues>({
      resolver: zodResolver(addFieldFormSchema),
      defaultValues: {
        code: nextCode,
        name: '',
        area: '',
        areaUomId: AREA_UOMS[0]!.id,
        usageType: FieldUsageType.RowCrop,
        soilTextureId: SOIL_TEXTURES[0]!.id,
        primaryIrrigationSourceId: null,
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
                  maxLength={20}
                  containerClassName="w-28"
                  fieldClassName="border-ink"
                  className="font-archivo-bold text-label"
                />
                <SquareBadge code={field.value || '—'} size={34} />
                <Text variant="caption" tone="muted">
                  Badge preview
                </Text>
              </View>
              <Text variant="caption" tone="muted" className="mt-1.5">
                Used as the short badge label throughout the app — e.g. F-001,
                F-002.
              </Text>
            </>
          )}
        />

        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextField
              label="Field name"
              placeholder="e.g. North Block"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error ? 'Enter a field name' : undefined}
              containerClassName="mt-4"
            />
          )}
        />

        <View className="mt-[18px]">
          <MicroLabel>Field type</MicroLabel>
          <Controller
            control={control}
            name="usageType"
            render={({ field }) => (
              <>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => usagePickerRef.current?.present()}
                  className="mt-2 min-h-tap flex-row items-center justify-between border-field border-ink px-3"
                >
                  <Text className="font-archivo-bold text-label">
                    {FIELD_USAGE_TYPE_LABEL[field.value as FieldUsageType]}
                  </Text>
                  <ChevronDown size={18} color={colors.accent.DEFAULT} />
                </Pressable>
                <OptionPicker
                  ref={usagePickerRef}
                  title="Field type"
                  value={field.value}
                  options={FIELD_USAGE_TYPES.map((type) => ({
                    value: type,
                    label: FIELD_USAGE_TYPE_LABEL[type],
                  }))}
                  onSelect={(value) => {
                    field.onChange(value);
                    usagePickerRef.current?.dismiss();
                  }}
                />
              </>
            )}
          />
        </View>

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
            name="areaUomId"
            render={({ field }) => (
              <View className="flex-1">
                <Text variant="micro" tone="muted" className="mb-1.5">
                  Unit
                </Text>
                <SegmentedControl
                  compact
                  options={AREA_UOMS.map((uom) => ({
                    value: uom.id,
                    label: uom.code,
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
            name="soilTextureId"
            render={({ field }) => (
              <>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => soilPickerRef.current?.present()}
                  className="mt-2 min-h-tap flex-row items-center justify-between border-field border-ink px-3"
                >
                  <Text className="font-archivo-bold text-label">
                    {SOIL_TEXTURES.find((t) => t.id === field.value)?.label ??
                      'Select'}
                  </Text>
                  <ChevronDown size={18} color={colors.accent.DEFAULT} />
                </Pressable>
                <OptionPicker
                  ref={soilPickerRef}
                  title="Soil type"
                  value={field.value ?? SOIL_TEXTURES[0]!.id}
                  options={SOIL_TEXTURES.map((texture) => ({
                    value: texture.id,
                    label: texture.label,
                  }))}
                  onSelect={(value) => {
                    field.onChange(value);
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
            name="primaryIrrigationSourceId"
            render={({ field }) => {
              const selectedSource = irrigationSources.data?.find(
                (source) => source.irrigationSourceId === field.value,
              );
              const label = irrigationSources.isPending
                ? 'Loading…'
                : (selectedSource?.name ?? 'None');

              return (
                <>
                  <Pressable
                    accessibilityRole="button"
                    disabled={irrigationSources.isPending}
                    onPress={() => irrigationPickerRef.current?.present()}
                    className="mt-2 min-h-tap flex-row items-center justify-between border-field border-ink px-3"
                  >
                    <Text className="font-archivo-bold text-label">
                      {label}
                    </Text>
                    {irrigationSources.isPending ? (
                      <ActivityIndicator size="small" color={colors.ink} />
                    ) : (
                      <ChevronDown size={18} color={colors.accent.DEFAULT} />
                    )}
                  </Pressable>
                  {irrigationSources.data &&
                  irrigationSources.data.length === 0 ? (
                    <Text variant="caption" tone="muted" className="mt-1.5">
                      No irrigation sources on this farm yet.
                    </Text>
                  ) : null}
                  <OptionPicker
                    ref={irrigationPickerRef}
                    title="Irrigation source"
                    value={field.value ?? NONE_IRRIGATION_SOURCE}
                    options={[
                      { value: NONE_IRRIGATION_SOURCE, label: 'None' },
                      ...(irrigationSources.data ?? []).map((source) => ({
                        value: source.irrigationSourceId,
                        label: source.name,
                      })),
                    ]}
                    onSelect={(value) => {
                      field.onChange(
                        value === NONE_IRRIGATION_SOURCE ? null : value,
                      );
                      irrigationPickerRef.current?.dismiss();
                    }}
                  />
                </>
              );
            }}
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
