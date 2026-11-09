import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { TriangleAlert } from 'lucide-react-native';
import { forwardRef } from 'react';
import { View } from 'react-native';

import {
  Button,
  Kicker,
  MicroLabel,
  SquareBadge,
  Tag,
  Text,
} from '@/components/ui';
import { colors } from '@/theme';

import type { SeasonDetail } from '../model';
import { unclosedCycles, unclosedCyclesSummary } from '../season-math';

export interface CloseSeasonSheetProps {
  season: SeasonDetail;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation bottom sheet over the detail: closing is final, the season's
 * cycles are listed, and cycles that aren't Closed yet only warn — they never
 * block closing. Ref-driven like OptionPicker: `ref.current?.present()`.
 */
export const CloseSeasonSheet = forwardRef<
  BottomSheetModal,
  CloseSeasonSheetProps
>(function CloseSeasonSheet({ season, onConfirm, onCancel }, ref) {
  const open = unclosedCycles(season.cycles);

  return (
    <BottomSheetModal ref={ref} enableDynamicSizing>
      <BottomSheetView className="px-4 pb-8 pt-2">
        <Kicker>Close season</Kicker>
        <Text variant="heading" className="mb-2 mt-1">
          Close {season.name}?
        </Text>
        <Text variant="body">
          Closing marks this season&apos;s numbers as final. A closed season
          can&apos;t be edited and can&apos;t be reopened. Seasons are never
          deleted, because crop cycles refer to them.
        </Text>

        {season.cycles.length > 0 ? (
          <View className="mt-3.5">
            <MicroLabel>This season&apos;s crop cycles</MicroLabel>
            {season.cycles.map((cycle) => (
              <View
                key={cycle.id}
                className="flex-row items-center gap-2.5 border-b-hairline border-divider py-2"
              >
                <SquareBadge code={cycle.fieldCode} size={30} />
                <Text variant="row" className="flex-1 text-[13px]">
                  {cycle.title}
                </Text>
                <Tag label={cycle.status} />
              </View>
            ))}
          </View>
        ) : null}

        {open.length > 0 ? (
          <View className="mt-3 flex-row items-start gap-2 border-field border-ink bg-neutral-100 px-3 py-2.5">
            <TriangleAlert size={16} color={colors.ink} />
            <Text variant="caption" className="flex-1">
              <Text variant="caption" className="font-archivo-bold">
                {open.length} crop{' '}
                {open.length === 1 ? 'cycle isn' : 'cycles aren'}
                &apos;t Closed yet:
              </Text>{' '}
              {unclosedCyclesSummary(season.cycles)}. You can still close the
              season.
            </Text>
          </View>
        ) : null}

        <View className="mt-3 gap-2">
          <Button title="Close season" haptic="success" onPress={onConfirm} />
          <Button title="Cancel" variant="secondary" onPress={onCancel} />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
