import { View } from 'react-native';

import { cn } from '@/lib/cn';

import { Text } from './text';

export type TagVariant = 'solid' | 'ink' | 'accent' | 'neutral' | 'outline';

const boxClass: Record<TagVariant, string> = {
  solid: 'bg-accent', // Today / Overdue / Low
  ink: 'bg-ink', // negative / absent
  accent: 'bg-accent-100',
  neutral: 'bg-neutral-100',
  outline: 'border-hairline border-accent',
};

const textClass: Record<TagVariant, string> = {
  solid: 'text-neutral-0',
  ink: 'text-neutral-0',
  accent: 'text-accent-800',
  neutral: 'text-neutral-800',
  outline: 'text-accent',
};

export interface TagProps {
  label: string;
  variant?: TagVariant;
  className?: string;
}

/** Rectangular status pill (zero radius). */
export function Tag({ label, variant = 'neutral', className }: TagProps) {
  return (
    <View
      className={cn('self-start px-2.5 py-0.5', boxClass[variant], className)}
    >
      <Text
        variant="caption"
        className={cn('font-archivo-medium', textClass[variant])}
      >
        {label}
      </Text>
    </View>
  );
}
