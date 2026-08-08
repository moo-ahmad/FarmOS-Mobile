import { View } from 'react-native';

import { Tag, Text } from '@/components/ui';
import { colors } from '@/theme';

import type { Reminder } from '../fixtures';

export interface ReminderRowProps {
  reminder: Reminder;
}

/** One reminder row: icon (red if critical), title/sub, trailing tag. */
export function ReminderRow({ reminder }: ReminderRowProps) {
  const { Icon } = reminder;
  return (
    <View className="flex-row items-center gap-3 px-4 py-3">
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
    </View>
  );
}
