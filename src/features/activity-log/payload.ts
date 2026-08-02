import type { ActivityLogRow } from '@/db/schema';

/**
 * Wire shape for an activity-log create operation, as JSON-encoded into the
 * outbox and later sent to `POST /sync/batch`. Decimals stay strings.
 * `publicId` is the client-generated UUIDv7 that becomes the server PublicId.
 */
export interface ActivityLogSyncPayload {
  publicId: string;
  farmId: string;
  activityType: string;
  quantity: string;
  unit: string;
  cost: string | null;
  notes: string | null;
  occurredAt: string;
  clientCreatedAtUtc: string;
}

export function toActivityLogSyncPayload(
  row: ActivityLogRow,
): ActivityLogSyncPayload {
  return {
    publicId: row.id,
    farmId: row.farmId,
    activityType: row.activityType,
    quantity: row.quantity,
    unit: row.unit,
    cost: row.cost,
    notes: row.notes,
    occurredAt: row.occurredAt,
    clientCreatedAtUtc: row.clientCreatedAtUtc,
  };
}
