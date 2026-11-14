import { describe, expect, it } from '@jest/globals';

import { irrigationSourceFormSchema } from './schema';
import { toCreateIrrigationSourceBody } from './to-request';

const tubewell = {
  name: 'Main tubewell',
  sourceKind: 'Tubewell',
  costKind: 'PerHour',
  ratePerUnit: '350.50',
  dischargeLpm: '',
} as const;

function issuesFor(values: Record<string, unknown>) {
  const result = irrigationSourceFormSchema.safeParse(values);
  return result.success
    ? {}
    : Object.fromEntries(
        result.error.issues.map((issue) => [
          issue.path.join('.'),
          issue.message,
        ]),
      );
}

describe('irrigationSourceFormSchema', () => {
  it('accepts a paid source with a rate', () => {
    expect(issuesFor(tubewell)).toEqual({});
  });

  it('requires a name', () => {
    expect(issuesFor({ ...tubewell, name: '   ' })).toHaveProperty('name');
  });

  it('requires a rate under a paid cost model', () => {
    expect(issuesFor({ ...tubewell, ratePerUnit: '' })).toEqual({
      ratePerUnit: 'Enter a rate',
    });
  });

  it('rejects a negative or non-numeric rate', () => {
    expect(issuesFor({ ...tubewell, ratePerUnit: '-1' })).toHaveProperty(
      'ratePerUnit',
    );
    expect(issuesFor({ ...tubewell, ratePerUnit: '12abc' })).toHaveProperty(
      'ratePerUnit',
    );
  });

  it('does not need a rate for a free source', () => {
    expect(
      issuesFor({ ...tubewell, costKind: 'Free', ratePerUnit: '' }),
    ).toEqual({});
  });

  it('rejects a zero flow but allows it blank', () => {
    expect(issuesFor({ ...tubewell, dischargeLpm: '0' })).toHaveProperty(
      'dischargeLpm',
    );
    expect(issuesFor({ ...tubewell, dischargeLpm: '' })).toEqual({});
  });
});

describe('toCreateIrrigationSourceBody', () => {
  it('maps kinds to backend wire values and keeps decimals as strings', () => {
    expect(
      toCreateIrrigationSourceBody({ ...tubewell, dischargeLpm: '900' }),
    ).toEqual({
      name: 'Main tubewell',
      sourceType: 36001,
      costModel: 37000,
      ratePerUnit: '350.50',
      dischargeLpm: '900',
      pumpAssetId: null,
    });
  });

  it('sends a zero rate and null flow for a free source with no flow', () => {
    const body = toCreateIrrigationSourceBody({
      ...tubewell,
      sourceKind: 'Rain',
      costKind: 'Free',
      ratePerUnit: '999',
    });
    expect(body.ratePerUnit).toBe('0');
    expect(body.dischargeLpm).toBeNull();
    expect(body.costModel).toBe(37003);
  });
});
