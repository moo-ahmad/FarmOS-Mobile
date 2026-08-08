import type { ActivityLogRow } from '@/db/schema';

/**
 * Wire shape for an activity-log create operation, as JSON-encoded into the
 * outbox and later sent to `POST /sync/batch`. Decimals stay strings.
 * `publicId` is the client-generated UUIDv7 that becomes the server PublicId.
 */
export interface ActivityLogSyncPayload {
  publicId: string;
  farmId: string;
  operation: string;
  fieldCode: string;
  cropLabel: string;
  product: string | null;
  doseValue: string | null;
  doseUnit: string | null;
  waterValue: string | null;
  waterUnit: string | null;
  conditionsTempC: number | null;
  conditionsWindKph: number | null;
  conditionsPpe: boolean | null;
  safeHarvestDate: string | null;
  phiDays: number | null;
  occurredAt: string;
  clientCreatedAtUtc: string;
}

export function toActivityLogSyncPayload(
  row: ActivityLogRow,
): ActivityLogSyncPayload {
  return {
    publicId: row.id,
    farmId: row.farmId,
    operation: row.operation,
    fieldCode: row.fieldCode,
    cropLabel: row.cropLabel,
    product: row.product,
    doseValue: row.doseValue,
    doseUnit: row.doseUnit,
    waterValue: row.waterValue,
    waterUnit: row.waterUnit,
    conditionsTempC: row.conditionsTempC,
    conditionsWindKph: row.conditionsWindKph,
    conditionsPpe: row.conditionsPpe,
    safeHarvestDate: row.safeHarvestDate,
    phiDays: row.phiDays,
    occurredAt: row.occurredAt,
    clientCreatedAtUtc: row.clientCreatedAtUtc,
  };
}
