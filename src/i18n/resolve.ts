/**
 * Pure language-resolution logic, separated from i18next/expo-localization so it
 * can be unit-tested without the native modules.
 */

export const SUPPORTED_LANGUAGES = ['en', 'ur'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';

const RTL_LANGUAGES = new Set<SupportedLanguage>(['ur']);

export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);
}

/**
 * Pick the best supported language from an ordered list of device locale tags
 * (most-preferred first), falling back when none match.
 */
export function resolveLanguage(
  localeTags: readonly (string | null | undefined)[],
  fallback: SupportedLanguage = FALLBACK_LANGUAGE,
): SupportedLanguage {
  for (const tag of localeTags) {
    if (!tag) continue;
    const primary = tag.split('-')[0]?.toLowerCase();
    if (primary && isSupportedLanguage(primary)) return primary;
  }
  return fallback;
}

export function isRTL(lang: SupportedLanguage): boolean {
  return RTL_LANGUAGES.has(lang);
}
