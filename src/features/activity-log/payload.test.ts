import { describe, expect, it } from '@jest/globals';

import type { ActivityLogRow } from '@/db/schema';

import { toActivityLogSyncPayload } from './payload';

const row: ActivityLogRow = {
  id: '0192f8a0-0000-7000-8000-000000000000',
  farmId: 'farm-1',
  operation: 'spray',
  fieldCode: 'F3',
  cropLabel: 'Wheat · Faisal-11',
  product: 'Emamectin 1.9EC',
  doseValue: '200',
  doseUnit: 'ml',
  waterValue: '120',
  waterUnit: 'L',
  conditionsTempC: 28,
  conditionsWindKph: 8,
  conditionsPpe: true,
  safeHarvestDate: '2026-04-21T06:00:00.000Z',
  phiDays: 7,
  occurredAt: '2026-04-14T06:00:00.000Z',
  clientCreatedAtUtc: '2026-04-14T06:05:00.000Z',
  createdAt: '2026-04-14T06:05:00.000Z',
  updatedAt: '2026-04-14T06:05:00.000Z',
  syncedAt: null,
};

describe('toActivityLogSyncPayload', () => {
  it('maps the row to the wire shape with publicId', () => {
    expect(toActivityLogSyncPayload(row)).toEqual({
      publicId: row.id,
      farmId: 'farm-1',
      operation: 'spray',
      fieldCode: 'F3',
      cropLabel: 'Wheat · Faisal-11',
      product: 'Emamectin 1.9EC',
      doseValue: '200',
      doseUnit: 'ml',
      waterValue: '120',
      waterUnit: 'L',
      conditionsTempC: 28,
      conditionsWindKph: 8,
      conditionsPpe: true,
      safeHarvestDate: '2026-04-21T06:00:00.000Z',
      phiDays: 7,
      occurredAt: '2026-04-14T06:00:00.000Z',
      clientCreatedAtUtc: '2026-04-14T06:05:00.000Z',
    });
  });

  it('keeps decimals as strings and preserves nulls for a non-spray operation', () => {
    const payload = toActivityLogSyncPayload({
      ...row,
      product: null,
      doseValue: null,
      doseUnit: null,
      waterValue: null,
      waterUnit: null,
      safeHarvestDate: null,
      phiDays: null,
    });
    expect(payload.product).toBeNull();
    expect(payload.safeHarvestDate).toBeNull();
    expect(
      typeof payload.doseValue === 'string' || payload.doseValue === null,
    ).toBe(true);
  });
});
