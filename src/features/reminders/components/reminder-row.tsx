import { Pressable, View } from 'react-native';

import { Tag, Text } from '@/components/ui';
import { colors } from '@/theme';

import type { Reminder, ReminderTarget } from '../fixtures';

export interface ReminderRowProps {
  reminder: Reminder;
  /** Called only when the reminder has a target (reminder.target is set). */
  onNavigate?: (target: ReminderTarget) => void;
}

/**
 * One reminder row: icon (red if critical), title/sub, trailing tag. Rows with
 * a target are tappable and navigate there; others are static (the design's
 * broader per-type actions — Assign/Pay/Verify/Plan — aren't built yet).
 */
export function ReminderRow({ reminder, onNavigate }: ReminderRowProps) {
  const { Icon, target } = reminder;
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

  if (target) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => onNavigate?.(target)}
        className={className}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={className}>{content}</View>;
}
