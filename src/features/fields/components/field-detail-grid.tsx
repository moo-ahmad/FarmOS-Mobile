import { View } from 'react-native';

import { MicroLabel, Tag, Text } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface FieldDetailGridProps {
  areaLabel: string;
  soilLabel: string;
  irrigationLabel: string;
  boundaryMapped: boolean;
}

const cellClass = (index: number) =>
  cn(
    'w-1/2 bg-neutral-0 px-4 py-3.5',
    index % 2 === 0 && 'border-r-hairline border-divider',
    index < 2 && 'border-b-hairline border-divider',
  );

/** 2×2 read-only grid on Field Detail: Area, Soil type, Irrigation, Boundary. */
export function FieldDetailGrid({
  areaLabel,
  soilLabel,
  irrigationLabel,
  boundaryMapped,
}: FieldDetailGridProps) {
  return (
    <View className="flex-row flex-wrap">
      <View className={cellClass(0)}>
        <MicroLabel>Area</MicroLabel>
        <Text className="mt-1 font-archivo-bold text-heading">{areaLabel}</Text>
      </View>
      <View className={cellClass(1)}>
        <MicroLabel>Soil type</MicroLabel>
        <Text className="mt-1 font-archivo-bold text-heading">{soilLabel}</Text>
      </View>
      <View className={cellClass(2)}>
        <MicroLabel>Irrigation</MicroLabel>
        <Text className="mt-1 font-archivo-bold text-heading">
          {irrigationLabel}
        </Text>
      </View>
      <View className={cellClass(3)}>
        <MicroLabel>Boundary</MicroLabel>
        <Tag
          className="mt-1.5"
          label={boundaryMapped ? 'Mapped' : 'Not mapped'}
          variant="neutral"
        />
      </View>
    </View>
  );
}
