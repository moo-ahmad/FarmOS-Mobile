import { describe, expect, it } from '@jest/globals';

import { parseRouteId } from '@/lib/route-params';

import {
  emptyToNull,
  isDecimalBetween,
  isLocalDate,
  isNonNegativeMoney,
  isPositiveMoney,
  todayLocalDate,
} from './rules';

describe('form rules', () => {
  it('checks money without JS number parsing', () => {
    expect(isPositiveMoney('0.01')).toBe(true);
    expect(isPositiveMoney('0')).toBe(false);
    expect(isPositiveMoney('abc')).toBe(false);
    expect(isNonNegativeMoney('0')).toBe(true);
    expect(isNonNegativeMoney('-0.01')).toBe(false);
  });

  it('bounds a decimal inclusively', () => {
    expect(isDecimalBetween('100', '0', '100')).toBe(true);
    expect(isDecimalBetween('100.0001', '0', '100')).toBe(false);
  });

  it('accepts only real YYYY-MM-DD dates', () => {
    expect(isLocalDate('2028-02-29')).toBe(true);
    expect(isLocalDate('2026-02-29')).toBe(false);
    expect(isLocalDate('2026-1-05')).toBe(false);
  });

  it('formats today in device-local time', () => {
    expect(todayLocalDate(new Date(2026, 10, 14, 23, 59))).toBe('2026-11-14');
  });

  it('turns blank text into null', () => {
    expect(emptyToNull('  ')).toBeNull();
    expect(emptyToNull(' x ')).toBe('x');
  });
});

describe('parseRouteId', () => {
  it.each([
    ['12', 12],
    ['0', undefined],
    ['abc', undefined],
    ['1.5', undefined],
    [undefined, undefined],
  ])('parses %p as %p', (input, expected) => {
    expect(parseRouteId(input)).toBe(expected);
  });

  it('takes the first value of a repeated param', () => {
    expect(parseRouteId(['7', '8'])).toBe(7);
  });
});
