import * as SplashScreen from 'expo-splash-screen';
import { type PropsWithChildren, useEffect } from 'react';

import { useAppFonts } from '@/theme/use-app-fonts';

/**
 * Holds the first render until the Archivo fonts are loaded, keeping the native
 * splash screen up meanwhile. Everything Modernist is set in Archivo, so nothing
 * should paint in a fallback font first.
 */
export function FontGate({ children }: PropsWithChildren) {
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return <>{children}</>;
}
