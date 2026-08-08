import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * SQLite schema (Drizzle, op-sqlite dialect).
 *
 * IMPORTANT: money and quantity columns are always `text(...)` — never `real` —
 * because SQLite `REAL` is an IEEE-754 double and would reintroduce the float
 * error the decimal layer exists to prevent. Domain aggregate tables (added
 * alongside the API contract in Phase 3) follow the same rule.
 *
 * This file currently defines only the sync infrastructure: the outbox and a
 * durable key/value table for sync cursors.
 */

/** Mutation queued locally, awaiting delivery to `POST /sync/batch`. */
export const outbox = sqliteTable(
  'outbox',
  {
    /** Operation id (UUIDv7), also the client idempotency key for the server. */
    id: text('id').primaryKey(),
    /** Aggregate/entity name, e.g. `attendance`, `activity_log`. */
    entityType: text('entity_type').notNull(),
    /** Target row's client-generated PublicId (UUIDv7). */
    entityId: text('entity_id').notNull(),
    /** The kind of mutation. */
    opType: text('op_type', {
      enum: ['create', 'update', 'delete'],
    }).notNull(),
    /** JSON-encoded payload; null for deletes. Decimals inside are strings. */
    payload: text('payload'),
    /** Delivery status. */
    status: text('status', {
      enum: ['pending', 'inflight', 'failed'],
    })
      .notNull()
      .default('pending'),
    /** Number of delivery attempts, for backoff and give-up policy. */
    attempts: integer('attempts').notNull().default(0),
    /** Last error message, for diagnostics and the sync-status UI. */
    lastError: text('last_error'),
    /** Id of the batch this op was last dispatched in (in-flight bookkeeping). */
    batchId: text('batch_id'),
    /** Device time the mutation was created — the canonical outbox ordering key. */
    clientCreatedAtUtc: text('client_created_at_utc').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    // Fast "next pending ops in creation order" query for the flush loop.
    index('outbox_status_client_created_idx').on(
      table.status,
      table.clientCreatedAtUtc,
    ),
    index('outbox_entity_idx').on(table.entityType, table.entityId),
  ],
);

export type OutboxRow = typeof outbox.$inferSelect;
export type NewOutboxRow = typeof outbox.$inferInsert;

/** Durable key/value store for sync cursors and similar small state. */
export const syncMeta = sqliteTable('sync_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`),
});

export type SyncMetaRow = typeof syncMeta.$inferSelect;

/**
 * Activity log — the first domain aggregate (Phase 5), rebuilt (Log Activity,
 * canvas `1a` frame 6) to match the design exactly: an operation on a
 * field/crop, with a spray's product/dose/water/PHI details when relevant.
 * `doseValue`/`waterValue` are decimal strings (Quantity) — never REAL. The
 * enum literals mirror src/features/activity-log/model.ts — keep in sync.
 */
export const activityLogs = sqliteTable(
  'activity_logs',
  {
    /** Client-generated UUIDv7, becomes the server PublicId. */
    id: text('id').primaryKey(),
    farmId: text('farm_id').notNull(),
    operation: text('operation', {
      enum: ['irrigation', 'spray', 'fertilizer', 'weeding'],
    }).notNull(),
    /** Denormalized field/crop snapshot — fields aren't a synced table yet. */
    fieldCode: text('field_code').notNull(),
    cropLabel: text('crop_label').notNull(),
    /** Spray only: product name, dose/acre and water volume (Quantity strings). */
    product: text('product'),
    doseValue: text('dose_value'),
    doseUnit: text('dose_unit'),
    waterValue: text('water_value'),
    waterUnit: text('water_unit'),
    /** Ambient conditions captured at spray time — informational, not editable. */
    conditionsTempC: integer('conditions_temp_c'),
    conditionsWindKph: integer('conditions_wind_kph'),
    conditionsPpe: integer('conditions_ppe', { mode: 'boolean' }),
    /** Pre-harvest interval, computed and stored at save time (UTC ISO + days). */
    safeHarvestDate: text('safe_harvest_date'),
    phiDays: integer('phi_days'),
    /** When the activity happened (UTC ISO), farmer-editable. */
    occurredAt: text('occurred_at').notNull(),
    /** Device time of creation — mirrors the outbox ordering key. */
    clientCreatedAtUtc: text('client_created_at_utc').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    /** Set once the server has acknowledged this row via sync; null = local-only. */
    syncedAt: text('synced_at'),
  },
  (table) => [
    index('activity_logs_farm_occurred_idx').on(table.farmId, table.occurredAt),
  ],
);

export type ActivityLogRow = typeof activityLogs.$inferSelect;
export type NewActivityLogRow = typeof activityLogs.$inferInsert;
