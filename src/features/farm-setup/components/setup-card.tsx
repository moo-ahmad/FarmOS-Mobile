import { View } from 'react-native';

import { MicroLabel, Text } from '@/components/ui';

import { useFarmSetup } from '../hooks';
import { SetupChecklist } from './setup-checklist';

export interface SetupCardProps {
  onAddSeason: () => void;
  onAddIrrigationSource: () => void;
}

/**
 * Home's "Finish setting up" card. Shows only to managers, and only once
 * we know setup is incomplete — hidden while loading, offline, or done.
 */
export function SetupCard({
  onAddSeason,
  onAddIrrigationSource,
}: SetupCardProps) {
  const setup = useFarmSetup();

  if (setup.kind !== 'ready' || setup.complete) return null;

  const remaining =
    Number(!setup.hasOpenSeason) + Number(!setup.hasIrrigationSource);

  return (
    <View className="gap-2.5 border-b-hairline border-divider px-4 py-4">
      <View className="flex-row items-baseline justify-between">
        <MicroLabel>Finish setting up your farm</MicroLabel>
        <Text variant="caption" tone="muted">
          {remaining} left
        </Text>
      </View>
      <SetupChecklist
        status={setup}
        onAddSeason={onAddSeason}
        onAddIrrigationSource={onAddIrrigationSource}
      />
    </View>
  );
}
