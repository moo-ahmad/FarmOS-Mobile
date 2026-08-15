import { EllipsisVertical } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import {
  AppHeader,
  Callout,
  Divider,
  MicroLabel,
  ProgressBar,
  Screen,
  SquareBadge,
  Text,
} from '@/components/ui';
import { cropCycles, moneyRatio } from '@/features/home';
import { moneyToString } from '@/lib/decimal';
import type { FieldDto } from '@/lib/fields';
import { colors } from '@/theme';

import { CropHistoryRow } from './crop-history-row';
import { DeactivateFieldDialog } from './deactivate-field-dialog';
import { FieldDetailGrid } from './field-detail-grid';
import { fieldApiErrorMessage } from '../errors';
import { fieldAreaLabel, fieldSoilLabel } from '../field-display';
import { cropHistoryByFieldCode } from '../fixtures';
import { useDeactivateField, useIrrigationSources } from '../hooks';

export interface FieldDetailScreenProps {
  field: FieldDto;
  onBack: () => void;
  onDeactivated: () => void;
}

/**
 * Field Detail (design handoff: FarmOS Land, "Field 3" frame): the active
 * cycle summary, an area/soil/irrigation/boundary grid, and the (fixture)
 * crop-rotation history. Wired to the real field via `GET /api/fields/{id}`
 * (fetched by the route) and the Deactivate action to
 * `POST /api/fields/{id}/deactivate`.
 */
export function FieldDetailScreen({
  field,
  onBack,
  onDeactivated,
}: FieldDetailScreenProps) {
  const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
  const irrigationSources = useIrrigationSources();
  const deactivateField = useDeactivateField(field.fieldId);

  const cycle = cropCycles.find((c) => c.fieldCode === field.code);
  const history = cropHistoryByFieldCode[field.code] ?? [];
  const fieldNumber = field.code.replace(/^F-?/, '');
  const soilLabel = fieldSoilLabel(field) ?? 'Not set';
  const irrigationLabel =
    field.primaryIrrigationSourceId === null
      ? 'None'
      : (irrigationSources.data?.find(
          (source) =>
            source.irrigationSourceId === field.primaryIrrigationSourceId,
        )?.name ?? (irrigationSources.isPending ? 'Loading…' : '—'));

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        compact
        kicker={`${fieldAreaLabel(field)} · ${soilLabel}`}
        title={`Field ${fieldNumber}`}
        onBack={onBack}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="More options"
            hitSlop={8}
            onPress={() => setConfirmingDeactivate(true)}
          >
            <EllipsisVertical size={20} color={colors.ink} />
          </Pressable>
        }
      />
      <ScrollView className="bg-neutral-0">
        {cycle ? (
          <>
            <View className="gap-2 px-4 py-3.5">
              <View className="flex-row items-center gap-3">
                <SquareBadge code={field.code} />
                <View className="flex-1">
                  <Text variant="row">{cycle.title}</Text>
                  <Text variant="caption" tone="muted">
                    {fieldAreaLabel(field)} · {cycle.sub.split(' · ').at(-1)}
                  </Text>
                </View>
                <View className="items-end">
                  <Text tone="accent" className="font-archivo-bold text-[17px]">
                    {cycle.daysToHarvest}d
                  </Text>
                  <MicroLabel>to harvest</MicroLabel>
                </View>
              </View>
              <View className="gap-1">
                <View className="flex-row justify-between">
                  <Text variant="caption" tone="muted">
                    Cost ${moneyToString(cycle.cost)}
                  </Text>
                  <Text variant="caption" tone="muted">
                    Budget ${moneyToString(cycle.budget)}
                  </Text>
                </View>
                <ProgressBar value={moneyRatio(cycle.cost, cycle.budget)} />
              </View>
            </View>
            <Divider />
          </>
        ) : null}

        <FieldDetailGrid
          areaLabel={fieldAreaLabel(field)}
          soilLabel={soilLabel}
          irrigationLabel={irrigationLabel}
          boundaryMapped={
            field.centroidLat !== null && field.centroidLng !== null
          }
        />
        <Divider />

        <View className="px-4 pb-1.5 pt-3.5">
          <MicroLabel>
            Crop history · {history.length}{' '}
            {history.length === 1 ? 'cycle' : 'cycles'}
          </MicroLabel>
        </View>
        <View className="px-4 pb-3">
          {history.map((entry, index) => (
            <CropHistoryRow
              key={entry.id}
              entry={entry}
              isLast={index === history.length - 1}
            />
          ))}
        </View>

        {deactivateField.isError ? (
          <Callout className="mx-4 mb-4">
            {fieldApiErrorMessage(deactivateField.error)}
          </Callout>
        ) : null}
      </ScrollView>

      <DeactivateFieldDialog
        visible={confirmingDeactivate}
        fieldTitle={`Field ${fieldNumber}`}
        loading={deactivateField.isPending}
        onCancel={() => setConfirmingDeactivate(false)}
        onConfirm={() => {
          deactivateField.mutate(undefined, {
            onSuccess: () => {
              setConfirmingDeactivate(false);
              onDeactivated();
            },
          });
        }}
      />
    </Screen>
  );
}
