import * as SplashScreen from 'expo-splash-screen';
import { type PropsWithChildren, useEffect } from 'react';

import { SplashScreen as AppSplashScreen } from '@/features/splash';
import { useAppFonts } from '@/theme/use-app-fonts';

/**
 * Holds the first render until the Archivo fonts are loaded, showing the
 * branded splash meanwhile and keeping the native splash up until then.
 * Everything Modernist is set in Archivo, so nothing should paint in a
 * fallback font first.
 */
export function FontGate({ children }: PropsWithChildren) {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return <AppSplashScreen />;
  return <>{children}</>;
}
