import {
  compareMoney,
  formatMoneyDisplay,
  scaleMoney,
  subtractMoney,
  ZERO_MONEY,
  type Money,
} from '@/lib/decimal';

import type { SeasonCycle, SeasonDetail } from './model';

const MS_PER_DAY = 86_400_000;

function toUtcMs(date: string): number {
  const [year = 0, month = 1, day = 1] = date.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

/** Days from start to end, counting both the first and the last day. */
export function seasonDurationDays(season: SeasonDetail): number {
  return (
    Math.round(
      (toUtcMs(season.endDate) - toUtcMs(season.startDate)) / MS_PER_DAY,
    ) + 1
  );
}

export function seasonDateRangeLabel(season: SeasonDetail): string {
  return `${season.startDate} → ${season.endDate} · ${seasonDurationDays(season)} days`;
}

export function seasonProfit(season: SeasonDetail): Money {
  return subtractMoney(season.revenue, season.cost);
}

/** "$2,002", or "−$840" for a loss. */
export function formatProfit(profit: Money): string {
  return compareMoney(profit, ZERO_MONEY) < 0
    ? `−$${formatMoneyDisplay(scaleMoney(profit, -1))}`
    : `$${formatMoneyDisplay(profit)}`;
}

export function unclosedCycles(cycles: readonly SeasonCycle[]): SeasonCycle[] {
  return cycles.filter((cycle) => cycle.status !== 'Closed');
}

/** "F3 Wheat (Active) and F2 Mustard (Harvested)". */
export function unclosedCyclesSummary(cycles: readonly SeasonCycle[]): string {
  const parts = unclosedCycles(cycles).map((cycle) => {
    const crop = cycle.title.split(' · ')[0] ?? cycle.title;
    return `${cycle.fieldCode} ${crop} (${cycle.status})`;
  });
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}
