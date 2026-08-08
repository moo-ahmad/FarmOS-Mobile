import { router } from 'expo-router';

import { RemindersScreen } from '@/features/reminders';

export default function AlertsRoute() {
  return (
    <RemindersScreen
      onNavigate={(target) => {
        if (target.kind === 'field') {
          router.push(`/fields?focus=${target.fieldCode}`);
        } else {
          router.push(
            `/capture/activity?fieldCode=${target.fieldCode}&operation=${target.operation}`,
          );
        }
      }}
    />
  );
}
