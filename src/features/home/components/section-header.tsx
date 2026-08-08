import { View } from 'react-native';

import { MicroLabel, Text } from '@/components/ui';

export interface SectionHeaderProps {
  label: string;
  /** e.g. a count badge like cycle count. */
  trailing?: string;
}

/** "LABEL" micro-label with an optional trailing figure, above a section. */
export function SectionHeader({ label, trailing }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 pt-3">
      <MicroLabel>{label}</MicroLabel>
      {trailing ? <Text variant="row">{trailing}</Text> : null}
    </View>
  );
}
