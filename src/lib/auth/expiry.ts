/**
 * Pure token-expiry logic, separated from the secure-store I/O so it can be
 * unit-tested without the native module.
 */

/** Refresh this many ms before actual expiry to avoid racing the deadline. */
export const DEFAULT_EXPIRY_SKEW_MS = 30_000;

/**
 * Whether an access token should be treated as expired. Unknown expiry
 * (`undefined`) is treated as *not* expired — the server's 401 remains the
 * authoritative signal in that case.
 */
export function isAccessTokenExpired(
  expiresAtMs: number | undefined,
  now: number = Date.now(),
  skewMs: number = DEFAULT_EXPIRY_SKEW_MS,
): boolean {
  if (expiresAtMs === undefined) return false;
  return now >= expiresAtMs - skewMs;
}
