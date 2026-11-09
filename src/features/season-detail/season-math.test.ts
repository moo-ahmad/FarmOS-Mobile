import { describe, expect, it } from '@jest/globals';

import { toMoney } from '@/lib/decimal';

import { seasonDetails } from './fixtures';
import {
  formatProfit,
  seasonDateRangeLabel,
  seasonProfit,
  unclosedCycles,
  unclosedCyclesSummary,
} from './season-math';

const rabi = seasonDetails[0]!;
const kharif = seasonDetails[1]!;

describe('seasonDateRangeLabel', () => {
  it('counts both endpoints', () => {
    expect(seasonDateRangeLabel(rabi)).toBe(
      '2025-11-01 → 2026-04-30 · 181 days',
    );
    expect(seasonDateRangeLabel(kharif)).toBe(
      '2025-05-01 → 2025-10-31 · 184 days',
    );
  });
});

describe('seasonProfit / formatProfit', () => {
  it('is revenue minus cost', () => {
    expect(formatProfit(seasonProfit(rabi))).toBe('$2,002');
    expect(formatProfit(seasonProfit(kharif))).toBe('$0');
  });

  it('marks losses with a minus sign', () => {
    expect(formatProfit(toMoney('-840'))).toBe('−$840');
  });
});

describe('unclosedCycles', () => {
  it('lists cycles that are not Closed', () => {
    expect(unclosedCycles(rabi.cycles)).toHaveLength(2);
    expect(unclosedCycles(kharif.cycles)).toHaveLength(0);
  });

  it('summarises them for the close warning', () => {
    expect(unclosedCyclesSummary(rabi.cycles)).toBe(
      'F3 Wheat (Active) and F2 Mustard (Harvested)',
    );
    expect(unclosedCyclesSummary(rabi.cycles.slice(0, 1))).toBe(
      'F3 Wheat (Active)',
    );
    expect(unclosedCyclesSummary([])).toBe('');
  });
});
