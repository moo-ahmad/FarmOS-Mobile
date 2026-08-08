import { describe, expect, it } from '@jest/globals';

import { activityLogFormSchema } from './schema';

const validSpray = {
  operation: 'spray',
  fieldCode: 'F3',
  cropLabel: 'Wheat · Faisal-11',
  product: 'Emamectin 1.9EC',
  doseValue: '200',
  waterValue: '120',
};

describe('activityLogFormSchema', () => {
  it('accepts a valid spray entry', () => {
    expect(activityLogFormSchema.safeParse(validSpray).success).toBe(true);
  });

  it('accepts a non-spray operation without product/dose/water', () => {
    const result = activityLogFormSchema.safeParse({
      operation: 'irrigation',
      fieldCode: 'F1',
      cropLabel: 'Cotton · IUB-13',
    });
    expect(result.success).toBe(true);
  });

  it('requires product/dose/water for a spray', () => {
    const result = activityLogFormSchema.safeParse({
      operation: 'spray',
      fieldCode: 'F3',
      cropLabel: 'Wheat · Faisal-11',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path[0]);
      expect(paths).toEqual(
        expect.arrayContaining(['product', 'doseValue', 'waterValue']),
      );
    }
  });

  it('rejects a zero or non-numeric dose', () => {
    expect(
      activityLogFormSchema.safeParse({ ...validSpray, doseValue: '0' })
        .success,
    ).toBe(false);
    expect(
      activityLogFormSchema.safeParse({ ...validSpray, doseValue: 'abc' })
        .success,
    ).toBe(false);
  });

  it('requires a field/crop selection', () => {
    const result = activityLogFormSchema.safeParse({
      operation: 'weeding',
      fieldCode: '',
      cropLabel: '',
    });
    expect(result.success).toBe(false);
  });
});
