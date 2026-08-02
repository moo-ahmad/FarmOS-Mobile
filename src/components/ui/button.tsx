import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
} from 'react-native';

import * as haptics from '@/lib/haptics';
import { cn } from '@/lib/cn';

import { Text, type TextTone } from './text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';
export type ButtonHaptic = 'selection' | 'success' | 'none';

const BASE =
  'min-h-tap flex-row items-center justify-center gap-2 rounded-xl px-5';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 active:bg-primary-700',
  secondary: 'bg-neutral-100 active:bg-neutral-200 dark:bg-neutral-800',
  ghost: 'bg-transparent active:bg-neutral-100 dark:active:bg-neutral-800',
  danger: 'bg-danger active:opacity-90',
};

const labelTone: Record<ButtonVariant, TextTone> = {
  primary: 'inverse',
  secondary: 'default',
  ghost: 'primary',
  danger: 'inverse',
};

const sizeClass: Record<ButtonSize, string> = {
  md: '',
  lg: 'min-h-[56px] px-6',
};

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Feedback fired before onPress. Defaults to a light selection tick. */
  haptic?: ButtonHaptic;
  className?: string;
}

/**
 * Primary action button. Guarantees the 48px minimum tap target and gives
 * haptic confirmation, since the user often isn't looking at the screen.
 */
export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  haptic = 'selection',
  disabled,
  onPress,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={cn(
        BASE,
        variantClass[variant],
        sizeClass[size],
        isDisabled && 'opacity-50',
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
        <ActivityIndicator
          color={variant === 'secondary' ? '#16a34a' : '#fff'}
        />
      ) : (
        <Text
          variant="label"
          tone={labelTone[variant]}
          className={size === 'lg' ? 'text-body' : undefined}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
