import { router, useLocalSearchParams } from 'expo-router';

import {
  EditFieldScreen,
  FieldLookupFallback,
  useFieldByCode,
} from '@/features/fields';

export default function EditFieldRoute() {
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
    <EditFieldScreen
      field={field}
      onClose={() => router.back()}
      onSaved={(saved) => {
        router.back();
        // The detail route is keyed by code — follow a renamed field.
        if (saved.code !== code) router.setParams({ code: saved.code });
      }}
    />
  );
}
