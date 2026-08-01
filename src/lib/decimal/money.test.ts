import { describe, expect, it } from '@jest/globals';

import {
  ZERO_MONEY,
  addMoney,
  compareMoney,
  equalsMoney,
  isMoney,
  lineTotal,
  parseMoney,
  scaleMoney,
  subtractMoney,
  toMoney,
} from './index';
import { toQuantity } from './quantity';

describe('Money', () => {
  describe('construction and normalization', () => {
    it('normalizes to two decimal places', () => {
      expect(toMoney('1')).toBe('1.00');
      expect(toMoney('1.5')).toBe('1.50');
      expect(toMoney('0')).toBe('0.00');
    });

    it('rounds HALF_UP without float error (1.005 → 1.01, not 1.00)', () => {
      // (1.005).toFixed(2) in plain JS is '1.00' because of IEEE-754.
      expect(toMoney('1.005')).toBe('1.01');
      expect(toMoney('2.675')).toBe('2.68');
    });

    it('ZERO_MONEY is canonical zero', () => {
      expect(ZERO_MONEY).toBe('0.00');
    });
  });

  describe('addMoney', () => {
    it('does not suffer the 0.1 + 0.2 float bug', () => {
      // 0.1 + 0.2 === 0.30000000000000004 as JS numbers.
      expect(addMoney(toMoney('0.1'), toMoney('0.2'))).toBe('0.30');
    });

    it('adds larger values exactly', () => {
      expect(addMoney(toMoney('19999999999999.99'), toMoney('0.01'))).toBe(
        '20000000000000.00',
      );
    });
  });

  describe('subtractMoney', () => {
    it('subtracts exactly', () => {
      expect(subtractMoney(toMoney('0.30'), toMoney('0.10'))).toBe('0.20');
    });
  });

  describe('scaleMoney', () => {
    it('scales by a decimal factor and re-rounds', () => {
      expect(scaleMoney(toMoney('0.10'), '3')).toBe('0.30');
      expect(scaleMoney(toMoney('10.00'), '0.075')).toBe('0.75');
    });
  });

  describe('lineTotal', () => {
    it('multiplies a unit price by a quantity', () => {
      expect(lineTotal(toMoney('2.50'), toQuantity('3'))).toBe('7.50');
      expect(lineTotal(toMoney('1.99'), toQuantity('0.5'))).toBe('1.00'); // 0.995 → 1.00
    });
  });

  describe('compare / equals', () => {
    it('compares by numeric value', () => {
      expect(compareMoney(toMoney('0.10'), toMoney('0.20'))).toBe(-1);
      expect(compareMoney(toMoney('0.20'), toMoney('0.10'))).toBe(1);
      expect(compareMoney(toMoney('0.10'), toMoney('0.10'))).toBe(0);
    });

    it('treats equal values as equal regardless of input scale', () => {
      expect(equalsMoney(toMoney('1.1'), toMoney('1.10'))).toBe(true);
    });
  });

  describe('parseMoney / isMoney (boundary guards)', () => {
    it('parses valid decimal strings', () => {
      expect(parseMoney('42.5')).toBe('42.50');
    });

    it('rejects non-strings (e.g. a JSON float that slipped through)', () => {
      expect(() => parseMoney(42.5)).toThrow(TypeError);
      expect(() => parseMoney(null)).toThrow(TypeError);
      expect(() => parseMoney(undefined)).toThrow(TypeError);
    });

    it('rejects garbage and non-finite strings', () => {
      expect(() => parseMoney('abc')).toThrow();
      expect(() => parseMoney('')).toThrow();
      expect(() => parseMoney('NaN')).toThrow();
      expect(() => parseMoney('Infinity')).toThrow();
    });

    it('isMoney reflects parseability', () => {
      expect(isMoney('1.23')).toBe(true);
      expect(isMoney('abc')).toBe(false);
      expect(isMoney(1.23)).toBe(false);
    });
  });
});
