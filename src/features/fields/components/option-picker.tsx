import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Check } from 'lucide-react-native';
import { forwardRef } from 'react';
import { Pressable, View } from 'react-native';

import { MicroLabel, Text } from '@/components/ui';
import { colors } from '@/theme';

export interface OptionPickerOption {
  value: string;
  label: string;
}

export interface OptionPickerProps {
  title: string;
  options: readonly OptionPickerOption[];
  value: string;
  onSelect: (value: string) => void;
}

/**
 * Bottom sheet listing a fixed set of string options (soil type, irrigation
 * source, …) with a check mark on the selected row. Ref-driven: call
 * `ref.current?.present()` to open — see CyclePicker for the same pattern.
 */
export const OptionPicker = forwardRef<BottomSheetModal, OptionPickerProps>(
  function OptionPicker({ title, options, value, onSelect }, ref) {
    return (
      <BottomSheetModal ref={ref} enableDynamicSizing>
        <BottomSheetView className="px-4 pb-8 pt-2">
          <MicroLabel>{title}</MicroLabel>
          <View className="mt-2">
            {options.map((option) => {
              const selected = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => onSelect(option.value)}
                  className="min-h-tap flex-row items-center justify-between border-b-hairline border-divider py-3"
                >
                  <Text variant="row">{option.label}</Text>
                  {selected ? (
                    <Check size={18} color={colors.accent.DEFAULT} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
