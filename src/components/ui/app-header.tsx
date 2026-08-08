import { ChevronLeft } from 'lucide-react-native';
import { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { cn } from '@/lib/cn';
import { colors } from '@/theme';

import { Kicker } from './labels';
import { Text } from './text';

export interface AppHeaderProps {
  /** Red uppercase kicker above the title. */
  kicker?: string;
  title: string;
  /** Right-aligned contextual control (bell, plus, filter…). */
  right?: ReactNode;
  /** When set, shows a back chevron on the left (detail screens). */
  onBack?: () => void;
  /** 22px title instead of 26px — for drill-in detail screens like Crop P&L. */
  compact?: boolean;
  className?: string;
}

/**
 * White app header with a 2.5px ink bottom rule: a red kicker over a large
 * Archivo-800 title, flush left, with an optional back chevron and a right slot.
 */
export function AppHeader({
  kicker,
  title,
  right,
  onBack,
  compact = false,
  className,
}: AppHeaderProps) {
  return (
    <View
      className={cn(
        'flex-row items-center gap-3 border-b-rule border-ink bg-neutral-0 px-4 py-3',
        className,
      )}
    >
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
          onPress={onBack}
        >
          <ChevronLeft size={26} color={colors.ink} />
        </Pressable>
      ) : null}
      <View className="flex-1">
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <Text variant={compact ? 'title-sm' : 'title'}>{title}</Text>
      </View>
      {right}
    </View>
  );
}
