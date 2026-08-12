import { env } from '@/lib/config/env';
import { ApiError } from '@/lib/http/errors';

import type { AuthTokenResponse } from './token-response';

export interface LoginRequestBody {
  email: string;
  password: string;
}

/** Parses a failed auth response into an `ApiError`, tolerating an empty body (e.g. a bare 401). */
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

/** POST /api/auth/login — email + password, returns a fresh token pair. */
export async function login(
  body: LoginRequestBody,
): Promise<AuthTokenResponse> {
  const response = await fetch(`${env.apiBaseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw await toApiError(response);
  }
  return (await response.json()) as AuthTokenResponse;
}
