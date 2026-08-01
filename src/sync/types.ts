import type { UtcIso } from '@/lib/datetime';

/**
 * Sync domain types and the outbox repository contract.
 *
 * NOTE: the `/sync/batch` request/response shapes here are provisional — they
 * will be reconciled against the generated OpenAPI types in Phase 3. Keeping
 * them behind these interfaces means only the transport changes, not the engine.
 */

export type OperationType = 'create' | 'update' | 'delete';

/** pending = ready to send · inflight = dispatched · failed = gave up. */
export type OperationStatus = 'pending' | 'inflight' | 'failed';

/** A queued local mutation as stored in the outbox. */
export interface OutboxOperation {
  id: string;
  entityType: string;
  entityId: string;
  opType: OperationType;
  /** JSON-encoded payload as stored (decimals are strings); null for deletes. */
  payload: string | null;
  status: OperationStatus;
  attempts: number;
  lastError: string | null;
  batchId: string | null;
  clientCreatedAtUtc: UtcIso;
  createdAt: UtcIso;
  updatedAt: UtcIso;
}

/** Input to enqueue a mutation. `payload` is JSON-encoded by the repository. */
export interface EnqueueInput {
  entityType: string;
  entityId: string;
  opType: OperationType;
  /** Any JSON-serialisable value; omit for deletes. Decimals must be strings. */
  payload?: unknown;
  /** Defaults to now (UTC) — the canonical ordering key. */
  clientCreatedAtUtc?: UtcIso;
}

/** Persistence contract for the outbox — implemented by SQLite and by tests. */
export interface OutboxRepository {
  enqueue(input: EnqueueInput): Promise<OutboxOperation>;
  /** Oldest-first pending ops, up to `limit`. */
  listPending(limit: number): Promise<OutboxOperation[]>;
  countPending(): Promise<number>;
  /** Mark ops as dispatched in a batch. */
  markInflight(ids: string[], batchId: string): Promise<void>;
  /** Remove ops the server has accepted (applied or duplicate). */
  markApplied(ids: string[]): Promise<void>;
  /**
   * Record a delivery failure: increments attempts and returns the op to
   * `pending`, or to `failed` once `maxAttempts` is reached.
   */
  recordFailure(id: string, error: string, maxAttempts: number): Promise<void>;
}

// ---- Wire format for POST /sync/batch (provisional) ----

export interface SyncBatchOperation {
  operationId: string;
  entityType: string;
  entityId: string;
  opType: OperationType;
  clientCreatedAtUtc: UtcIso;
  /** Parsed payload (decimals remain strings); null for deletes. */
  payload: unknown;
}

export interface SyncBatchRequest {
  batchId: string;
  operations: SyncBatchOperation[];
}

export type OperationOutcome =
  | { operationId: string; status: 'applied' | 'duplicate' }
  | { operationId: string; status: 'rejected'; error: string };

export interface SyncBatchResponse {
  results: OperationOutcome[];
}
