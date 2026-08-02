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
import i18n, { syncLayoutDirection, type SupportedLanguage } from '@/i18n';
import { QueryProvider } from '@/lib/query';

SplashScreen.preventAutoHideAsync();

// Align native layout direction (LTR/RTL) with the resolved language at startup.
syncLayoutDirection(i18n.language as SupportedLanguage);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <AnimatedSplashOverlay />
          <DatabaseGate>
            <AppTabs />
          </DatabaseGate>
        </ThemeProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
