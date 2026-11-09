import type {
  ExistingSeason,
  SeasonFormErrors,
  SeasonFormValues,
  SeasonKind,
} from './model';

const MS_PER_DAY = 86_400_000;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const KIND_LETTER: Record<SeasonKind, string> = {
  Rabi: 'R',
  Kharif: 'K',
  Annual: 'A',
  Perennial: 'P',
};

function parseDate(value: string): number | null {
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;
  const [year, month, day] = [
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
  ];
  const ms = Date.UTC(year, month - 1, day);
  const d = new Date(ms);
  const valid =
    d.getUTCFullYear() === year &&
    d.getUTCMonth() === month - 1 &&
    d.getUTCDate() === day;
  return valid ? ms : null;
}

const yearOf = (date: string) => Number(date.slice(0, 4));
const yy = (year: number) => String(year % 100).padStart(2, '0');

/** Typical dates for a season type starting in `year`. */
export function defaultDates(
  kind: SeasonKind,
  year: number,
): { startDate: string; endDate: string } {
  switch (kind) {
    case 'Rabi':
      return { startDate: `${year}-11-01`, endDate: `${year + 1}-04-30` };
    case 'Kharif':
      return { startDate: `${year}-05-01`, endDate: `${year}-10-31` };
    case 'Annual':
    case 'Perennial':
      return { startDate: `${year}-01-01`, endDate: `${year}-12-31` };
  }
}

/** "Rabi 2026-27" for Rabi (it spans two calendar years), else "Kharif 2025". */
export function suggestName(kind: SeasonKind, startDate: string): string {
  const year = yearOf(startDate);
  return kind === 'Rabi'
    ? `${kind} ${year}-${yy(year + 1)}`
    : `${kind} ${year}`;
}

/**
 * Suffix appended to cycle codes: the type letter plus the years in the name
 * ("Rabi 2025-26" → R2526, "Kharif 2025" → K25). Falls back to the start year
 * when the name carries none.
 */
export function codeSuffix(
  kind: SeasonKind,
  name: string,
  startDate: string,
): string {
  const letter = KIND_LETTER[kind];
  const match = /(\d{4})(?:-(\d{2}))?/.exec(name);
  if (match) return `${letter}${yy(Number(match[1]))}${match[2] ?? ''}`;
  const year = parseDate(startDate) === null ? null : yearOf(startDate);
  return year === null ? letter : `${letter}${yy(year)}`;
}

/** Inclusive day count, or null when either date is invalid or reversed. */
export function durationDays(
  startDate: string,
  endDate: string,
): number | null {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (start === null || end === null || start > end) return null;
  return Math.round((end - start) / MS_PER_DAY) + 1;
}

/** A same-type season whose dates intersect the given range, if any. */
export function findOverlap(
  existing: readonly ExistingSeason[],
  values: SeasonFormValues,
  excludeId?: string,
): ExistingSeason | undefined {
  if (durationDays(values.startDate, values.endDate) === null) return undefined;
  return existing.find(
    (season) =>
      season.id !== excludeId &&
      season.kind === values.kind &&
      values.startDate <= season.endDate &&
      values.endDate >= season.startDate,
  );
}

export function validateSeason(
  values: SeasonFormValues,
  existing: readonly ExistingSeason[],
  excludeId?: string,
): SeasonFormErrors {
  const errors: SeasonFormErrors = {};
  const name = values.name.trim();

  if (!name) {
    errors.name = 'Enter a season name';
  } else if (
    existing.some(
      (season) =>
        season.id !== excludeId &&
        season.name.trim().toLowerCase() === name.toLowerCase(),
    )
  ) {
    errors.name = `A season named '${name}' already exists on this farm.`;
  }

  const start = parseDate(values.startDate);
  const end = parseDate(values.endDate);
  if (start === null) errors.startDate = 'Use the format YYYY-MM-DD';
  if (end === null) errors.endDate = 'Use the format YYYY-MM-DD';
  if (start !== null && end !== null && start > end) {
    errors.endDate = 'StartDate must not be after EndDate.';
  }

  return errors;
}
