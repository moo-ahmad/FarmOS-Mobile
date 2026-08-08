import { describe, expect, it } from '@jest/globals';

import { toMoney } from './money';
import { formatMoneyDisplay } from './format';

describe('formatMoneyDisplay', () => {
  it('adds thousands separators and drops a trailing .00', () => {
    expect(formatMoneyDisplay(toMoney('1840'))).toBe('1,840');
    expect(formatMoneyDisplay(toMoney('9062'))).toBe('9,062');
    expect(formatMoneyDisplay(toMoney('48320'))).toBe('48,320');
  });

  it('keeps real cents at exactly 2 decimal places', () => {
    expect(formatMoneyDisplay(toMoney('0.82'))).toBe('0.82');
    expect(formatMoneyDisplay(toMoney('1.45'))).toBe('1.45');
    expect(formatMoneyDisplay(toMoney('0.80'))).toBe('0.80');
  });

  it('handles zero', () => {
    expect(formatMoneyDisplay(toMoney('0'))).toBe('0');
  });

  it('handles negative amounts', () => {
    expect(formatMoneyDisplay(toMoney('-540'))).toBe('-540');
  });
});
