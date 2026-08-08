import { Pressable, View } from 'react-native';

import { Tag, Text } from '@/components/ui';
import { colors } from '@/theme';

import type { Reminder } from '../fixtures';

export interface ReminderRowProps {
  reminder: Reminder;
  /** Called only when the reminder references a field (reminder.fieldCode is set). */
  onOpenField?: (fieldCode: string) => void;
}

/**
 * One reminder row: icon (red if critical), title/sub, trailing tag. Rows that
 * reference a field are tappable and open it; others are static (the design's
 * broader per-type actions — Assign/Pay/Verify/Plan — aren't built yet).
 */
export function ReminderRow({ reminder, onOpenField }: ReminderRowProps) {
  const { Icon, fieldCode } = reminder;
  const content = (
    <>
      <Icon
        size={22}
        color={reminder.critical ? colors.accent.DEFAULT : colors.ink}
        strokeWidth={1.9}
      />
      <View className="flex-1">
        <Text variant="row">{reminder.title}</Text>
        <Text variant="caption" tone="muted">
          {reminder.sub}
        </Text>
      </View>
      <Tag label={reminder.tagLabel} variant={reminder.tagVariant} />
    </>
  );

  const className = 'flex-row items-center gap-3 px-4 py-3';

  if (fieldCode) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => onOpenField?.(fieldCode)}
        className={className}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={className}>{content}</View>;
}
