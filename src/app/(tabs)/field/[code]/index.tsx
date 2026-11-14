import { router, useLocalSearchParams } from 'expo-router';

import {
  FieldDetailScreen,
  FieldLookupFallback,
  useFieldByCode,
} from '@/features/fields';

export default function FieldDetailRoute() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { field, isPending } = useFieldByCode(code);

  if (!field) {
    return (
      <FieldLookupFallback
        code={code}
        loading={isPending}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <FieldDetailScreen
      field={field}
      onBack={() => router.back()}
      onEdit={() => router.push(`/field/${field.code}/edit`)}
      onDeactivated={() => router.back()}
      onDeleted={() => router.back()}
    />
  );
}
