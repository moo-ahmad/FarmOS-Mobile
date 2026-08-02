import { Text as RNText, type TextProps } from 'react-native';

import { cn } from '@/lib/cn';

export type TextVariant = 'title' | 'heading' | 'body' | 'label' | 'caption';

export type TextTone = 'default' | 'muted' | 'primary' | 'danger' | 'inverse';

const variantClass: Record<TextVariant, string> = {
  title: 'text-title font-bold',
  heading: 'text-heading font-semibold',
  body: 'text-body',
  label: 'text-label font-medium',
  caption: 'text-caption',
};

const toneClass: Record<TextTone, string> = {
  default: 'text-neutral-900 dark:text-neutral-0',
  muted: 'text-neutral-500 dark:text-neutral-400',
  primary: 'text-primary-700 dark:text-primary-400',
  danger: 'text-danger',
  inverse: 'text-neutral-0',
};

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  className?: string;
}

/** Typographic text primitive with a constrained variant/tone scale. */
export function Text({
  variant = 'body',
  tone = 'default',
  className,
  ...rest
}: AppTextProps) {
  return (
    <RNText
      className={cn(variantClass[variant], toneClass[tone], className)}
      {...rest}
    />
  );
}
