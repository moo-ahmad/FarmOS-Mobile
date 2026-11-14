import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ChevronDown } from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable, View } from 'react-native';

import { MicroLabel, Text } from '@/components/ui';
import { cn } from '@/lib/cn';
import { colors } from '@/theme';

import { OptionPicker, type OptionPickerOption } from './option-picker';

export interface SelectFieldProps<T extends string | number> {
  label: string;
  value: T;
  options: readonly OptionPickerOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

/**
 * A 48px ink-bordered select that opens an OptionPicker bottom sheet — the
 * Add Field form's picker pattern packaged for reuse.
 */
export function SelectField<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className,
}: SelectFieldProps<T>) {
  const pickerRef = useRef<BottomSheetModal>(null);
  const selected = options.find((option) => option.value === value);

  return (
    <View className={cn('mt-[18px]', className)}>
      <MicroLabel>{label}</MicroLabel>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => pickerRef.current?.present()}
        className="mt-2 min-h-tap flex-row items-center justify-between border-field border-ink px-3"
      >
        <Text className="font-archivo-bold text-label">
          {selected?.label ?? 'Select'}
        </Text>
        <ChevronDown size={18} color={colors.accent.DEFAULT} />
      </Pressable>
      <OptionPicker
        ref={pickerRef}
        title={label}
        value={value}
        options={options}
        onSelect={(next) => {
          onChange(next);
          pickerRef.current?.dismiss();
        }}
      />
    </View>
  );
}
