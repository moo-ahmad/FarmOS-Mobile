import { useMutation } from '@tanstack/react-query';

import { login } from '@/lib/auth';
import { ApiError } from '@/lib/http';

import { establishSession } from './establish-session';
import type { LoginValues } from './schema';
import { useSession } from './session';

async function signInWithCredentials(values: LoginValues): Promise<void> {
  const tokens = await login({
    email: values.identifier,
    password: values.password,
  });
  await establishSession(tokens);
}

/** Maps a failed sign-in to an i18n key the login screen can show directly. */
export function signInErrorKey(error: unknown): string {
  if (error instanceof ApiError && error.status === 401) {
    return 'login.errors.invalidCredentials';
  }
  return 'login.errors.generic';
}

/**
 * Sign-in mutation: POST /api/auth/login, persist tokens + farm context, then
 * mark the session signed in. This is the manager/owner form only — field
 * workers use the separate PIN flow (`onWorkerPin`), not yet built.
 */
export function useSignIn() {
  const { signIn } = useSession();
  return useMutation({
    mutationFn: signInWithCredentials,
    onSuccess: () => signIn('manager'),
  });
}
