import { router } from 'expo-router';

import { WorkerFormScreen } from '@/features/workers';

export default function AddWorkerRoute() {
  return (
    <WorkerFormScreen
      onClose={() => router.back()}
      onSaved={(saved) => router.replace(`/worker/${saved.workerId}`)}
    />
  );
}
