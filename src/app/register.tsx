import { Redirect, router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import {
  createFarmErrorKey,
  joinFarmErrorKey,
  RegisterScreen,
  useCreateFarm,
  useJoinFarm,
  useSession,
} from '@/features/auth';

export default function RegisterRoute() {
  const { t } = useTranslation();
  const { signedIn } = useSession();
  const createFarm = useCreateFarm();
  const joinFarm = useJoinFarm();

  // A farm made here is brand new — send it through first-run setup.
  // Anyone already signed in when they land here just goes Home.
  if (createFarm.isSuccess || joinFarm.isSuccess) {
    return <Redirect href="/setup" />;
  }
  if (signedIn) {
    return <Redirect href="/" />;
  }

  const errorMessage = createFarm.isError
    ? t(createFarmErrorKey(createFarm.error))
    : joinFarm.isError
      ? t(joinFarmErrorKey(joinFarm.error))
      : undefined;

  return (
    <RegisterScreen
      onBack={() => router.back()}
      onCreateFarm={(values) => createFarm.mutate(values)}
      onAddFarm={(values) => joinFarm.mutate(values)}
      submitting={createFarm.isPending || joinFarm.isPending}
      errorMessage={errorMessage}
    />
  );
}
