import { Pressable, View } from 'react-native';

import { cn } from '@/lib/cn';

import { Text } from './text';

export interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string | number> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** This option renders selected in ink instead of red (e.g. "Absent"). */
  negativeValue?: T;
  /** Smaller 11px label — used for compact controls like Expense's "Paid by". */
  compact?: boolean;
  className?: string;
}

/** Full-width segmented control; selected segment is solid red (or ink). */
export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  negativeValue,
  compact = false,
  className,
}: SegmentedControlProps<T>) {
  return (
    <View className={cn('flex-row border-field border-divider', className)}>
      {options.map((option, index) => {
        const selected = option.value === value;
        const negative = option.value === negativeValue;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            className={cn(
              'min-h-tap flex-1 items-center justify-center px-2',
              index > 0 && 'border-l-hairline border-divider',
              selected && (negative ? 'bg-ink' : 'bg-accent'),
            )}
          >
            <Text
              tone={selected ? 'inverse' : 'default'}
              className={cn(
                'font-archivo-medium',
                compact ? 'text-caption' : 'text-label',
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export interface ChipRowProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labelFor?: (value: T) => string;
  className?: string;
}

/** Row of single-select rectangular chips; selected chip is solid red. */
export function ChipRow<T extends string>({
  options,
  value,
  onChange,
  labelFor,
  className,
}: ChipRowProps<T>) {
  return (
    <View className={cn('flex-row flex-wrap gap-2', className)}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option)}
            className={cn(
              'min-h-tap justify-center border-field px-3.5',
              selected ? 'border-ink bg-accent' : 'border-divider',
            )}
          >
            <Text
              tone={selected ? 'inverse' : 'default'}
              className="font-archivo-medium text-label"
            >
              {labelFor ? labelFor(option) : option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
