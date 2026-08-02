import { useState } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';

import { cn } from '@/lib/cn';
import { colors } from '@/theme';

import { Text } from './text';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}

/**
 * Modernist text input: surface fill, a 1.5px border that goes ink on focus
 * (accent on error), zero radius, set in Archivo.
 */
export function TextField({
  label,
  error,
  className,
  containerClassName,
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
          'min-h-tap border-field bg-surface px-3 font-archivo text-body text-ink',
          borderClass,
          className,
        )}
        {...rest}
      />
      {error ? (
        <Text variant="caption" tone="accent">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
