import { env } from '@/lib/config/env';

import { SyncEngine, type SyncEngineOptions } from './engine';
import { DrizzleOutboxRepository } from './outbox';
import { HttpSyncTransport } from './transport';

export * from './types';
export { SyncEngine, buildBatchRequest } from './engine';
export type { SyncEngineOptions, FlushResult } from './engine';
export { DrizzleOutboxRepository } from './outbox';
export {
  HttpSyncTransport,
  SyncTransportError,
  type SyncTransport,
} from './transport';
export { startAutoSync } from './connectivity';
export {
  SYNC_TASK_NAME,
  setBackgroundFlushRunner,
  registerSyncBackgroundTask,
  unregisterSyncBackgroundTask,
} from './background';

export interface CreateSyncEngineParams {
  /** Current farm context, sent as `X-Farm-Id`. */
  farmId: string;
  /** Bearer token provider (JWT); wired to secure-store in Phase 3. */
  getAuthToken?: () => string | null | Promise<string | null>;
  options?: SyncEngineOptions;
}

/**
 * Build a production sync engine: SQLite outbox + HTTP transport pointed at the
 * configured API base URL. The transport is swapped for the `ky` client in
 * Phase 3 without touching callers.
 */
export function createSyncEngine(params: CreateSyncEngineParams): SyncEngine {
  const outbox = new DrizzleOutboxRepository();
  const transport = new HttpSyncTransport({
    baseUrl: env.apiBaseUrl,
    farmId: params.farmId,
    getAuthToken: params.getAuthToken,
  });
  return new SyncEngine(outbox, transport, params.options);
}
