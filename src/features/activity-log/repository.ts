import { desc, eq } from 'drizzle-orm';

import { getDb } from '@/db/client';
import { activityLogs, outbox, type ActivityLogRow } from '@/db/schema';
import { nowUtc } from '@/lib/datetime';
import { quantityToString, toQuantity } from '@/lib/decimal';
import { newId } from '@/lib/ids';

import { currentConditions } from './fixtures';
import { DOSE_UNIT, requiresSprayDetails, WATER_UNIT } from './model';
import { toActivityLogSyncPayload } from './payload';
import { computeSafeHarvestDate, lookupPhiDays } from './phi';
import type { ActivityLogFormValues } from './schema';

const ENTITY_TYPE = 'activity_log';

export interface CreateActivityLogInput extends ActivityLogFormValues {
  farmId: string;
  /** Defaults to now (UTC). */
  occurredAt?: string;
}

/**
 * Persist an activity log the offline-first way: write the domain row and its
 * outbox operation in a single transaction, so a row is never left un-synced
 * and the outbox never references a row that doesn't exist. The sync engine
 * drains the outbox to the server separately.
 *
 * For a spray, computes and stores the safe-harvest date/PHI at save time
 * (not re-derived later) so historical rows stay correct if the PHI lookup
 * table changes.
 */
export async function createActivityLog(
  input: CreateActivityLogInput,
): Promise<ActivityLogRow> {
  const now = nowUtc();
  const occurredAt = input.occurredAt ?? now;
  const isSpray = requiresSprayDetails(input.operation);
  const product = isSpray ? (input.product?.trim() ?? null) : null;
  const phiDays = product ? (lookupPhiDays(product) ?? null) : null;

  const row: ActivityLogRow = {
    id: newId(),
    farmId: input.farmId,
    operation: input.operation,
    fieldCode: input.fieldCode,
    cropLabel: input.cropLabel,
    product,
    doseValue:
      isSpray && input.doseValue
        ? quantityToString(toQuantity(input.doseValue))
        : null,
    doseUnit: isSpray && input.doseValue ? DOSE_UNIT : null,
    waterValue:
      isSpray && input.waterValue
        ? quantityToString(toQuantity(input.waterValue))
        : null,
    waterUnit: isSpray && input.waterValue ? WATER_UNIT : null,
    conditionsTempC: isSpray ? currentConditions.tempC : null,
    conditionsWindKph: isSpray ? currentConditions.windKph : null,
    conditionsPpe: isSpray ? currentConditions.ppeConfirmed : null,
    safeHarvestDate:
      phiDays != null ? computeSafeHarvestDate(occurredAt, phiDays) : null,
    phiDays,
    occurredAt,
    clientCreatedAtUtc: now,
    createdAt: now,
    updatedAt: now,
    syncedAt: null,
  };

  await getDb().transaction(async (tx) => {
    await tx.insert(activityLogs).values(row);
    await tx.insert(outbox).values({
      id: newId(),
      entityType: ENTITY_TYPE,
      entityId: row.id,
      opType: 'create',
      payload: JSON.stringify(toActivityLogSyncPayload(row)),
      status: 'pending',
      attempts: 0,
      lastError: null,
      batchId: null,
      clientCreatedAtUtc: now,
      createdAt: now,
      updatedAt: now,
    });
  });

  return row;
}

export async function listActivityLogs(
  farmId: string,
  limit = 50,
): Promise<ActivityLogRow[]> {
  return getDb()
    .select()
    .from(activityLogs)
    .where(eq(activityLogs.farmId, farmId))
    .orderBy(desc(activityLogs.occurredAt))
    .limit(limit);
}
