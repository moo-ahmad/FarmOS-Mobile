import { Redirect } from 'expo-router';

import { LoginScreen, useSession } from '@/features/auth';

// TEMPORARY: bypasses the real POST /api/auth/login (see useSignIn) until the
// backend is wired up. Sign in just opens a session and redirects home.
export default function LoginRoute() {
  const { signedIn, signIn } = useSession();

  if (signedIn) {
    return <Redirect href="/" />;
  }

  return <LoginScreen onSubmit={() => signIn('manager')} />;
}
