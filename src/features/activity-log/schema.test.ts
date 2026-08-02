import { describe, expect, it } from '@jest/globals';

import { activityLogFormSchema } from './schema';

const valid = {
  activityType: 'fertilizer',
  quantity: '12.5',
  unit: 'kg',
  cost: '340.00',
  notes: 'Urea, north field',
};

describe('activityLogFormSchema', () => {
  it('accepts a valid entry', () => {
    const result = activityLogFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('accepts a missing/empty cost (optional)', () => {
    expect(
      activityLogFormSchema.safeParse({ ...valid, cost: '' }).success,
    ).toBe(true);
    const { cost: _cost, ...noCost } = valid;
    expect(activityLogFormSchema.safeParse(noCost).success).toBe(true);
  });

  it('rejects a non-numeric quantity', () => {
    const result = activityLogFormSchema.safeParse({
      ...valid,
      quantity: 'abc',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('validation.positiveNumber');
    }
  });

  it('rejects a zero or negative quantity', () => {
    expect(
      activityLogFormSchema.safeParse({ ...valid, quantity: '0' }).success,
    ).toBe(false);
    expect(
      activityLogFormSchema.safeParse({ ...valid, quantity: '-1' }).success,
    ).toBe(false);
  });

  it('rejects an invalid cost', () => {
    expect(
      activityLogFormSchema.safeParse({ ...valid, cost: 'free' }).success,
    ).toBe(false);
  });

  it('rejects an unknown activity type or unit', () => {
    expect(
      activityLogFormSchema.safeParse({ ...valid, activityType: 'dancing' })
        .success,
    ).toBe(false);
    expect(
      activityLogFormSchema.safeParse({ ...valid, unit: 'furlong' }).success,
    ).toBe(false);
  });
});
