import { Redirect, router } from 'expo-router';

import { RegisterScreen, useSession } from '@/features/auth';

// TEMPORARY: bypasses the real create-farm endpoint (not yet described in
// the OpenAPI document) until the backend is wired up, same as app/login.tsx.
// Submitting just opens a manager session and redirects home.
export default function RegisterRoute() {
  const { signedIn, signIn } = useSession();

  if (signedIn) {
    return <Redirect href="/" />;
  }

  return (
    <RegisterScreen
      onBack={() => router.back()}
      onSubmit={() => signIn('manager')}
    />
  );
}
