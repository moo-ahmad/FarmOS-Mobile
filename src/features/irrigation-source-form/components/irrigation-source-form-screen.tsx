import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import {
  Button,
  Callout,
  CaptureFooter,
  CaptureHeader,
  ChipRow,
  MicroLabel,
  NumericField,
  Screen,
  Text,
  TextField,
} from '@/components/ui';

import {
  irrigationSourceApiErrorMessage,
  useCreateIrrigationSource,
} from '../hooks';
import {
  COST_KIND_LABEL,
  COST_KINDS,
  DEFAULT_COST_KIND,
  RATE_LABEL,
  SOURCE_KINDS,
} from '../model';
import {
  irrigationSourceFormSchema,
  type IrrigationSourceFormValues,
} from '../schema';

export interface IrrigationSourceFormScreenProps {
  onClose: () => void;
  onSaved: () => void;
}

/**
 * New irrigation source: a capture-style modal (same shell as Add Field),
 * wired to `POST /api/irrigation-sources`. Picking a source type pre-selects
 * a typical cost model (tubewell → per hour, canal → per turn, rain → free);
 * the rate is hidden for a free source. No pump picker yet — there's no
 * assets screen to choose one from, so `pumpAssetId` is always null.
 */
export function IrrigationSourceFormScreen({
  onClose,
  onSaved,
}: IrrigationSourceFormScreenProps) {
  const createSource = useCreateIrrigationSource();

  const { control, handleSubmit, setValue } =
    useForm<IrrigationSourceFormValues>({
      resolver: zodResolver(irrigationSourceFormSchema),
      defaultValues: {
        name: '',
        sourceKind: 'Tubewell',
        costKind: DEFAULT_COST_KIND.Tubewell,
        ratePerUnit: '',
        dischargeLpm: '',
      },
    });

  const costKind = useWatch({ control, name: 'costKind' });

  const submit = handleSubmit((values) =>
    createSource.mutate(values, { onSuccess: onSaved }),
  );

  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader
        kicker="New entry"
        title="Irrigation source"
        onClose={onClose}
      />
      <ScrollView className="bg-neutral-0" keyboardShouldPersistTaps="handled">
        <View className="gap-4 p-4">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <TextField
                label="Name"
                placeholder="e.g. Main tubewell"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <View className="gap-1.5">
            <MicroLabel>Source type</MicroLabel>
            <Controller
              control={control}
              name="sourceKind"
              render={({ field }) => (
                <ChipRow
                  options={SOURCE_KINDS}
                  value={field.value}
                  onChange={(next) => {
                    field.onChange(next);
                    setValue('costKind', DEFAULT_COST_KIND[next]);
                  }}
                />
              )}
            />
          </View>

          <View className="gap-1.5">
            <MicroLabel>How is it charged?</MicroLabel>
            <Controller
              control={control}
              name="costKind"
              render={({ field }) => (
                <ChipRow
                  options={COST_KINDS}
                  value={field.value}
                  onChange={field.onChange}
                  labelFor={(kind) => COST_KIND_LABEL[kind]}
                />
              )}
            />
          </View>

          {costKind === 'Free' ? null : (
            <Controller
              control={control}
              name="ratePerUnit"
              render={({ field, fieldState }) => (
                <NumericField
                  label={RATE_LABEL[costKind]}
                  placeholder="0"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          )}

          <View className="gap-1.5">
            <Controller
              control={control}
              name="dischargeLpm"
              render={({ field, fieldState }) => (
                <NumericField
                  label="Flow, litres per minute (optional)"
                  placeholder="e.g. 900"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Text variant="caption" tone="muted">
              Used to estimate water applied per hour of irrigation.
            </Text>
          </View>

          {createSource.isError ? (
            <Callout>
              {irrigationSourceApiErrorMessage(createSource.error)}
            </Callout>
          ) : null}
        </View>
      </ScrollView>
      <CaptureFooter>
        <Button
          title="Save source"
          haptic="success"
          loading={createSource.isPending}
          onPress={() => void submit()}
        />
      </CaptureFooter>
    </Screen>
  );
}
