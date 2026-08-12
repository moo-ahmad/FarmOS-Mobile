import { useMutation } from '@tanstack/react-query';

import { login, register, saveTokens, tokensFromResponse } from '@/lib/auth';
import { createFarm, setCurrentFarmId } from '@/lib/farm';
import { ApiError } from '@/lib/http';

import { establishSession } from './establish-session';
import type { JoinFarmValues, RegisterValues } from './schema';
import { useSession } from './session';

async function createNewFarmAccount(values: RegisterValues): Promise<void> {
  await register({
    farmName: values.farmName,
    ownerName: values.ownerName,
    email: values.email,
    password: values.password,
  });
  // Register doesn't return tokens — sign in with the credentials just set.
  const tokens = await login({
    email: values.email,
    password: values.password,
  });
  await establishSession(tokens);
}

async function joinExistingAccount(values: JoinFarmValues): Promise<void> {
  const tokens = await login({
    email: values.email,
    password: values.password,
  });
  await saveTokens(tokensFromResponse(tokens));
  const farm = await createFarm(values.farmName, tokens.accessToken);
  setCurrentFarmId(farm.publicId);
}

/** Maps a failed "new farm" registration to an i18n key the screen can show. */
export function createFarmErrorKey(error: unknown): string {
  if (
    error instanceof ApiError &&
    error.status === 400 &&
    error.body &&
    typeof error.body === 'object' &&
    'errors' in error.body &&
    error.body.errors &&
    typeof error.body.errors === 'object' &&
    'Email' in error.body.errors
  ) {
    return 'register.errors.emailInUse';
  }
  return 'register.errors.generic';
}

/** Maps a failed "add to existing account" attempt to an i18n key. */
export function joinFarmErrorKey(error: unknown): string {
  if (error instanceof ApiError && error.status === 401) {
    return 'login.errors.invalidCredentials';
  }
  return 'register.errors.generic';
}

/**
 * "New account" register mutation: POST /api/auth/register, sign in with
 * those credentials, persist tokens + farm context, then mark the session
 * signed in.
 */
export function useCreateFarm() {
  const { signIn } = useSession();
  return useMutation({
    mutationFn: createNewFarmAccount,
    onSuccess: () => signIn('manager'),
  });
}

/**
 * "Add to existing account" mutation: sign in, then POST /api/farms to add
 * and switch to a new farm under that account.
 */
export function useJoinFarm() {
  const { signIn } = useSession();
  return useMutation({
    mutationFn: joinExistingAccount,
    onSuccess: () => signIn('manager'),
  });
}
