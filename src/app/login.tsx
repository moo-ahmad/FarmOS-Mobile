import { Redirect, router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import {
  LoginScreen,
  signInErrorKey,
  useSession,
  useSignIn,
} from '@/features/auth';

export default function LoginRoute() {
  const { t } = useTranslation();
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
        signIn.isError ? t(signInErrorKey(signIn.error)) : undefined
      }
      onCreateFarm={() => router.push('/register')}
    />
  );
}
