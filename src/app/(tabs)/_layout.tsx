import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { DatabaseGate } from '@/components/database-gate';
import { Colors } from '@/constants/theme';
import { useSession } from '@/features/auth';

/**
 * The signed-in app: bottom tabs, gated on an open session and on the database
 * being migrated. Signed-out users are redirected to the login route.
 */
export default function TabsLayout() {
  const { signedIn } = useSession();
  const scheme = useColorScheme();

  if (!signedIn) {
    return <Redirect href="/login" />;
  }

  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <DatabaseGate>
      <NativeTabs
        backgroundColor={colors.background}
        indicatorColor={colors.backgroundElement}
        labelStyle={{ selected: { color: colors.text } }}
      >
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={require('@/assets/images/tabIcons/home.png')}
            renderingMode="template"
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="activity">
          <NativeTabs.Trigger.Label>Activity</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={require('@/assets/images/tabIcons/explore.png')}
            renderingMode="template"
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="explore">
          <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={require('@/assets/images/tabIcons/explore.png')}
            renderingMode="template"
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    </DatabaseGate>
  );
}
