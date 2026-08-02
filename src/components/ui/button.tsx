import { ArrowRight } from 'lucide-react-native';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
} from 'react-native';

import { cn } from '@/lib/cn';
import * as haptics from '@/lib/haptics';
import { colors } from '@/theme';

import { Text } from './text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonHaptic = 'selection' | 'success' | 'none';

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'min-h-tap w-full flex-row items-center justify-between bg-accent px-4 py-3.5 active:bg-accent-700',
  secondary:
    'min-h-tap w-full flex-row items-center justify-between border-field border-ink bg-transparent px-4 py-3.5',
  ghost: 'flex-row items-center self-start px-1 py-1',
};

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  /** Feedback fired before onPress. Defaults to a light selection tick. */
  haptic?: ButtonHaptic;
  className?: string;
}

/**
 * Modernist primary action: a flush-left label with a trailing arrow, in a
 * full-width red block (zero radius). Guarantees the 48px tap target and gives
 * haptic confirmation.
 */
export function Button({
  title,
  variant = 'primary',
  loading = false,
  haptic = 'selection',
  disabled,
  onPress,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isBlock = variant !== 'ghost';
  const labelTone = variant === 'primary' ? 'inverse' : 'accent';
  const arrowColor = variant === 'primary' ? colors.white : colors.ink;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={cn(
        variantClass[variant],
        isDisabled && 'opacity-45',
        className,
      )}
      onPress={(event) => {
        if (haptic === 'success') void haptics.success();
        else if (haptic === 'selection') void haptics.selection();
        onPress?.(event);
      }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={arrowColor} />
      ) : (
        <>
          <Text
            tone={labelTone}
            className="font-archivo-bold text-[15px] leading-tight"
          >
            {title}
          </Text>
          {isBlock ? <ArrowRight size={20} color={arrowColor} /> : null}
        </>
      )}
    </Pressable>
  );
}
