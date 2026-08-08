import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Text } from '@/components/ui';
import { colors } from '@/theme';

export interface AmountFieldProps {
  value: string;
  onChangeText: (value: string) => void;
}

/**
 * Big bordered amount box (2px ink border, 44px value) — the same visual
 * family as Harvest's gross-weight Stepper, just without the +/- controls.
 * Not built on TextField: the chrome (border weight, size, no surface fill)
 * is different enough that reusing it would mean fighting its defaults.
 */
export function AmountField({ value, onChangeText }: AmountFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View
      className={`flex-row items-baseline gap-1 border-total px-4 py-4 ${
        focused ? 'border-accent' : 'border-ink'
      }`}
    >
      <Text className="font-archivo-bold text-heading text-neutral-500">$</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="decimal-pad"
        inputMode="decimal"
        placeholder="0.00"
        placeholderTextColor={colors.neutral[400]}
        className="flex-1 font-archivo-bold text-hero-lg tracking-hero text-ink"
      />
    </View>
  );
}
