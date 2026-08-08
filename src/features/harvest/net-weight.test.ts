import { describe, expect, it } from '@jest/globals';

import { quantityToString, toQuantity } from '@/lib/decimal';

import { computeNetWeight } from './net-weight';

describe('computeNetWeight', () => {
  it('applies a percentage loss to the gross weight', () => {
    const net = computeNetWeight(toQuantity('6240'), '5');
    expect(quantityToString(net)).toBe('5928');
  });

  it('treats a missing/invalid loss as 0', () => {
    expect(quantityToString(computeNetWeight(toQuantity('100'), ''))).toBe(
      '100',
    );
    expect(quantityToString(computeNetWeight(toQuantity('100'), 'abc'))).toBe(
      '100',
    );
  });

  it('clamps loss to [0, 100]', () => {
    expect(quantityToString(computeNetWeight(toQuantity('100'), '150'))).toBe(
      '0',
    );
    expect(quantityToString(computeNetWeight(toQuantity('100'), '-10'))).toBe(
      '100',
    );
  });
});
