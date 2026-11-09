import { describe, expect, it } from '@jest/globals';

import { toMoney, toQuantity } from '@/lib/decimal';

import type { Season } from './model';
import {
  filterSeasons,
  seasonDateRangeLabel,
  seasonDurationDays,
} from './season-display';

const base: Season = {
  id: 's',
  name: 'Rabi 2025-26',
  type: 'Rabi',
  status: 'open',
  startDate: '2025-11-01',
  endDate: '2026-04-30',
  cycleCount: 0,
  plantedHectares: toQuantity('0'),
  cost: toMoney('0'),
  revenue: toMoney('0'),
  codeSuffix: 'R2526',
};

describe('seasonDurationDays', () => {
  it('counts both endpoints', () => {
    expect(seasonDurationDays(base)).toBe(181);
    expect(
      seasonDurationDays({
        ...base,
        startDate: '2025-05-01',
        endDate: '2025-10-31',
      }),
    ).toBe(184);
  });

  it('is 1 for a single-day season', () => {
    expect(
      seasonDurationDays({
        ...base,
        startDate: '2026-01-01',
        endDate: '2026-01-01',
      }),
    ).toBe(1);
  });
});

describe('seasonDateRangeLabel', () => {
  it('formats the range and duration', () => {
    expect(seasonDateRangeLabel(base)).toBe(
      '2025-11-01 → 2026-04-30 · 181 days',
    );
  });
});

describe('filterSeasons', () => {
  const closed: Season = { ...base, id: 'c', status: 'closed' };

  it('returns everything for "all"', () => {
    expect(filterSeasons([base, closed], 'all')).toHaveLength(2);
  });

  it('narrows to open or closed', () => {
    expect(filterSeasons([base, closed], 'open')).toEqual([base]);
    expect(filterSeasons([base, closed], 'closed')).toEqual([closed]);
  });
});
