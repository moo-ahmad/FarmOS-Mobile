import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { SquareBadge, Tag, Text } from '@/components/ui';
import { cn } from '@/lib/cn';
import { colors } from '@/theme';

import type { Field } from '../fixtures';

export interface FieldRowProps {
  field: Field;
  onPress?: () => void;
  /** The field the user arrived to see — a light accent tint, not in the design. */
  highlighted?: boolean;
}

/** One field-list row: 38px badge (muted for fallow), title/sub, tag, chevron. */
export function FieldRow({
  field,
  onPress,
  highlighted = false,
}: FieldRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-3 px-4 py-3.5',
        highlighted && 'bg-accent-100',
      )}
    >
      <SquareBadge code={field.code} size={38} muted={field.fallow} />
      <View className="flex-1">
        <Text variant="row">{field.title}</Text>
        <Text variant="caption" tone="muted">
          {field.areaHa} ha · {field.note}
        </Text>
      </View>
      <Tag label={field.tagLabel} variant={field.tagVariant} />
      <ChevronRight size={18} color={colors.neutral[500]} strokeWidth={2} />
    </Pressable>
  );
}
