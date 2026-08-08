import { router } from 'expo-router';

import { AttendanceScreen } from '@/features/attendance';

export default function LogAttendanceRoute() {
  return (
    <AttendanceScreen
      onClose={() => router.back()}
      onSaved={() => router.back()}
    />
  );
}
