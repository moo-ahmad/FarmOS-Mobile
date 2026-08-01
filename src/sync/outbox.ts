import { asc, eq, inArray, sql } from 'drizzle-orm';

import { getDb, type AppDatabase } from '@/db/client';
import { outbox, type OutboxRow } from '@/db/schema';
import { nowUtc } from '@/lib/datetime';
import { newId } from '@/lib/ids';

import type { EnqueueInput, OutboxOperation, OutboxRepository } from './types';

function toOperation(row: OutboxRow): OutboxOperation {
  return {
    id: row.id,
    entityType: row.entityType,
    entityId: row.entityId,
    opType: row.opType,
    payload: row.payload,
    status: row.status,
    attempts: row.attempts,
    lastError: row.lastError,
    batchId: row.batchId,
    clientCreatedAtUtc: row.clientCreatedAtUtc,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** SQLite-backed outbox. */
export class DrizzleOutboxRepository implements OutboxRepository {
  constructor(private readonly db: AppDatabase = getDb()) {}

  async enqueue(input: EnqueueInput): Promise<OutboxOperation> {
    const now = nowUtc();
    const row = {
      id: newId(),
      entityType: input.entityType,
      entityId: input.entityId,
      opType: input.opType,
      payload:
        input.payload === undefined ? null : JSON.stringify(input.payload),
      status: 'pending' as const,
      attempts: 0,
      lastError: null,
      batchId: null,
      clientCreatedAtUtc: input.clientCreatedAtUtc ?? now,
      createdAt: now,
      updatedAt: now,
    };
    await this.db.insert(outbox).values(row);
    return toOperation(row);
  }

  async listPending(limit: number): Promise<OutboxOperation[]> {
    const rows = await this.db
      .select()
      .from(outbox)
      .where(eq(outbox.status, 'pending'))
      .orderBy(asc(outbox.clientCreatedAtUtc))
      .limit(limit);
    return rows.map(toOperation);
  }

  async countPending(): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(outbox)
      .where(eq(outbox.status, 'pending'));
    return result[0]?.count ?? 0;
  }

  async markInflight(ids: string[], batchId: string): Promise<void> {
    if (ids.length === 0) return;
    await this.db
      .update(outbox)
      .set({ status: 'inflight', batchId, updatedAt: nowUtc() })
      .where(inArray(outbox.id, ids));
  }

  async markApplied(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await this.db.delete(outbox).where(inArray(outbox.id, ids));
  }

  async recordFailure(
    id: string,
    error: string,
    maxAttempts: number,
  ): Promise<void> {
    await this.db
      .update(outbox)
      .set({
        attempts: sql`${outbox.attempts} + 1`,
        lastError: error,
        // Park as `failed` once we hit the attempt ceiling, else retry later.
        status: sql`CASE WHEN ${outbox.attempts} + 1 >= ${maxAttempts} THEN 'failed' ELSE 'pending' END`,
        batchId: null,
        updatedAt: nowUtc(),
      })
      .where(eq(outbox.id, id));
  }
}
