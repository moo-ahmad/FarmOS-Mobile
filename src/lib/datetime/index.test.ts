import { describe, expect, it } from '@jest/globals';

import { formatInTimeZone, nowUtc, parseUtc, toUtcIso } from './index';

describe('datetime', () => {
  it('nowUtc returns an ISO-8601 UTC string', () => {
    expect(nowUtc()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('toUtcIso round-trips through parseUtc', () => {
    const date = new Date('2026-08-01T12:34:56.000Z');
    expect(parseUtc(toUtcIso(date)).getTime()).toBe(date.getTime());
  });

  it('parseUtc throws on an invalid value', () => {
    expect(() => parseUtc('not-a-date')).toThrow(RangeError);
  });

  it('formatInTimeZone renders a UTC instant in the farm timezone', () => {
    // 00:30 UTC is 05:30 in Asia/Karachi (UTC+5, no DST).
    expect(
      formatInTimeZone(
        '2026-08-01T00:30:00.000Z',
        'Asia/Karachi',
        'yyyy-MM-dd HH:mm',
      ),
    ).toBe('2026-08-01 05:30');
  });
});
