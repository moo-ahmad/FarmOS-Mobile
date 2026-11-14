import { env } from '@/lib/config/env';

import { ApiError } from './errors';

/** What every authenticated FarmOS request needs. */
export interface AuthContext {
  accessToken: string;
  farmId: string;
}

async function toApiError(response: Response): Promise<ApiError> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = undefined;
  }
  const detail =
    body && typeof body === 'object' && 'detail' in body
      ? String((body as { detail: unknown }).detail)
      : undefined;
  return new ApiError(response.status, response.url, body, detail);
}

/**
 * One authenticated JSON request against the FarmOS API: bearer token +
 * `X-Farm-Id`, a JSON body when given, and an {@link ApiError} for any non-2xx
 * (carrying the ProblemDetails body). Resolves to the parsed JSON, or
 * `undefined` for a 204.
 */
export async function apiRequest<T>(
  path: string,
  auth: AuthContext,
  init: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${auth.accessToken}`,
    'X-Farm-Id': auth.farmId,
  };
  if (init.body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method: init.method ?? 'GET',
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (!response.ok) {
    throw await toApiError(response);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
