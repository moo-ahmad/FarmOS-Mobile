import { describe, expect, it } from '@jest/globals';

import { nowUtc } from '@/lib/datetime';
import { newId } from '@/lib/ids';

import { SyncEngine } from './engine';
import type { SyncTransport } from './transport';
import type {
  EnqueueInput,
  OperationOutcome,
  OutboxOperation,
  OutboxRepository,
  SyncBatchRequest,
  SyncBatchResponse,
} from './types';

/** In-memory OutboxRepository mirroring the SQLite semantics. */
class InMemoryOutbox implements OutboxRepository {
  ops: OutboxOperation[] = [];

  async enqueue(input: EnqueueInput): Promise<OutboxOperation> {
    const now = nowUtc();
    const op: OutboxOperation = {
      id: newId(),
      entityType: input.entityType,
      entityId: input.entityId,
      opType: input.opType,
      payload:
        input.payload === undefined ? null : JSON.stringify(input.payload),
      status: 'pending',
      attempts: 0,
      lastError: null,
      batchId: null,
      clientCreatedAtUtc: input.clientCreatedAtUtc ?? now,
      createdAt: now,
      updatedAt: now,
    };
    this.ops.push(op);
    return op;
  }

  async listPending(limit: number): Promise<OutboxOperation[]> {
    return this.ops
      .filter((o) => o.status === 'pending')
      .sort((a, b) => a.clientCreatedAtUtc.localeCompare(b.clientCreatedAtUtc))
      .slice(0, limit);
  }

  async countPending(): Promise<number> {
    return this.ops.filter((o) => o.status === 'pending').length;
  }

  async markInflight(ids: string[], batchId: string): Promise<void> {
    for (const op of this.ops) {
      if (ids.includes(op.id)) {
        op.status = 'inflight';
        op.batchId = batchId;
      }
    }
  }

  async markApplied(ids: string[]): Promise<void> {
    this.ops = this.ops.filter((o) => !ids.includes(o.id));
  }

  async recordFailure(
    id: string,
    error: string,
    maxAttempts: number,
  ): Promise<void> {
    const op = this.ops.find((o) => o.id === id);
    if (!op) return;
    op.attempts += 1;
    op.lastError = error;
    op.batchId = null;
    op.status = op.attempts >= maxAttempts ? 'failed' : 'pending';
  }
}

class FakeTransport implements SyncTransport {
  sent: SyncBatchRequest[] = [];
  constructor(
    private readonly handler: (
      request: SyncBatchRequest,
    ) => SyncBatchResponse | Promise<SyncBatchResponse>,
  ) {}
  async sendBatch(request: SyncBatchRequest): Promise<SyncBatchResponse> {
    this.sent.push(request);
    return this.handler(request);
  }
}

const applyAll = (request: SyncBatchRequest): SyncBatchResponse => ({
  results: request.operations.map((o): OperationOutcome => ({
    operationId: o.operationId,
    status: 'applied',
  })),
});

async function seed(repo: InMemoryOutbox, count: number): Promise<void> {
  for (let i = 0; i < count; i += 1) {
    await repo.enqueue({
      entityType: 'attendance',
      entityId: newId(),
      opType: 'create',
      payload: { index: i },
      // Explicit, strictly increasing order key so batching is deterministic.
      clientCreatedAtUtc: `2026-08-01T00:00:0${i}.000Z`,
    });
  }
}

describe('SyncEngine.flush', () => {
  it('applies every operation and empties the outbox', async () => {
    const repo = new InMemoryOutbox();
    await seed(repo, 3);
    const engine = new SyncEngine(repo, new FakeTransport(applyAll));

    const result = await engine.flush();

    expect(result).toEqual({ skipped: false, applied: 3, failed: 0 });
    expect(await repo.countPending()).toBe(0);
    expect(repo.ops).toHaveLength(0);
  });

  it('sends operations in batches of batchSize', async () => {
    const repo = new InMemoryOutbox();
    await seed(repo, 3);
    const transport = new FakeTransport(applyAll);
    const engine = new SyncEngine(repo, transport, { batchSize: 2 });

    await engine.flush();

    expect(transport.sent).toHaveLength(2);
    expect(transport.sent[0]?.operations).toHaveLength(2);
    expect(transport.sent[1]?.operations).toHaveLength(1);
  });

  it('keeps ops pending and counts failures when the transport throws', async () => {
    const repo = new InMemoryOutbox();
    await seed(repo, 2);
    const engine = new SyncEngine(
      repo,
      new FakeTransport(() => {
        throw new Error('network down');
      }),
      { maxAttempts: 3 },
    );

    const result = await engine.flush();

    expect(result.applied).toBe(0);
    expect(result.failed).toBe(2);
    expect(await repo.countPending()).toBe(2);
    expect(
      repo.ops.every(
        (o) =>
          o.attempts === 1 &&
          o.status === 'pending' &&
          o.lastError === 'network down',
      ),
    ).toBe(true);
  });

  it('applies accepted ops and retries only the rejected one', async () => {
    const repo = new InMemoryOutbox();
    await seed(repo, 3);
    const rejectedId = repo.ops[1]!.id;
    const engine = new SyncEngine(
      repo,
      new FakeTransport((request) => ({
        results: request.operations.map((o): OperationOutcome =>
          o.operationId === rejectedId
            ? { operationId: o.operationId, status: 'rejected', error: 'boom' }
            : { operationId: o.operationId, status: 'applied' },
        ),
      })),
    );

    const result = await engine.flush();

    expect(result.applied).toBe(2);
    expect(result.failed).toBe(1);
    expect(repo.ops).toHaveLength(1);
    expect(repo.ops[0]?.id).toBe(rejectedId);
    expect(repo.ops[0]?.attempts).toBe(1);
    expect(repo.ops[0]?.status).toBe('pending');
  });

  it('parks an op as failed once maxAttempts is reached', async () => {
    const repo = new InMemoryOutbox();
    await seed(repo, 1);
    const engine = new SyncEngine(
      repo,
      new FakeTransport(() => {
        throw new Error('still down');
      }),
      { maxAttempts: 2 },
    );

    await engine.flush(); // attempt 1 → pending
    expect(repo.ops[0]?.status).toBe('pending');
    await engine.flush(); // attempt 2 → failed

    expect(repo.ops[0]?.status).toBe('failed');
    expect(await repo.countPending()).toBe(0);
  });
});
