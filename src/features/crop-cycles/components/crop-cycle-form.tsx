import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { View } from 'react-native';

import { DetailList } from '@/components/detail-list';
import {
  MicroLabel,
  NumericField,
  SelectorRow,
  SquareBadge,
  Text,
  TextField,
} from '@/components/ui';
import { useFields } from '@/features/fields';
import { useSeasons } from '@/features/season-form';

import { areaUnitLabel } from '../display';
import { useCropVarieties, useCrops, useCycleNames } from '../hooks';
import { cropCycleFormSchema, type CropCycleFormValues } from '../schema';
import { PickerSheet } from './picker-sheet';

export interface CropCycleFormProps {
  /** Starting values; read once, on mount. */
  initialValues: CropCycleFormValues;
  /**
   * Set when editing: field, season and crop are fixed once a cycle exists
   * (its code is built from them), so they show read-only and the area keeps
   * the cycle's own unit.
   */
  editing?: { areaUomId: number };
  onSubmit: (values: CropCycleFormValues) => void;
}

export interface CropCycleFormHandle {
  submit: () => void;
}

const NO_VARIETY = 'none';

/**
 * New/Edit crop cycle fields, wired to `POST`/`PUT /api/crop-cycles`. Fields
 * are the farm's active ones, seasons only the open ones, crops and
 * varieties the seeded catalogue. Picking a field pre-fills the sown area
 * with the whole field, in the field's own unit.
 */
export const CropCycleForm = forwardRef<
  CropCycleFormHandle,
  CropCycleFormProps
>(function CropCycleForm({ initialValues, editing, onSubmit }, ref) {
  const fieldSheet = useRef<BottomSheetModal>(null);
  const seasonSheet = useRef<BottomSheetModal>(null);
  const cropSheet = useRef<BottomSheetModal>(null);
  const varietySheet = useRef<BottomSheetModal>(null);

  const { control, handleSubmit, setValue, getValues } =
    useForm<CropCycleFormValues>({
      resolver: zodResolver(cropCycleFormSchema),
      defaultValues: initialValues,
    });
  const [fieldId, seasonId, cropId, varietyId] = useWatch({
    control,
    name: ['fieldId', 'seasonId', 'cropId', 'varietyId'],
  });

  const fieldsQuery = useFields();
  const seasonsQuery = useSeasons();
  const cropsQuery = useCrops();
  const varietiesQuery = useCropVarieties(cropId);
  const names = useCycleNames();

  const fields = useMemo(
    () => (fieldsQuery.data?.fields ?? []).filter((f) => f.isActive),
    [fieldsQuery.data],
  );
  const openSeasons = useMemo(
    () => (seasonsQuery.data ?? []).filter((s) => !s.isClosed),
    [seasonsQuery.data],
  );
  const crops = cropsQuery.data ?? [];
  const varieties = varietiesQuery.data ?? [];

  const field = fields.find((f) => f.fieldId === fieldId);
  const season = openSeasons.find((s) => s.seasonId === seasonId);
  const crop = crops.find((c) => c.cropId === cropId);
  const variety = varieties.find((v) => v.varietyId === varietyId);
  const areaUomId = editing?.areaUomId ?? field?.areaUomId;

  useImperativeHandle(
    ref,
    () => ({ submit: () => void handleSubmit(onSubmit)() }),
    [handleSubmit, onSubmit],
  );

  return (
    <View className="gap-3.5 px-4 py-4">
      {editing ? (
        <View className="-mx-4">
          <DetailList
            items={[
              {
                label: 'Field',
                value: names.field(initialValues.fieldId ?? -1) ?? null,
              },
              {
                label: 'Season',
                value: names.season(initialValues.seasonId ?? -1) ?? null,
              },
              {
                label: 'Crop',
                value: names.crop(initialValues.cropId ?? -1) ?? null,
              },
            ]}
          />
        </View>
      ) : (
        <>
          <Controller
            control={control}
            name="fieldId"
            render={({ fieldState }) => (
              <View className="gap-1.5">
                <MicroLabel>Field</MicroLabel>
                <SelectorRow
                  title={field ? field.name : 'Select a field'}
                  sub={field ? `${field.areaAcres} ac` : undefined}
                  badge={
                    field ? <SquareBadge code={field.code} size={30} /> : null
                  }
                  onPress={() => fieldSheet.current?.present()}
                />
                {fieldState.error ? (
                  <Text variant="caption" tone="accent">
                    {fieldState.error.message}
                  </Text>
                ) : null}
              </View>
            )}
          />
          <Controller
            control={control}
            name="seasonId"
            render={({ fieldState }) => (
              <View className="gap-1.5">
                <MicroLabel>Season</MicroLabel>
                <SelectorRow
                  title={season ? season.name : 'Select a season'}
                  sub={
                    season
                      ? `${season.startDate} → ${season.endDate}`
                      : 'Only open seasons are listed'
                  }
                  onPress={() => seasonSheet.current?.present()}
                />
                {fieldState.error ? (
                  <Text variant="caption" tone="accent">
                    {fieldState.error.message}
                  </Text>
                ) : null}
              </View>
            )}
          />
          <Controller
            control={control}
            name="cropId"
            render={({ fieldState }) => (
              <View className="gap-1.5">
                <MicroLabel>Crop</MicroLabel>
                <SelectorRow
                  title={crop ? crop.name : 'Select a crop'}
                  onPress={() => cropSheet.current?.present()}
                />
                {fieldState.error ? (
                  <Text variant="caption" tone="accent">
                    {fieldState.error.message}
                  </Text>
                ) : null}
              </View>
            )}
          />
        </>
      )}

      {cropId !== null ? (
        <View className="gap-1.5">
          <MicroLabel>Variety (optional)</MicroLabel>
          <SelectorRow
            title={variety ? variety.name : 'No variety'}
            sub={
              variety?.maturityDays
                ? `Matures in ~${variety.maturityDays} days`
                : undefined
            }
            onPress={() => varietySheet.current?.present()}
          />
        </View>
      ) : null}

      <Controller
        control={control}
        name="areaSownValue"
        render={({ field: input, fieldState }) => (
          <NumericField
            label={
              areaUomId === undefined
                ? 'Area sown'
                : `Area sown (${areaUnitLabel(areaUomId)})`
            }
            placeholder="e.g. 2.5"
            value={input.value}
            onChangeText={input.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <View className="flex-row gap-2.5">
        <Controller
          control={control}
          name="plannedSowDate"
          render={({ field: input, fieldState }) => (
            <TextField
              label="Planned sowing"
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
              value={input.value}
              onChangeText={input.onChange}
              error={fieldState.error?.message}
              containerClassName="flex-1"
            />
          )}
        />
        <Controller
          control={control}
          name="plannedHarvestDate"
          render={({ field: input, fieldState }) => (
            <TextField
              label="Planned harvest"
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
              value={input.value}
              onChangeText={input.onChange}
              error={fieldState.error?.message}
              containerClassName="flex-1"
            />
          )}
        />
      </View>

      <Controller
        control={control}
        name="notes"
        render={({ field: input, fieldState }) => (
          <TextField
            label="Notes (optional)"
            placeholder="e.g. Late sowing after cotton"
            value={input.value}
            onChangeText={input.onChange}
            error={fieldState.error?.message}
            multiline
          />
        )}
      />

      {editing ? null : (
        <Text variant="caption" tone="muted">
          The cycle code (e.g. F3-WHEAT-R2627) is made from the field, crop and
          season when you save. Seed details come from the Sowing activity.
        </Text>
      )}

      <PickerSheet
        ref={fieldSheet}
        title="Field"
        value={fieldId === null ? null : String(fieldId)}
        emptyMessage="No active fields yet. Add a field first."
        options={fields.map((f) => ({
          value: String(f.fieldId),
          label: f.name,
          sub: `${f.code} · ${String(f.areaValue)} ${areaUnitLabel(f.areaUomId)}`,
        }))}
        onSelect={(value) => {
          const picked = fields.find((f) => String(f.fieldId) === value);
          setValue('fieldId', Number(value), { shouldValidate: true });
          // Sow the whole field unless the farmer already typed an area.
          if (picked && getValues('areaSownValue').trim() === '') {
            setValue('areaSownValue', String(picked.areaValue));
          }
          fieldSheet.current?.dismiss();
        }}
      />
      <PickerSheet
        ref={seasonSheet}
        title="Season"
        value={seasonId === null ? null : String(seasonId)}
        emptyMessage="No open seasons. Add a season first."
        options={openSeasons.map((s) => ({
          value: String(s.seasonId),
          label: s.name,
          sub: `${s.startDate} → ${s.endDate}`,
        }))}
        onSelect={(value) => {
          setValue('seasonId', Number(value), { shouldValidate: true });
          seasonSheet.current?.dismiss();
        }}
      />
      <PickerSheet
        ref={cropSheet}
        title="Crop"
        value={cropId === null ? null : String(cropId)}
        emptyMessage={
          cropsQuery.isError ? "Couldn't load crops." : 'Loading crops…'
        }
        options={crops.map((c) => ({
          value: String(c.cropId),
          label: c.name,
          sub: c.isPerennial ? 'Perennial' : undefined,
        }))}
        onSelect={(value) => {
          if (Number(value) !== cropId) {
            setValue('varietyId', null);
          }
          setValue('cropId', Number(value), { shouldValidate: true });
          cropSheet.current?.dismiss();
        }}
      />
      <PickerSheet
        ref={varietySheet}
        title="Variety"
        value={varietyId === null ? NO_VARIETY : String(varietyId)}
        options={[
          { value: NO_VARIETY, label: 'No variety' },
          ...varieties.map((v) => ({
            value: String(v.varietyId),
            label: v.name,
            sub: v.maturityDays
              ? `Matures in ~${v.maturityDays} days`
              : undefined,
          })),
        ]}
        onSelect={(value) => {
          setValue('varietyId', value === NO_VARIETY ? null : Number(value));
          varietySheet.current?.dismiss();
        }}
      />
    </View>
  );
});
