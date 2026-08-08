import { Redirect } from 'expo-router';

import { LoginScreen, useSession, useSignIn } from '@/features/auth';

/** Manager sign-in. Redirects into the app once a session is open. */
export default function LoginRoute() {
  const { signedIn } = useSession();
  const signIn = useSignIn();

  if (signedIn) {
    return <Redirect href="/" />;
  }

  return (
    <LoginScreen
      onSubmit={(values) => signIn.mutate(values)}
      submitting={signIn.isPending}
      errorMessage={
        signIn.isError ? (signIn.error as Error).message : undefined
      }
    />
  );
}
