import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { MicroLabel, Tag, Text } from '@/components/ui';
import { Fonts } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { formatMoneyDisplay, quantityToString } from '@/lib/decimal';
import { colors } from '@/theme';

import type { Season } from '../model';
import { seasonDateRangeLabel } from '../season-display';

export interface SeasonCardProps {
  season: Season;
  onView?: () => void;
  onEdit?: () => void;
  onClose?: () => void;
}

interface ActionButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  chevron?: boolean;
  emphasis?: boolean;
}

function ActionButton({
  label,
  onPress,
  disabled = false,
  chevron = false,
  emphasis = false,
}: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn(
        'min-h-tap flex-1 flex-row items-center justify-between border-field px-3',
        emphasis ? 'border-accent' : 'border-ink',
        disabled && 'opacity-45',
      )}
    >
      <Text
        className={cn(
          'font-archivo-bold text-[14px]',
          emphasis && 'text-accent-700',
        )}
      >
        {label}
      </Text>
      {chevron ? (
        <ChevronRight size={20} color={colors.ink} strokeWidth={2.2} />
      ) : null}
    </Pressable>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 gap-0.5">
      <MicroLabel>{label}</MicroLabel>
      <Text variant="row">{value}</Text>
    </View>
  );
}

/** One season: name/status, type + dates, KPIs, code suffix and actions. */
export function SeasonCard({
  season,
  onView,
  onEdit,
  onClose,
}: SeasonCardProps) {
  const isOpen = season.status === 'open';

  return (
    <View className="border-field border-divider p-4">
      <View className="flex-row items-center gap-2.5">
        <Text variant="heading" className="flex-1 text-[16px]">
          {season.name}
        </Text>
        <Tag
          label={isOpen ? 'Open' : 'Closed'}
          variant={isOpen ? 'ink' : 'neutral'}
        />
      </View>

      <View className="mt-2 flex-row flex-wrap items-center gap-2">
        <Tag label={season.type} variant="accent" />
        <Text variant="caption" tone="muted">
          {seasonDateRangeLabel(season)}
        </Text>
      </View>

      <View className="mt-3 flex-row gap-2">
        <Stat label="Cycles" value={String(season.cycleCount)} />
        <Stat
          label="Planted"
          value={`${quantityToString(season.plantedHectares)} ha`}
        />
        <Stat label="Cost" value={`$${formatMoneyDisplay(season.cost)}`} />
        <Stat
          label="Revenue"
          value={`$${formatMoneyDisplay(season.revenue)}`}
        />
      </View>

      <View className="mt-2.5 flex-row items-center justify-between">
        <MicroLabel>Cycle-code suffix</MicroLabel>
        <Text variant="label" style={{ fontFamily: Fonts?.mono }}>
          {season.codeSuffix}
        </Text>
      </View>

      <View className="mt-3 flex-row gap-2">
        <ActionButton label="View" chevron onPress={onView} />
        <ActionButton label="Edit" disabled={!isOpen} onPress={onEdit} />
        {isOpen ? (
          <ActionButton label="Close" emphasis onPress={onClose} />
        ) : null}
      </View>
      {isOpen ? null : (
        <Text variant="caption" tone="muted" className="mt-1.5">
          Closed seasons can&apos;t be edited.
        </Text>
      )}
    </View>
  );
}
