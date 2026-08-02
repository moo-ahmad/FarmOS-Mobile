import { type ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/cn';

import { Text } from './text';

export interface BannerProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/** Solid-red alert banner (white text) — e.g. "2 items below reorder level". */
export function Banner({ children, icon, className }: BannerProps) {
  return (
    <View
      className={cn(
        'flex-row items-center gap-2 bg-accent px-3 py-2.5',
        className,
      )}
    >
      {icon}
      <Text tone="inverse" className="flex-1 font-archivo-medium text-label">
        {children}
      </Text>
    </View>
  );
}

export interface CalloutProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/** Red-bordered callout on an accent tint (e.g. the PHI safe-harvest note). */
export function Callout({ children, icon, className }: CalloutProps) {
  return (
    <View
      className={cn(
        'flex-row items-start gap-2 border-field border-accent bg-accent-100 px-3 py-2.5',
        className,
      )}
    >
      {icon}
      <Text variant="caption" className="flex-1 text-accent-800">
        {children}
      </Text>
    </View>
  );
}
