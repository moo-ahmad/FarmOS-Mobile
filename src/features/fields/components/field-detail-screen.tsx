import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { EllipsisVertical } from 'lucide-react-native';
import { useRef, useState } from 'react';
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
import { ConfirmDialog } from '@/components/confirm-dialog';
import { FieldActionsSheet } from './field-actions-sheet';
import { FieldDetailGrid } from './field-detail-grid';
import { deleteFieldErrorMessage, fieldApiErrorMessage } from '../errors';
import { fieldAreaLabel, fieldSoilLabel } from '../field-display';
import { cropHistoryByFieldCode } from '../fixtures';
import {
  useDeactivateField,
  useDeleteField,
  useIrrigationSources,
} from '../hooks';

export interface FieldDetailScreenProps {
  field: FieldDto;
  onBack: () => void;
  onEdit: () => void;
  onDeactivated: () => void;
  onDeleted: () => void;
}

/**
 * Field Detail (design handoff: FarmOS Land, "Field 3" frame): the active
 * cycle summary, an area/soil/irrigation/boundary grid, and the (fixture)
 * crop-rotation history. Wired to the real field via `GET /api/fields/{id}`
 * (fetched by the route). The ⋮ menu offers Edit, Deactivate
 * (`POST /api/fields/{id}/deactivate`) and Delete (`DELETE /api/fields/{id}`,
 * refused by the backend once the field has history).
 */
export function FieldDetailScreen({
  field,
  onBack,
  onEdit,
  onDeactivated,
  onDeleted,
}: FieldDetailScreenProps) {
  const actionsRef = useRef<BottomSheetModal>(null);
  const [confirming, setConfirming] = useState<'deactivate' | 'delete' | null>(
    null,
  );
  const irrigationSources = useIrrigationSources();
  const deactivateField = useDeactivateField(field.fieldId);
  const deleteField = useDeleteField(field.fieldId);

  const closeConfirm = () => {
    setConfirming(null);
    deactivateField.reset();
    deleteField.reset();
  };

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
            accessibilityLabel="Field actions"
            hitSlop={8}
            onPress={() => actionsRef.current?.present()}
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

        {field.isActive ? null : (
          <Callout className="mx-4 mb-4">
            This field is deactivated — it&apos;s hidden from active lists.
          </Callout>
        )}
      </ScrollView>

      <FieldActionsSheet
        ref={actionsRef}
        fieldTitle={`Field ${fieldNumber}`}
        isActive={field.isActive}
        onEdit={onEdit}
        onDeactivate={() => setConfirming('deactivate')}
        onDelete={() => setConfirming('delete')}
      />

      <ConfirmDialog
        visible={confirming === 'deactivate'}
        title="Deactivate this field?"
        message={`Field ${fieldNumber} will be hidden from active lists. Its crop history stays intact.`}
        confirmLabel="Deactivate"
        loading={deactivateField.isPending}
        errorMessage={
          deactivateField.isError
            ? fieldApiErrorMessage(deactivateField.error)
            : undefined
        }
        onCancel={closeConfirm}
        onConfirm={() =>
          deactivateField.mutate(undefined, {
            onSuccess: () => {
              setConfirming(null);
              onDeactivated();
            },
          })
        }
      />

      <ConfirmDialog
        visible={confirming === 'delete'}
        title="Delete this field?"
        message={`Field ${fieldNumber} will be removed for good. This only works if it has no crop cycles, activities or harvests yet — otherwise deactivate it.`}
        confirmLabel="Delete"
        loading={deleteField.isPending}
        errorMessage={
          deleteField.isError
            ? deleteFieldErrorMessage(deleteField.error)
            : undefined
        }
        onCancel={closeConfirm}
        onConfirm={() =>
          deleteField.mutate(undefined, {
            onSuccess: () => {
              setConfirming(null);
              onDeleted();
            },
          })
        }
      />
    </Screen>
  );
}
