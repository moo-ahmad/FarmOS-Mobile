import { type ReactNode, useState } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';

import { cn } from '@/lib/cn';
import { colors } from '@/theme';

import { Text } from './text';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  /** Node rendered inside the field box, right of the input (e.g. an eye toggle). */
  trailing?: ReactNode;
  /** Classes for the TextInput itself. */
  className?: string;
  /** Classes for the outer container (label + field + error). */
  containerClassName?: string;
  /** Classes for the bordered field box. */
  fieldClassName?: string;
}

/**
 * Modernist text input: surface fill, a 1.5px border that goes ink on focus
 * (accent on error), zero radius, set in Archivo. Supports a trailing element.
 */
export function TextField({
  label,
  error,
  trailing,
  className,
  containerClassName,
  fieldClassName,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const borderClass = error
    ? 'border-accent'
    : focused
      ? 'border-ink'
      : 'border-divider';

  return (
    <View className={cn('gap-1.5', containerClassName)}>
      {label ? (
        <Text variant="micro" tone="muted">
          {label}
        </Text>
      ) : null}
      <View
        className={cn(
          'min-h-tap flex-row items-center gap-2 border-field bg-surface px-3',
          borderClass,
          fieldClassName,
        )}
      >
        <TextInput
          placeholderTextColor={colors.neutral[500]}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          className={cn(
            'flex-1 font-archivo-bold text-body text-ink',
            className,
          )}
          {...rest}
        />
        {trailing}
      </View>
      {error ? (
        <Text variant="caption" tone="accent">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
