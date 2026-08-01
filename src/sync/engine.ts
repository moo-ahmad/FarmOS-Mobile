import { newId } from '@/lib/ids';

import type { SyncTransport } from './transport';
import { SyncTransportError } from './transport';
import type {
  OperationOutcome,
  OutboxOperation,
  OutboxRepository,
  SyncBatchOperation,
  SyncBatchRequest,
} from './types';

export interface SyncEngineOptions {
  /** Max operations per `/sync/batch` request. */
  batchSize?: number;
  /** Attempts before an op is parked as `failed`. */
  maxAttempts?: number;
}

export interface FlushResult {
  /** True if another flush was already running and this call was coalesced. */
  skipped: boolean;
  applied: number;
  failed: number;
}

const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_MAX_ATTEMPTS = 8;

/**
 * Drains the outbox to the server, one batch at a time, oldest first.
 *
 * Concurrency: a single flush runs at a time. Calls that arrive while a flush
 * is in progress set a "run again" flag rather than overlapping, so a
 * connectivity event during a flush still picks up anything newly enqueued.
 */
export class SyncEngine {
  private readonly batchSize: number;
  private readonly maxAttempts: number;
  private flushing = false;
  private rerunRequested = false;

  constructor(
    private readonly outbox: OutboxRepository,
    private readonly transport: SyncTransport,
    options: SyncEngineOptions = {},
  ) {
    this.batchSize = options.batchSize ?? DEFAULT_BATCH_SIZE;
    this.maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  }

  async flush(): Promise<FlushResult> {
    if (this.flushing) {
      this.rerunRequested = true;
      return { skipped: true, applied: 0, failed: 0 };
    }

    this.flushing = true;
    let applied = 0;
    let failed = 0;
    try {
      do {
        this.rerunRequested = false;
        const result = await this.drain();
        applied += result.applied;
        failed += result.failed;
      } while (this.rerunRequested);
    } finally {
      this.flushing = false;
    }
    return { skipped: false, applied, failed };
  }

  /** Send successive batches until the outbox is empty or a batch can't proceed. */
  private async drain(): Promise<{ applied: number; failed: number }> {
    let applied = 0;
    let failed = 0;

    for (;;) {
      const pending = await this.outbox.listPending(this.batchSize);
      if (pending.length === 0) break;

      const batchId = newId();
      const ids = pending.map((op) => op.id);
      await this.outbox.markInflight(ids, batchId);

      let response;
      try {
        response = await this.transport.sendBatch(
          buildBatchRequest(batchId, pending),
        );
      } catch (error) {
        // Transport-level failure (network down, 5xx): retry the whole batch
        // later. Stop draining so we don't hammer a failing server.
        const message = errorMessage(error);
        for (const op of pending) {
          await this.outbox.recordFailure(op.id, message, this.maxAttempts);
        }
        failed += pending.length;
        break;
      }

      const outcomeById = new Map<string, OperationOutcome>(
        response.results.map((r) => [r.operationId, r]),
      );

      const appliedIds: string[] = [];
      for (const op of pending) {
        const outcome = outcomeById.get(op.id);
        if (!outcome || outcome.status === 'rejected') {
          const reason =
            outcome?.status === 'rejected'
              ? outcome.error
              : 'no result returned for operation';
          await this.outbox.recordFailure(op.id, reason, this.maxAttempts);
          failed += 1;
        } else {
          appliedIds.push(op.id);
        }
      }
      if (appliedIds.length > 0) {
        await this.outbox.markApplied(appliedIds);
        applied += appliedIds.length;
      }

      // A short batch means we've reached the end of the queue.
      if (pending.length < this.batchSize) break;
    }

    return { applied, failed };
  }
}

/** Build the wire request, parsing each op's stored JSON payload. */
export function buildBatchRequest(
  batchId: string,
  operations: OutboxOperation[],
): SyncBatchRequest {
  return {
    batchId,
    operations: operations.map((op): SyncBatchOperation => ({
      operationId: op.id,
      entityType: op.entityType,
      entityId: op.entityId,
      opType: op.opType,
      clientCreatedAtUtc: op.clientCreatedAtUtc,
      payload: op.payload === null ? null : JSON.parse(op.payload),
    })),
  };
}

function errorMessage(error: unknown): string {
  if (error instanceof SyncTransportError) return error.message;
  if (error instanceof Error) return error.message;
  return String(error);
}
