import type { SyncBatchRequest, SyncBatchResponse } from './types';

/** Sends a batch of operations to the server. */
export interface SyncTransport {
  sendBatch(request: SyncBatchRequest): Promise<SyncBatchResponse>;
}

/** Non-2xx response from the sync endpoint. */
export class SyncTransportError extends Error {
  constructor(
    readonly status: number,
    readonly body: string,
  ) {
    super(`Sync request failed with HTTP ${status}`);
    this.name = 'SyncTransportError';
  }
}

export interface HttpSyncTransportOptions {
  baseUrl: string;
  /** Value for the required `X-Farm-Id` header. */
  farmId: string;
  /** Optional bearer token provider (JWT). */
  getAuthToken?: () => string | null | Promise<string | null>;
  /** Injectable for tests; defaults to global `fetch`. */
  fetchImpl?: typeof fetch;
}

/**
 * Minimal fetch-based transport. This is deliberately thin — Phase 3 replaces
 * it with a `ky` client that adds JWT refresh, retry/backoff, and typed errors.
 * The engine depends only on {@link SyncTransport}, so that swap is local.
 */
export class HttpSyncTransport implements SyncTransport {
  constructor(private readonly options: HttpSyncTransportOptions) {}

  async sendBatch(request: SyncBatchRequest): Promise<SyncBatchResponse> {
    const { baseUrl, farmId, getAuthToken } = this.options;
    const doFetch = this.options.fetchImpl ?? fetch;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Farm-Id': farmId,
    };
    const token = await getAuthToken?.();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await doFetch(`${baseUrl}/sync/batch`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new SyncTransportError(response.status, await safeText(response));
    }
    return (await response.json()) as SyncBatchResponse;
  }
}

async function safeText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return '';
  }
}
