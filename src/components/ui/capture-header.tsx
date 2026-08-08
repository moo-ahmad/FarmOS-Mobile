import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { cn } from '@/lib/cn';
import { colors } from '@/theme';

import { Kicker } from './labels';
import { Text } from './text';

export interface CaptureHeaderProps {
  kicker: string;
  title: string;
  onClose: () => void;
  /** Right-aligned slot, e.g. Attendance's "6 / 8" count. */
  right?: ReactNode;
  className?: string;
}

/**
 * Header for the capture modals (Log Activity/Harvest/Expense/Attendance) and
 * the quick-capture chooser: a ✕ dismiss, then a stacked kicker/title — a
 * smaller 20px title than AppHeader's 24–26px, matching the modal context.
 */
export function CaptureHeader({
  kicker,
  title,
  onClose,
  right,
  className,
}: CaptureHeaderProps) {
  return (
    <View
      className={cn(
        'flex-row items-center gap-3 border-b-rule border-ink bg-neutral-0 px-4 py-3',
        className,
      )}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        hitSlop={8}
        onPress={onClose}
      >
        <X size={22} color={colors.ink} strokeWidth={2} />
      </Pressable>
      <View className="flex-1">
        <Kicker>{kicker}</Kicker>
        <Text variant="heading">{title}</Text>
      </View>
      {right}
    </View>
  );
}
