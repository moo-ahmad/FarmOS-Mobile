import { View } from 'react-native';

import { Text } from '@/components/ui';

function Swatch({ className }: { className: string }) {
  return <View className={`h-2.5 w-2.5 ${className}`} />;
}

/** Ink/red square legend for the income vs expense chart. */
export function ChartLegend() {
  return (
    <View className="flex-row gap-4 px-4 pb-3">
      <View className="flex-row items-center gap-1.5">
        <Swatch className="bg-ink" />
        <Text variant="caption" tone="muted">
          Income
        </Text>
      </View>
      <View className="flex-row items-center gap-1.5">
        <Swatch className="bg-accent" />
        <Text variant="caption" tone="muted">
          Expense
        </Text>
      </View>
    </View>
  );
}
