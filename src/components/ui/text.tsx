import { Text as RNText, type TextProps } from 'react-native';

import { cn } from '@/lib/cn';

export type TextVariant =
  | 'hero-lg'
  | 'hero'
  | 'title'
  | 'title-sm'
  | 'heading'
  | 'row'
  | 'body'
  | 'label'
  | 'caption'
  | 'micro'
  | 'kicker';

export type TextTone = 'default' | 'muted' | 'accent' | 'inverse';

const variantClass: Record<TextVariant, string> = {
  'hero-lg': 'font-archivo-bold text-hero-lg tracking-hero',
  hero: 'font-archivo-bold text-hero tracking-hero',
  title: 'font-archivo-bold text-title tracking-tight',
  'title-sm': 'font-archivo-bold text-title-sm tracking-tight',
  heading: 'font-archivo-bold text-heading',
  row: 'font-archivo-bold text-row',
  body: 'font-archivo text-body',
  label: 'font-archivo-medium text-label',
  caption: 'font-archivo text-caption',
  micro: 'font-archivo-medium text-micro uppercase tracking-micro',
  kicker: 'font-archivo-medium text-kicker uppercase tracking-kicker',
};

const toneClass: Record<TextTone, string> = {
  default: 'text-ink',
  muted: 'text-neutral-500',
  accent: 'text-accent',
  inverse: 'text-neutral-0',
};

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  className?: string;
}

/** Modernist text primitive — everything is set in Archivo. */
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
