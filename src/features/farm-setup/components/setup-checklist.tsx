import { Check, ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { cn } from '@/lib/cn';
import { colors } from '@/theme';

import type { FarmSetupStatus } from '../setup-status';

export interface SetupChecklistProps {
  status: FarmSetupStatus;
  onAddSeason: () => void;
  onAddIrrigationSource: () => void;
}

interface StepRowProps {
  title: string;
  sub: string;
  done: boolean;
  onPress: () => void;
}

function StepRow({ title, sub, done, onPress }: StepRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ checked: done, disabled: done }}
      disabled={done}
      onPress={onPress}
      className="min-h-tap flex-row items-center gap-3 border-field border-divider bg-surface px-3 py-2.5"
    >
      <View
        className={cn(
          'h-6 w-6 items-center justify-center border-field',
          done ? 'border-ink bg-ink' : 'border-divider',
        )}
      >
        {done ? <Check size={14} color={colors.neutral[0]} /> : null}
      </View>
      <View className="flex-1">
        <Text
          variant="row"
          className={done ? 'text-neutral-500 line-through' : undefined}
        >
          {title}
        </Text>
        <Text variant="caption" tone="muted">
          {done ? 'Done' : sub}
        </Text>
      </View>
      {done ? null : <ChevronRight size={18} color={colors.accent.DEFAULT} />}
    </Pressable>
  );
}

/** The two first-run steps a new farm needs before it can plan crop cycles. */
export function SetupChecklist({
  status,
  onAddSeason,
  onAddIrrigationSource,
}: SetupChecklistProps) {
  return (
    <View className="gap-2">
      <StepRow
        title="Add a season"
        sub="e.g. Rabi 2026-27 — every crop cycle belongs to one."
        done={status.hasOpenSeason}
        onPress={onAddSeason}
      />
      <StepRow
        title="Add an irrigation source"
        sub="Tubewell, canal… — used to cost irrigation on your fields."
        done={status.hasIrrigationSource}
        onPress={onAddIrrigationSource}
      />
    </View>
  );
}
