import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { colors } from '@/theme';

import { SquareBadge, Text } from './ui';

export interface CycleSelectorRowProps {
  fieldCode: string;
  cropLabel: string;
  /** Second line under the crop label — e.g. "Field 3" or "Direct · 100%". */
  sub?: string;
  onPress: () => void;
}

/**
 * Bordered selector row (30px badge, ink border, red chevron) that opens the
 * CyclePicker sheet — shared between Log Activity's "Field & crop" and Log
 * Expense's "Allocate to".
 */
export function CycleSelectorRow({
  fieldCode,
  cropLabel,
  sub,
  onPress,
}: CycleSelectorRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-tap flex-row items-center gap-2.5 border-field border-ink px-3.5 py-2.5"
    >
      {fieldCode ? <SquareBadge code={fieldCode} size={30} /> : null}
      <View className="flex-1">
        <Text variant="row">{cropLabel || 'Select field & crop'}</Text>
        {sub ? (
          <Text variant="caption" tone="muted">
            {sub}
          </Text>
        ) : null}
      </View>
      <ChevronRight size={18} color={colors.accent.DEFAULT} strokeWidth={2} />
    </Pressable>
  );
}
