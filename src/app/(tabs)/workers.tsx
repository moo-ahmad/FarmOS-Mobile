import { router } from 'expo-router';

import { WorkersScreen } from '@/features/workers';

export default function WorkersRoute() {
  return (
    <WorkersScreen
      onBack={() => router.back()}
      onAddWorker={() => router.push('/worker/new')}
      onOpenWorker={(id) => router.push(`/worker/${id}`)}
    />
  );
}
