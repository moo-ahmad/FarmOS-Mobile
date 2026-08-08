import { router } from 'expo-router';
import { UserCheck } from 'lucide-react-native';
import { View } from 'react-native';

import { CaptureHeader, Screen, Text } from '@/components/ui';
import { colors } from '@/theme';

// Log Attendance (canvas `1a`, frame 9) is not built yet — a placeholder so
// the chooser has a real destination instead of a dead link.
export default function LogAttendanceRoute() {
  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader
        kicker="Today"
        title="Attendance"
        onClose={() => router.back()}
      />
      <View className="flex-1 items-center justify-center gap-3 px-8">
        <UserCheck size={32} color={colors.neutral[400]} />
        <Text tone="muted" className="text-center">
          Log Attendance is coming soon.
        </Text>
      </View>
    </Screen>
  );
}
