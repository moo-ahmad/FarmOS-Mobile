import { describe, expect, it } from '@jest/globals';

import { isAccessTokenExpired } from './expiry';

describe('isAccessTokenExpired', () => {
  const now = 1_000_000;

  it('treats unknown expiry as not expired', () => {
    expect(isAccessTokenExpired(undefined, now)).toBe(false);
  });

  it('is false well before expiry', () => {
    expect(isAccessTokenExpired(now + 60_000, now)).toBe(false);
  });

  it('is true past expiry', () => {
    expect(isAccessTokenExpired(now - 1, now)).toBe(true);
  });

  it('refreshes early within the skew window', () => {
    // 10s before expiry with a 30s skew → already considered expired.
    expect(isAccessTokenExpired(now + 10_000, now, 30_000)).toBe(true);
    expect(isAccessTokenExpired(now + 40_000, now, 30_000)).toBe(false);
  });
});
