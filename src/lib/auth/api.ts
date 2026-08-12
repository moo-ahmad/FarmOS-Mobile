import { env } from '@/lib/config/env';
import { ApiError } from '@/lib/http/errors';

import type { AuthTokenResponse } from './token-response';

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface RegisterRequestBody {
  farmName: string;
  ownerName: string;
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

async function postJson(path: string, body: unknown): Promise<Response> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw await toApiError(response);
  }
  return response;
}

/** POST /api/auth/login — email + password, returns a fresh token pair. */
export async function login(
  body: LoginRequestBody,
): Promise<AuthTokenResponse> {
  const response = await postJson('/api/auth/login', body);
  return (await response.json()) as AuthTokenResponse;
}

/**
 * POST /api/auth/register — creates the owner account and their first farm.
 * Unlike login/refresh, this does not return tokens — sign in afterwards.
 */
export async function register(body: RegisterRequestBody): Promise<void> {
  await postJson('/api/auth/register', body);
}
