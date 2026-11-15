import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Check } from 'lucide-react-native';
import { forwardRef } from 'react';
import { Pressable, View } from 'react-native';

import { MicroLabel, Text } from '@/components/ui';
import { colors } from '@/theme';

export interface PickerOption {
  value: string;
  label: string;
  sub?: string;
}

export interface PickerSheetProps {
  title: string;
  options: readonly PickerOption[];
  value: string | null;
  onSelect: (value: string) => void;
  emptyMessage?: string;
}

/** Bottom sheet of single-select rows with an optional sub-line. Ref-driven. */
export const PickerSheet = forwardRef<BottomSheetModal, PickerSheetProps>(
  function PickerSheet(
    { title, options, value, onSelect, emptyMessage = 'Nothing to pick yet.' },
    ref,
  ) {
    return (
      <BottomSheetModal ref={ref} enableDynamicSizing>
        <BottomSheetView className="px-4 pb-8 pt-2">
          <MicroLabel>{title}</MicroLabel>
          <View className="mt-2">
            {options.length === 0 ? (
              <Text variant="caption" tone="muted" className="py-3">
                {emptyMessage}
              </Text>
            ) : null}
            {options.map((option) => (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: option.value === value }}
                onPress={() => onSelect(option.value)}
                className="min-h-tap flex-row items-center gap-3 border-b-hairline border-divider py-3"
              >
                <View className="flex-1">
                  <Text variant="row">{option.label}</Text>
                  {option.sub ? (
                    <Text variant="caption" tone="muted">
                      {option.sub}
                    </Text>
                  ) : null}
                </View>
                {option.value === value ? (
                  <Check size={18} color={colors.accent.DEFAULT} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
