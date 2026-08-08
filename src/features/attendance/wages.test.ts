import { describe, expect, it } from '@jest/globals';

import { moneyToString, toMoney } from '@/lib/decimal';

import type { Worker } from './fixtures';
import { computeWagesTotal, countPresent } from './wages';

const workers: Worker[] = [
  {
    id: 'a',
    initials: 'AS',
    name: 'A',
    employment: 'Permanent',
    dailyRate: toMoney('12'),
    defaultStatus: 'full',
  },
  {
    id: 'b',
    initials: 'BA',
    name: 'B',
    employment: 'Seasonal',
    dailyRate: toMoney('9'),
    defaultStatus: 'full',
  },
  {
    id: 'c',
    initials: 'FA',
    name: 'C',
    employment: 'Daily wage',
    dailyRate: toMoney('9'),
    defaultStatus: 'half',
  },
  {
    id: 'd',
    initials: 'KA',
    name: 'D',
    employment: 'Daily wage',
    dailyRate: toMoney('9'),
    defaultStatus: 'absent',
  },
];

describe('computeWagesTotal', () => {
  // Note: the design's headline "$43.50" reflects a fuller 8-worker roster
  // ("6 / 8" in the header); our fixtures only cover the 4 workers actually
  // drawn in the mock, so this checks the arithmetic against those 4, not
  // that headline figure.
  it("sums each worker's rate × status multiplier: 12 + 9 + 4.50 + 0 = 25.50", () => {
    const statuses = { a: 'full', b: 'full', c: 'half', d: 'absent' } as const;
    expect(moneyToString(computeWagesTotal(workers, statuses))).toBe('25.50');
  });

  it('treats a worker missing from the status map as absent', () => {
    expect(moneyToString(computeWagesTotal(workers, {}))).toBe('0.00');
  });

  it('all present at full pay', () => {
    const statuses = { a: 'full', b: 'full', c: 'full', d: 'full' } as const;
    expect(moneyToString(computeWagesTotal(workers, statuses))).toBe('39.00');
  });
});

describe('countPresent', () => {
  it('counts full and half as present, excludes absent', () => {
    const statuses = { a: 'full', b: 'full', c: 'half', d: 'absent' } as const;
    expect(countPresent(workers, statuses)).toBe(3);
  });
});
