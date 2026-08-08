import { describe, expect, it } from '@jest/globals';

import { computeSafeHarvestDate, lookupPhiDays } from './phi';

describe('lookupPhiDays', () => {
  it('finds a known product', () => {
    expect(lookupPhiDays('Emamectin 1.9EC')).toBe(7);
  });

  it('matches case-insensitively and trims whitespace', () => {
    expect(lookupPhiDays('  emamectin 1.9ec  ')).toBe(7);
  });

  it('returns undefined for an unknown product', () => {
    expect(lookupPhiDays('Some Unlisted Product')).toBeUndefined();
    expect(lookupPhiDays('')).toBeUndefined();
  });
});

describe('computeSafeHarvestDate', () => {
  it('adds the PHI days to the occurred-at instant', () => {
    expect(computeSafeHarvestDate('2026-04-14T06:00:00.000Z', 7)).toBe(
      '2026-04-21T06:00:00.000Z',
    );
  });

  it('handles a zero-day PHI', () => {
    expect(computeSafeHarvestDate('2026-04-14T06:00:00.000Z', 0)).toBe(
      '2026-04-14T06:00:00.000Z',
    );
  });
});
