import { router } from 'expo-router';

import { AddFieldScreen } from '@/features/fields';

export default function AddFieldRoute() {
  return (
    <AddFieldScreen
      onClose={() => router.back()}
      onSaved={() => router.back()}
    />
  );
}
