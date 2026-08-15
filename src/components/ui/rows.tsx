import { ChevronRight, Minus, Plus } from 'lucide-react-native';
import { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { cn } from '@/lib/cn';
import { colors } from '@/theme';

import { Text } from './text';

export interface SquareBadgeProps {
  code: string;
  size?: number;
  /** Muted grey badge, e.g. a fallow field or an absent worker. */
  muted?: boolean;
}

/** Solid-ink square badge with a white code; muted badges use a light-grey pairing instead. */
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
        muted ? 'bg-neutral-300' : 'bg-ink',
      )}
    >
      <Text
        className={cn(
          'font-archivo-bold text-label',
          muted ? 'text-neutral-700' : 'text-neutral-0',
        )}
      >
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
}

/**
 * Big bordered stepper box (e.g. harvest gross weight): 2px ink border, a
 * 44px value + muted unit, and square −/+ controls floated right — the + is
 * solid red.
 */
export function Stepper({
  value,
  onDecrement,
  onIncrement,
  unit,
}: StepperProps) {
  return (
    <View className="flex-row items-baseline gap-2 border-total border-ink p-4">
      <Text variant="hero-lg" className="tracking-hero">
        {value}
      </Text>
      {unit ? (
        <Text className="font-archivo-bold text-heading text-neutral-500">
          {unit}
        </Text>
      ) : null}
      <View className="ml-auto flex-row gap-1.5">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Decrease"
          onPress={onDecrement}
          className="h-[34px] w-[34px] items-center justify-center border-field border-divider"
        >
          <Minus size={18} color={colors.ink} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Increase"
          onPress={onIncrement}
          className="h-[34px] w-[34px] items-center justify-center border-field border-ink bg-accent"
        >
          <Plus size={18} color={colors.white} />
        </Pressable>
      </View>
    </View>
  );
}
