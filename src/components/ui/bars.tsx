import { View } from 'react-native';

import { cn } from '@/lib/cn';

function clampFraction(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export interface ProgressBarProps {
  /** 0–1. */
  value: number;
  /** Fill color class; defaults to ink. */
  fillClassName?: string;
  className?: string;
}

/** Cost/budget progress bar: surface track with an ink fill. */
export function ProgressBar({
  value,
  fillClassName = 'bg-ink',
  className,
}: ProgressBarProps) {
  return (
    <View className={cn('h-1.5 w-full bg-surface', className)}>
      <View
        style={{ width: `${clampFraction(value) * 100}%` }}
        className={cn('h-full', fillClassName)}
      />
    </View>
  );
}

export interface LevelBarProps {
  /** 0–1 fill. */
  value: number;
  /** 0–1 reorder threshold, drawn as a 2px ink marker. */
  threshold?: number;
  /** Below reorder level — fill turns red. */
  low?: boolean;
  className?: string;
}

/** Inventory level bar with an optional reorder-threshold marker. */
export function LevelBar({
  value,
  threshold,
  low = false,
  className,
}: LevelBarProps) {
  return (
    <View className={cn('h-1.5 w-full bg-surface', className)}>
      <View
        style={{ width: `${clampFraction(value) * 100}%` }}
        className={cn('h-full', low ? 'bg-accent' : 'bg-ink')}
      />
      {threshold != null ? (
        <View
          style={{ left: `${clampFraction(threshold) * 100}%` }}
          className="absolute top-0 h-full w-0.5 bg-ink"
        />
      ) : null}
    </View>
  );
}
