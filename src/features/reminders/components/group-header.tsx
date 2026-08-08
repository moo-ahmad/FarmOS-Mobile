import { View } from 'react-native';

import { cn } from '@/lib/cn';
import { MicroLabel, Text } from '@/components/ui';

export interface GroupHeaderProps {
  label: string;
  count: number;
  /** The Overdue group renders on a surface strip with a red label. */
  emphasis?: boolean;
}

/** Section header for a reminders group, e.g. "Overdue · 2". */
export function GroupHeader({
  label,
  count,
  emphasis = false,
}: GroupHeaderProps) {
  return (
    <View className={cn('px-4 pb-1.5 pt-3', emphasis && 'bg-surface')}>
      {emphasis ? (
        <Text variant="micro" tone="accent">
          {label} · {count}
        </Text>
      ) : (
        <MicroLabel>
          {label} · {count}
        </MicroLabel>
      )}
    </View>
  );
}
