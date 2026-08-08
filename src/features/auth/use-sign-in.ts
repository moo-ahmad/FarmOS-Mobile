import { useMutation } from '@tanstack/react-query';

import type { components } from '@/api';
import { env } from '@/lib/config/env';

import type { LoginValues } from './schema';
import { useSession } from './session';

type LoginRequest = components['schemas']['LoginRequest'];

async function postLogin(body: LoginRequest): Promise<void> {
  const response = await fetch(`${env.apiBaseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Sign-in failed (HTTP ${response.status})`);
  }
  // TODO: the API's login response is not yet described in the OpenAPI document.
  // Once it returns a JWT + refresh token, persist them via
  // src/lib/auth/token-store instead of only flipping the session flag.
}

/** Sign-in mutation: POST /api/auth/login, then mark the session signed in. */
export function useSignIn() {
  const { signIn } = useSession();
  return useMutation({
    mutationFn: (values: LoginValues) =>
      postLogin({ email: values.identifier, password: values.password }),
    onSuccess: () => signIn('manager'),
  });
}
