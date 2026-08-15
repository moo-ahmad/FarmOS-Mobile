import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Check } from 'lucide-react-native';
import { forwardRef, type ForwardedRef, type ReactElement } from 'react';
import { Pressable, View } from 'react-native';

import { MicroLabel, Text } from '@/components/ui';
import { colors } from '@/theme';

export interface OptionPickerOption<T> {
  value: T;
  label: string;
}

export interface OptionPickerProps<T> {
  title: string;
  options: readonly OptionPickerOption<T>[];
  value: T;
  onSelect: (value: T) => void;
}

type OptionPickerComponent = <T extends string | number>(
  props: OptionPickerProps<T> & { ref?: ForwardedRef<BottomSheetModal> },
) => ReactElement | null;

/**
 * Bottom sheet listing a fixed set of options (soil type, irrigation
 * source, field type, …) with a check mark on the selected row. Ref-driven:
 * call `ref.current?.present()` to open — see CyclePicker for the same
 * pattern. `T` is typically `string` or `number` (a lookup id).
 */
export const OptionPicker = forwardRef(function OptionPicker<
  T extends string | number,
>(
  { title, options, value, onSelect }: OptionPickerProps<T>,
  ref: ForwardedRef<BottomSheetModal>,
) {
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
}) as OptionPickerComponent;
