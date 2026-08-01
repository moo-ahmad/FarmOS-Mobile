import { describe, expect, it } from '@jest/globals';

import {
  ZERO_QUANTITY,
  addQuantity,
  compareQuantity,
  equalsQuantity,
  isQuantity,
  parseQuantity,
  scaleQuantity,
  subtractQuantity,
  toQuantity,
} from './quantity';

describe('Quantity', () => {
  describe('construction', () => {
    it('keeps entered precision (no forced scale)', () => {
      expect(toQuantity('3')).toBe('3');
      expect(toQuantity('0.100')).toBe('0.1');
      expect(toQuantity('12.5')).toBe('12.5');
    });

    it('ZERO_QUANTITY is canonical zero', () => {
      expect(ZERO_QUANTITY).toBe('0');
    });
  });

  describe('arithmetic', () => {
    it('adds without float error', () => {
      expect(addQuantity(toQuantity('0.1'), toQuantity('0.2'))).toBe('0.3');
    });

    it('subtracts exactly', () => {
      expect(subtractQuantity(toQuantity('1'), toQuantity('0.3'))).toBe('0.7');
    });

    it('scales by a factor', () => {
      expect(scaleQuantity(toQuantity('2'), '0.5')).toBe('1');
      expect(scaleQuantity(toQuantity('1.5'), '3')).toBe('4.5');
    });
  });

  describe('compare / equals', () => {
    it('compares by numeric value', () => {
      expect(compareQuantity(toQuantity('1'), toQuantity('2'))).toBe(-1);
      expect(compareQuantity(toQuantity('2'), toQuantity('1'))).toBe(1);
      expect(compareQuantity(toQuantity('1'), toQuantity('1.0'))).toBe(0);
    });

    it('treats equal values as equal regardless of input scale', () => {
      expect(equalsQuantity(toQuantity('1'), toQuantity('1.000'))).toBe(true);
    });
  });

  describe('parseQuantity / isQuantity (boundary guards)', () => {
    it('rejects non-strings and garbage', () => {
      expect(() => parseQuantity(3)).toThrow(TypeError);
      expect(() => parseQuantity('abc')).toThrow();
      expect(() => parseQuantity('')).toThrow();
    });

    it('isQuantity reflects parseability', () => {
      expect(isQuantity('3.5')).toBe(true);
      expect(isQuantity('abc')).toBe(false);
      expect(isQuantity(3.5)).toBe(false);
    });
  });
});
