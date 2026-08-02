// Polyfill crypto.getRandomValues before anything generates a UUID (ids layer).
import 'react-native-get-random-values';
// Load Tailwind/NativeWind styles at the app root.
import '@/global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { DatabaseGate } from '@/components/database-gate';
import { FontGate } from '@/components/font-gate';
import i18n, { syncLayoutDirection, type SupportedLanguage } from '@/i18n';
import { initSentry, Sentry } from '@/lib/observability/sentry';
import { QueryProvider } from '@/lib/query';

// Initialise crash reporting before anything else can throw.
initSentry();

SplashScreen.preventAutoHideAsync();

// Align native layout direction (LTR/RTL) with the resolved language at startup.
syncLayoutDirection(i18n.language as SupportedLanguage);

function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <AnimatedSplashOverlay />
          <FontGate>
            <DatabaseGate>
              <AppTabs />
            </DatabaseGate>
          </FontGate>
        </ThemeProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}

// Sentry.wrap enables native crash context, performance tracing, and the
// error boundary. It's a no-op reporting-wise until a DSN is configured.
export default Sentry.wrap(TabLayout);
