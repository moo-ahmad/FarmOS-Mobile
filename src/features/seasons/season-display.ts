import type { Season, SeasonFilter } from './model';

const MS_PER_DAY = 86_400_000;

function toUtcMs(date: string): number {
  const [year = 0, month = 1, day = 1] = date.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

/** Days from start to end, counting both the first and the last day. */
export function seasonDurationDays(season: Season): number {
  return (
    Math.round(
      (toUtcMs(season.endDate) - toUtcMs(season.startDate)) / MS_PER_DAY,
    ) + 1
  );
}

export function seasonDateRangeLabel(season: Season): string {
  return `${season.startDate} → ${season.endDate} · ${seasonDurationDays(season)} days`;
}

export function filterSeasons(
  seasons: readonly Season[],
  filter: SeasonFilter,
): Season[] {
  return filter === 'all'
    ? [...seasons]
    : seasons.filter((season) => season.status === filter);
}
