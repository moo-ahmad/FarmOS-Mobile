import { ChevronRight, Minus, Plus } from 'lucide-react-native';
import { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { cn } from '@/lib/cn';
import { colors } from '@/theme';

import { Text } from './text';

export interface SquareBadgeProps {
  code: string;
  size?: number;
  /** Muted grey badge (e.g. a fallow field). */
  muted?: boolean;
}

/** Solid-ink square badge with a white field/entity code. */
export function SquareBadge({
  code,
  size = 36,
  muted = false,
}: SquareBadgeProps) {
  return (
    <View
      style={{ width: size, height: size }}
      className={cn(
        'items-center justify-center',
        muted ? 'bg-neutral-400' : 'bg-ink',
      )}
    >
      <Text tone="inverse" className="font-archivo-bold text-label">
        {code}
      </Text>
    </View>
  );
}

export interface SelectorRowProps {
  title: string;
  sub?: string;
  badge?: ReactNode;
  /** Overrides the default red chevron on the right. */
  trailing?: ReactNode;
  onPress?: () => void;
}

/** Bordered selector row (field/crop/payee) with a trailing red chevron. */
export function SelectorRow({
  title,
  sub,
  badge,
  trailing,
  onPress,
}: SelectorRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-tap flex-row items-center gap-3 border-field border-divider bg-surface px-3 py-2.5"
    >
      {badge}
      <View className="flex-1">
        <Text variant="row">{title}</Text>
        {sub ? (
          <Text variant="caption" tone="muted">
            {sub}
          </Text>
        ) : null}
      </View>
      {trailing ?? <ChevronRight size={20} color={colors.accent.DEFAULT} />}
    </Pressable>
  );
}

export interface StepperProps {
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
  unit?: string;
  /** Render the value at hero size (e.g. harvest gross weight). */
  big?: boolean;
}

/** Numeric stepper with square −/+ controls; the + is solid red. */
export function Stepper({
  value,
  onDecrement,
  onIncrement,
  unit,
  big = false,
}: StepperProps) {
  return (
    <View className="flex-row items-stretch border-field border-divider">
      <View className="flex-1 flex-row items-baseline gap-1 px-3 py-2">
        <Text variant={big ? 'hero-lg' : 'heading'} className="tracking-hero">
          {value}
        </Text>
        {unit ? (
          <Text variant="body" tone="muted">
            {unit}
          </Text>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease"
        onPress={onDecrement}
        className="min-h-tap w-12 items-center justify-center border-l-field border-divider"
      >
        <Minus size={20} color={colors.ink} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase"
        onPress={onIncrement}
        className="min-h-tap w-12 items-center justify-center bg-accent"
      >
        <Plus size={20} color={colors.white} />
      </Pressable>
    </View>
  );
}
