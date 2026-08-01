import { describe, expect, it } from '@jest/globals';

import { backoffDelayMs, buildAuthHeaders, isUnauthorized } from './policy';

describe('http policy', () => {
  describe('buildAuthHeaders', () => {
    it('includes bearer token and farm id when present', () => {
      expect(
        buildAuthHeaders({ accessToken: 'abc', farmId: 'farm-1' }),
      ).toEqual({
        Authorization: 'Bearer abc',
        'X-Farm-Id': 'farm-1',
      });
    });

    it('omits headers that are null', () => {
      expect(buildAuthHeaders({ accessToken: null, farmId: null })).toEqual({});
      expect(buildAuthHeaders({ accessToken: 'abc', farmId: null })).toEqual({
        Authorization: 'Bearer abc',
      });
    });
  });

  describe('isUnauthorized', () => {
    it('is true only for 401', () => {
      expect(isUnauthorized(401)).toBe(true);
      expect(isUnauthorized(403)).toBe(false);
      expect(isUnauthorized(200)).toBe(false);
    });
  });

  describe('backoffDelayMs', () => {
    it('grows exponentially and stays within [exp/2, exp]', () => {
      // With random()=1 the delay is the full exp; with random()=0 it's exp/2.
      expect(backoffDelayMs(1, 300, 10_000, () => 0)).toBe(150);
      expect(backoffDelayMs(1, 300, 10_000, () => 1)).toBe(300);
      expect(backoffDelayMs(2, 300, 10_000, () => 0)).toBe(300);
      expect(backoffDelayMs(3, 300, 10_000, () => 1)).toBe(1200);
    });

    it('respects the cap', () => {
      expect(backoffDelayMs(20, 300, 10_000, () => 1)).toBe(10_000);
    });
  });
});
