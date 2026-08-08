import { type ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/cn';

export interface CaptureFooterProps {
  children: ReactNode;
  className?: string;
}

/** Footer shared by the capture modals: 2.5px ink top rule, white background. */
export function CaptureFooter({ children, className }: CaptureFooterProps) {
  return (
    <View
      className={cn(
        'border-t-rule border-ink bg-neutral-0 px-4 py-3',
        className,
      )}
    >
      {children}
    </View>
  );
}
