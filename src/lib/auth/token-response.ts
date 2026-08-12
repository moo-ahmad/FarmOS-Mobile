import type { AuthTokens } from './token-store';

/**
 * Shape returned by `POST /api/auth/login` and `POST /api/auth/refresh`.
 * Not in the OpenAPI document yet (the 200 responses there have no body
 * schema) — confirmed against the live dev API instead.
 */
export interface AuthTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
  refreshToken: string;
}

export function tokensFromResponse(
  response: AuthTokenResponse,
  now: number = Date.now(),
): AuthTokens {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    accessTokenExpiresAt: now + response.expiresInSeconds * 1000,
  };
}
