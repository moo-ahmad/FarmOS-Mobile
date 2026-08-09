import * as SplashScreen from 'expo-splash-screen';
import { type PropsWithChildren, useEffect, useState } from 'react';

import { SplashScreen as AppSplashScreen } from '@/features/splash';
import { useAppFonts } from '@/theme/use-app-fonts';

/** The branded splash stays up this long even if fonts load faster. */
const MIN_SPLASH_DURATION_MS = 5000;

/**
 * Holds the first render until the Archivo fonts are loaded, showing the
 * branded splash meanwhile and keeping the native splash up until then.
 * Everything Modernist is set in Archivo, so nothing should paint in a
 * fallback font first. Once fonts are ready the native splash is dismissed
 * (revealing the branded splash beneath it), but the branded splash itself
 * keeps showing until MIN_SPLASH_DURATION_MS has elapsed, so it doesn't just
 * flash by on a fast device.
 */
export function FontGate({ children }: PropsWithChildren) {
  const fontsLoaded = useAppFonts();
  const [minDurationElapsed, setMinDurationElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setMinDurationElapsed(true),
      MIN_SPLASH_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !minDurationElapsed) return <AppSplashScreen />;
  return <>{children}</>;
}
