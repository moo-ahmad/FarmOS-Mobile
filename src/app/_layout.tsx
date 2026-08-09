// Polyfill crypto.getRandomValues before anything generates a UUID (ids layer).
import 'react-native-get-random-values';
// Load Tailwind/NativeWind styles at the app root.
import '@/global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { FontGate } from '@/components/font-gate';
import { SessionProvider } from '@/features/auth';
import i18n, { syncLayoutDirection, type SupportedLanguage } from '@/i18n';
import { initSentry, Sentry } from '@/lib/observability/sentry';
import { QueryProvider } from '@/lib/query';

// Initialise crash reporting before anything else can throw.
initSentry();

SplashScreen.preventAutoHideAsync();

// Align native layout direction (LTR/RTL) with the resolved language at startup.
syncLayoutDirection(i18n.language as SupportedLanguage);

/**
 * Root layout. Always renders the root <Stack> navigator (Expo Router requires
 * it); the `login` route and the `(tabs)` group each redirect based on session.
 * FontGate holds render (keeping the splash up) until Archivo is loaded.
 *
 * The Modernist design has no dark-mode variant — every screen is a light
 * (paper/white) background with dark ink text — so the app is locked to light
 * appearance (`userInterfaceStyle: "light"` in app.json) and the status bar is
 * forced to dark (visible) icons here, rather than following the system theme.
 * Letting either follow the device's dark mode is what caused the status bar
 * icons to render invisible (white-on-white).
 */
function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <ThemeProvider value={DefaultTheme}>
          <SessionProvider>
            <StatusBar style="dark" />
            <FontGate>
              <BottomSheetModalProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name="capture/index"
                    options={{ presentation: 'modal' }}
                  />
                  <Stack.Screen
                    name="capture/activity"
                    options={{ presentation: 'modal' }}
                  />
                  <Stack.Screen
                    name="capture/harvest"
                    options={{ presentation: 'modal' }}
                  />
                  <Stack.Screen
                    name="capture/expense"
                    options={{ presentation: 'modal' }}
                  />
                  <Stack.Screen
                    name="capture/attendance"
                    options={{ presentation: 'modal' }}
                  />
                </Stack>
              </BottomSheetModalProvider>
            </FontGate>
          </SessionProvider>
        </ThemeProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}

// Sentry.wrap enables native crash context, performance tracing, and the
// error boundary. It's a no-op reporting-wise until a DSN is configured.
export default Sentry.wrap(RootLayout);
