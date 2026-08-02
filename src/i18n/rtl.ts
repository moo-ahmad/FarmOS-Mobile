import { I18nManager } from 'react-native';

import { isRTL, type SupportedLanguage } from './resolve';

/**
 * Align the native layout direction with the given language.
 *
 * Returns true if the direction *changed* — RN only applies `forceRTL` after a
 * full reload, so the caller is responsible for reloading (e.g. via
 * expo-updates) when this returns true. Called once at startup and on any
 * in-app language switch.
 */
export function syncLayoutDirection(lang: SupportedLanguage): boolean {
  const shouldBeRTL = isRTL(lang);
  I18nManager.allowRTL(true);
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.forceRTL(shouldBeRTL);
    return true;
  }
  return false;
}
