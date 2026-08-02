import {
  Archivo_400Regular,
  Archivo_600SemiBold,
  Archivo_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/archivo';

/**
 * Loads the Archivo family the Modernist system is set in. The whole UI depends
 * on it, so the app holds its first render until this resolves (see FontGate).
 */
export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    Archivo_400Regular,
    Archivo_600SemiBold,
    Archivo_800ExtraBold,
  });
  return loaded;
}
