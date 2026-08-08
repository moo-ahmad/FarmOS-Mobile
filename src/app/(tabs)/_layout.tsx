import { Redirect, Stack } from 'expo-router';
import { View } from 'react-native';

import { DatabaseGate } from '@/components/database-gate';
import { TabBar } from '@/components/tab-bar';
import { useSession } from '@/features/auth';

/**
 * The signed-in app: a nested Stack (renders whichever tab route currently
 * matches) with the Modernist TabBar fixed below it, gated on an open session
 * and on the database being migrated. Signed-out users are redirected to login.
 */
export default function TabsLayout() {
  const { signedIn } = useSession();

  if (!signedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <DatabaseGate>
      <View className="flex-1">
        <View className="flex-1">
          <Stack screenOptions={{ headerShown: false }} />
        </View>
        <TabBar />
      </View>
    </DatabaseGate>
  );
}
