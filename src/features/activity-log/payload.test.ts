import { describe, expect, it } from '@jest/globals';

import type { ActivityLogRow } from '@/db/schema';

import { toActivityLogSyncPayload } from './payload';

const row: ActivityLogRow = {
  id: '0192f8a0-0000-7000-8000-000000000000',
  farmId: 'farm-1',
  activityType: 'harvest',
  quantity: '12.50',
  unit: 'kg',
  cost: '340.00',
  notes: 'north field',
  occurredAt: '2026-08-01T06:00:00.000Z',
  clientCreatedAtUtc: '2026-08-01T06:05:00.000Z',
  createdAt: '2026-08-01T06:05:00.000Z',
  updatedAt: '2026-08-01T06:05:00.000Z',
  syncedAt: null,
};

describe('toActivityLogSyncPayload', () => {
  it('maps the row to the wire shape with publicId', () => {
    expect(toActivityLogSyncPayload(row)).toEqual({
      publicId: row.id,
      farmId: 'farm-1',
      activityType: 'harvest',
      quantity: '12.50',
      unit: 'kg',
      cost: '340.00',
      notes: 'north field',
      occurredAt: '2026-08-01T06:00:00.000Z',
      clientCreatedAtUtc: '2026-08-01T06:05:00.000Z',
    });
  });

  it('keeps decimals as strings and preserves a null cost', () => {
    const payload = toActivityLogSyncPayload({ ...row, cost: null });
    expect(payload.cost).toBeNull();
    expect(typeof payload.quantity).toBe('string');
  });
});
