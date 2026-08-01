import ky, { type KyInstance } from 'ky';

import { env } from '@/lib/config/env';

import {
  buildAuthHeaders,
  isUnauthorized,
  RETRYABLE_STATUS_CODES,
} from './policy';

/** Everything the client needs to authenticate and recover from a 401. */
export interface HttpClientDeps {
  /** Current access token (JWT), or null if signed out. */
  getAccessToken: () => string | null | Promise<string | null>;
  /** Current farm context, sent as `X-Farm-Id`. */
  getFarmId: () => string | null;
  /** Attempt a token refresh; resolves true if a fresh token is now available. */
  refresh: () => Promise<boolean>;
  /** Called when auth cannot be recovered, so the app can route to sign-in. */
  onUnauthorized?: () => void;
}

export interface HttpClientOptions {
  baseUrl?: string;
  retryLimit?: number;
}

/** Header marking a request that has already been retried after a refresh. */
const RETRY_HEADER = 'X-Auth-Retried';

/**
 * Build the app's HTTP client: a ky instance that attaches the bearer token and
 * `X-Farm-Id` on every request, retries transient failures with backoff, and
 * transparently refreshes the JWT once on a 401 before replaying the request.
 *
 * Refresh is single-flight — concurrent 401s share one refresh call.
 */
export function createHttpClient(
  deps: HttpClientDeps,
  options: HttpClientOptions = {},
): KyInstance {
  let refreshing: Promise<boolean> | null = null;

  return ky.create({
    prefix: options.baseUrl ?? env.apiBaseUrl,
    retry: {
      limit: options.retryLimit ?? 2,
      methods: ['get', 'put', 'post', 'patch', 'delete'],
      statusCodes: [...RETRYABLE_STATUS_CODES],
    },
    hooks: {
      beforeRequest: [
        async ({ request }) => {
          const accessToken = await deps.getAccessToken();
          const headers = buildAuthHeaders({
            accessToken,
            farmId: deps.getFarmId(),
          });
          for (const [name, value] of Object.entries(headers)) {
            request.headers.set(name, value);
          }
        },
      ],
      afterResponse: [
        async ({ request, response }) => {
          if (!isUnauthorized(response.status)) return response;

          // Already retried once, or a body we can't safely replay: give up.
          if (request.headers.get(RETRY_HEADER) || request.bodyUsed) {
            deps.onUnauthorized?.();
            return response;
          }

          refreshing ??= deps.refresh().finally(() => {
            refreshing = null;
          });
          const refreshed = await refreshing;
          if (!refreshed) {
            deps.onUnauthorized?.();
            return response;
          }

          const accessToken = await deps.getAccessToken();
          const retried = new Request(request);
          if (accessToken) {
            retried.headers.set('Authorization', `Bearer ${accessToken}`);
          }
          retried.headers.set(RETRY_HEADER, '1');
          return ky(retried);
        },
      ],
    },
  });
}
