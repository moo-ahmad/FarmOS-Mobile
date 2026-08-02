import { desc, eq } from 'drizzle-orm';

import { getDb } from '@/db/client';
import { activityLogs, outbox, type ActivityLogRow } from '@/db/schema';
import { nowUtc } from '@/lib/datetime';
import {
  moneyToString,
  quantityToString,
  toMoney,
  toQuantity,
} from '@/lib/decimal';
import { newId } from '@/lib/ids';

import { toActivityLogSyncPayload } from './payload';
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
 */
export async function createActivityLog(
  input: CreateActivityLogInput,
): Promise<ActivityLogRow> {
  const now = nowUtc();
  const trimmedCost = input.cost?.trim();
  const row: ActivityLogRow = {
    id: newId(),
    farmId: input.farmId,
    activityType: input.activityType,
    quantity: quantityToString(toQuantity(input.quantity)),
    unit: input.unit,
    cost: trimmedCost ? moneyToString(toMoney(trimmedCost)) : null,
    notes: input.notes?.trim() ? input.notes.trim() : null,
    occurredAt: input.occurredAt ?? now,
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
