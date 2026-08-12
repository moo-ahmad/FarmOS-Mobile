import { useMutation } from '@tanstack/react-query';

import { getTokens, logout } from '@/lib/auth';

import { useSession } from './session';

async function signOutEverywhere(): Promise<void> {
  const tokens = await getTokens();
  if (!tokens) return;
  try {
    await logout(tokens.refreshToken);
  } catch {
    // Best-effort: still sign out locally even if the server call fails
    // (offline, token already expired/revoked, etc.) — `onSettled` below
    // clears the local session either way.
  }
}

/**
 * Sign-out mutation: revokes the refresh token server-side, then always
 * clears the local session regardless of whether that call succeeded.
 */
export function useSignOut() {
  const { signOut } = useSession();
  return useMutation({
    mutationFn: signOutEverywhere,
    onSettled: () => signOut(),
  });
}
