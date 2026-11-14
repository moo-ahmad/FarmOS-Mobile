import { View } from 'react-native';

import { MicroLabel, Text } from '@/components/ui';

export interface DetailItem {
  label: string;
  /** Shown as an em dash when null or empty. */
  value: string | null;
}

/** Read-only label/value rows for a record's detail screen, hairline-separated. */
export function DetailList({ items }: { items: readonly DetailItem[] }) {
  return (
    <View className="px-4">
      {items.map((item) => (
        <View
          key={item.label}
          className="flex-row items-center justify-between gap-4 border-b-hairline border-divider py-3.5"
        >
          <MicroLabel>{item.label}</MicroLabel>
          <Text className="flex-1 text-right font-archivo-bold text-label">
            {item.value ? item.value : '—'}
          </Text>
        </View>
      ))}
    </View>
  );
}
