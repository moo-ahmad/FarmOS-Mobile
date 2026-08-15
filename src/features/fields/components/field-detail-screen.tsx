import { EllipsisVertical } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import {
  AppHeader,
  Divider,
  MicroLabel,
  ProgressBar,
  Screen,
  SquareBadge,
  Text,
} from '@/components/ui';
import { cropCycles, moneyRatio } from '@/features/home';
import { moneyToString } from '@/lib/decimal';
import { colors } from '@/theme';

import { CropHistoryRow } from './crop-history-row';
import { DeactivateFieldDialog } from './deactivate-field-dialog';
import { FieldDetailGrid } from './field-detail-grid';
import { cropHistoryByFieldCode, type Field } from '../fixtures';
import { IRRIGATION_SOURCE_LABEL, SOIL_TYPE_LABEL } from '../model';

export interface FieldDetailScreenProps {
  field: Field;
  onBack: () => void;
  /** Fired once the user confirms Deactivate — UI-first, no persistence yet. */
  onDeactivated: () => void;
}

/**
 * Field Detail (design handoff: FarmOS Land, "Field 3" frame): the active
 * cycle summary, an area/soil/irrigation/boundary grid, and the full
 * crop-rotation history. See ../fixtures for the note on the handoff's
 * header/grid copy-paste slip that this screen deliberately doesn't repeat.
 */
export function FieldDetailScreen({
  field,
  onBack,
  onDeactivated,
}: FieldDetailScreenProps) {
  const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
  const cycle = useMemo(
    () => cropCycles.find((c) => c.fieldCode === field.code),
    [field.code],
  );
  const history = cropHistoryByFieldCode[field.code] ?? [];
  const fieldNumber = field.code.replace(/^F/, '');

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        compact
        kicker={`${field.areaHa} ha · ${SOIL_TYPE_LABEL[field.soilType]}`}
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
                    {field.areaHa} ha · {cycle.sub.split(' · ').at(-1)}
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
          areaLabel={`${field.areaHa} ha`}
          soilLabel={SOIL_TYPE_LABEL[field.soilType]}
          irrigationLabel={IRRIGATION_SOURCE_LABEL[field.irrigationSource]}
          boundaryMapped={field.boundaryMapped}
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
      </ScrollView>

      <DeactivateFieldDialog
        visible={confirmingDeactivate}
        fieldTitle={`Field ${fieldNumber}`}
        onCancel={() => setConfirmingDeactivate(false)}
        onConfirm={() => {
          setConfirmingDeactivate(false);
          onDeactivated();
        }}
      />
    </Screen>
  );
}
