import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { Pressable, View } from 'react-native';

import { cropCycles, type CropCycle } from '@/features/home';

import { MicroLabel, SquareBadge, Text } from './ui';

export interface CyclePickerProps {
  onSelect: (cycle: CropCycle) => void;
}

/**
 * Bottom sheet listing the active crop cycles (from src/features/home, the
 * single source of truth for that sample data) — the shared "Field & crop"
 * picker used by Log Activity and Log Expense's "Allocate to" row. Ref-driven:
 * call `ref.current?.present()` to open.
 */
export const CyclePicker = forwardRef<BottomSheetModal, CyclePickerProps>(
  function CyclePicker({ onSelect }, ref) {
    return (
      <BottomSheetModal ref={ref} enableDynamicSizing>
        <BottomSheetView className="px-4 pb-8 pt-2">
          <MicroLabel>Field &amp; crop</MicroLabel>
          <View className="mt-2">
            {cropCycles.map((cycle) => (
              <Pressable
                key={cycle.id}
                accessibilityRole="button"
                onPress={() => onSelect(cycle)}
                className="min-h-tap flex-row items-center gap-3 border-b-hairline border-divider py-3"
              >
                <SquareBadge code={cycle.fieldCode} size={30} />
                <View className="flex-1">
                  <Text variant="row">{cycle.title}</Text>
                  <Text variant="caption" tone="muted">
                    {cycle.sub}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
