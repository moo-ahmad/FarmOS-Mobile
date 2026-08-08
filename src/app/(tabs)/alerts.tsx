import { router } from 'expo-router';

import { RemindersScreen } from '@/features/reminders';

export default function AlertsRoute() {
  return (
    <RemindersScreen
      onOpenField={(fieldCode) => router.push(`/fields?focus=${fieldCode}`)}
    />
  );
}
