import { TextInput, type TextInputProps, View } from 'react-native';

import { cn } from '@/lib/cn';

import { Text } from './text';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}

/** Labelled text input with the 48px minimum tap target and error state. */
export function TextField({
  label,
  error,
  className,
  containerClassName,
  ...rest
}: TextFieldProps) {
  return (
    <View className={cn('gap-1', containerClassName)}>
      {label ? (
        <Text variant="label" tone="muted">
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor="#94a3b8"
        className={cn(
          'min-h-tap rounded-xl border border-neutral-200 px-4 text-body text-neutral-900 dark:border-neutral-700 dark:text-neutral-0',
          error && 'border-danger',
          className,
        )}
        {...rest}
      />
      {error ? (
        <Text variant="caption" tone="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
