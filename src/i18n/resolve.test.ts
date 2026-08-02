import { describe, expect, it } from '@jest/globals';

import {
  FALLBACK_LANGUAGE,
  isRTL,
  isSupportedLanguage,
  resolveLanguage,
} from './resolve';

describe('i18n language resolution', () => {
  describe('resolveLanguage', () => {
    it('matches on the primary subtag', () => {
      expect(resolveLanguage(['ur-PK'])).toBe('ur');
      expect(resolveLanguage(['en-US'])).toBe('en');
    });

    it('respects device preference order', () => {
      expect(resolveLanguage(['fr-FR', 'ur-PK', 'en-US'])).toBe('ur');
    });

    it('falls back when nothing is supported', () => {
      expect(resolveLanguage(['fr', 'de'])).toBe(FALLBACK_LANGUAGE);
      expect(resolveLanguage([])).toBe('en');
    });

    it('ignores null/empty tags', () => {
      expect(resolveLanguage([null, undefined, '', 'ur'])).toBe('ur');
    });
  });

  describe('isSupportedLanguage', () => {
    it('recognizes supported languages only', () => {
      expect(isSupportedLanguage('en')).toBe(true);
      expect(isSupportedLanguage('ur')).toBe(true);
      expect(isSupportedLanguage('fr')).toBe(false);
    });
  });

  describe('isRTL', () => {
    it('is true for Urdu, false for English', () => {
      expect(isRTL('ur')).toBe(true);
      expect(isRTL('en')).toBe(false);
    });
  });
});
