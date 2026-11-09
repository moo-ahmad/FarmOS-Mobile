import { describe, expect, it } from '@jest/globals';

import { existingSeasons } from './fixtures';
import type { SeasonFormValues } from './model';
import {
  codeSuffix,
  defaultDates,
  durationDays,
  findOverlap,
  suggestName,
  validateSeason,
} from './season-rules';

const rabi: SeasonFormValues = {
  kind: 'Rabi',
  name: 'Rabi 2026-27',
  startDate: '2026-11-01',
  endDate: '2027-04-30',
};

describe('defaultDates', () => {
  it('pre-fills typical dates per type', () => {
    expect(defaultDates('Rabi', 2026)).toEqual({
      startDate: '2026-11-01',
      endDate: '2027-04-30',
    });
    expect(defaultDates('Kharif', 2025)).toEqual({
      startDate: '2025-05-01',
      endDate: '2025-10-31',
    });
  });
});

describe('suggestName', () => {
  it('spans two years for Rabi only', () => {
    expect(suggestName('Rabi', '2026-11-01')).toBe('Rabi 2026-27');
    expect(suggestName('Kharif', '2025-05-01')).toBe('Kharif 2025');
  });
});

describe('codeSuffix', () => {
  it('derives from the name', () => {
    expect(codeSuffix('Rabi', 'Rabi 2025-26', '2026-03-01')).toBe('R2526');
    expect(codeSuffix('Rabi', 'Rabi 2026-27', '2026-11-01')).toBe('R2627');
    expect(codeSuffix('Kharif', 'Kharif 2025', '2025-05-01')).toBe('K25');
  });

  it('falls back to the start year when the name has no year', () => {
    expect(codeSuffix('Kharif', 'Early crop', '2025-05-01')).toBe('K25');
  });
});

describe('durationDays', () => {
  it('counts both endpoints', () => {
    expect(durationDays('2026-11-01', '2027-04-30')).toBe(181);
    expect(durationDays('2026-03-01', '2027-04-30')).toBe(426);
  });

  it('is null for invalid or reversed ranges', () => {
    expect(durationDays('2026-03-01', '2026-02-01')).toBeNull();
    expect(durationDays('2026-02-30', '2026-03-01')).toBeNull();
    expect(durationDays('nope', '2026-03-01')).toBeNull();
  });
});

describe('findOverlap', () => {
  it('flags a same-type season that intersects', () => {
    const overlap = findOverlap(existingSeasons, {
      ...rabi,
      startDate: '2026-03-01',
    });
    expect(overlap?.name).toBe('Rabi 2025-26');
  });

  it('ignores other types, non-intersecting ranges and the excluded season', () => {
    expect(findOverlap(existingSeasons, rabi)).toBeUndefined();
    expect(
      findOverlap(existingSeasons, {
        ...rabi,
        kind: 'Kharif',
        startDate: '2025-06-01',
        endDate: '2025-07-01',
      })?.name,
    ).toBe('Kharif 2025');
    expect(
      findOverlap(
        existingSeasons,
        {
          ...rabi,
          name: 'Rabi 2025-26',
          startDate: '2025-11-01',
          endDate: '2026-04-30',
        },
        'season-rabi-2025-26',
      ),
    ).toBeUndefined();
  });
});

describe('validateSeason', () => {
  it('accepts a valid season', () => {
    expect(validateSeason(rabi, existingSeasons)).toEqual({});
  });

  it('rejects duplicate names (case-insensitive) except for the season itself', () => {
    const dup = { ...rabi, name: ' rabi 2025-26 ' };
    expect(validateSeason(dup, existingSeasons).name).toBe(
      "A season named 'rabi 2025-26' already exists on this farm.",
    );
    expect(
      validateSeason(dup, existingSeasons, 'season-rabi-2025-26').name,
    ).toBeUndefined();
  });

  it('requires a name', () => {
    expect(validateSeason({ ...rabi, name: '  ' }, existingSeasons).name).toBe(
      'Enter a season name',
    );
  });

  it('blocks a start date after the end date', () => {
    expect(
      validateSeason(
        { ...rabi, startDate: '2026-03-01', endDate: '2026-02-01' },
        existingSeasons,
      ).endDate,
    ).toBe('StartDate must not be after EndDate.');
  });

  it('rejects malformed dates', () => {
    const errors = validateSeason(
      { ...rabi, startDate: '2026-1-1', endDate: '' },
      existingSeasons,
    );
    expect(errors.startDate).toBeDefined();
    expect(errors.endDate).toBeDefined();
  });
});
