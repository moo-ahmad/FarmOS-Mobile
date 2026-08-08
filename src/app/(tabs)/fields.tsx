import { router, useLocalSearchParams } from 'expo-router';

import { FieldsScreen } from '@/features/fields';

// Reached via the Cycles tab, a Home cycle row, or a field-referencing
// reminder (no dedicated Fields tab in the 5-slot bar — the design shows it
// entered from Home/Cycles/alerts). Rendered inside the (tabs) group so the
// tab bar stays visible underneath, per the design.
export default function FieldsRoute() {
  const { focus } = useLocalSearchParams<{ focus?: string }>();

  return (
    <FieldsScreen
      focusCode={focus}
      onAddField={() => router.push('/field/new')}
      onOpenField={(fieldCode) => router.push(`/field/${fieldCode}`)}
    />
  );
}
