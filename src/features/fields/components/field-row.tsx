import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { SquareBadge, Tag, Text } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { FieldDto } from '@/lib/fields';
import { colors } from '@/theme';

import {
  fieldAreaLabel,
  fieldSoilLabel,
  fieldUsageTag,
} from '../field-display';
import { FieldUsageType } from '../model';

export interface FieldRowProps {
  field: FieldDto;
  onPress?: () => void;
  /** The field the user arrived to see — a light accent tint, not in the design. */
  highlighted?: boolean;
}

/** One field-list row: badge (muted for fallow), title/sub, usage tag, chevron. */
export function FieldRow({
  field,
  onPress,
  highlighted = false,
}: FieldRowProps) {
  const tag = fieldUsageTag(field);
  const soil = fieldSoilLabel(field);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-3 px-4 py-3.5',
        highlighted && 'bg-accent-100',
      )}
    >
      <SquareBadge
        code={field.code}
        size={38}
        muted={field.usageType === FieldUsageType.Fallow}
      />
      <View className="flex-1">
        <Text variant="row">{field.name}</Text>
        <Text variant="caption" tone="muted">
          {fieldAreaLabel(field)}
          {soil ? ` · ${soil}` : ''}
        </Text>
      </View>
      <Tag label={tag.label} variant={tag.variant} />
      <ChevronRight size={18} color={colors.neutral[500]} strokeWidth={2} />
    </Pressable>
  );
}
