import { ActivityIndicator, ScrollView, View } from 'react-native';

import { AppHeader, Button, Callout, Screen, Text } from '@/components/ui';
import { colors } from '@/theme';

import { useFarmSetup } from '../hooks';
import { SetupChecklist } from './setup-checklist';

export interface FarmSetupScreenProps {
  onAddSeason: () => void;
  onAddIrrigationSource: () => void;
  /** Leaves setup — "Skip for now" or "Go to farm" once both are done. */
  onContinue: () => void;
}

/**
 * First-run setup, shown right after a new farm is created. Never blocks:
 * "Skip for now" always works, and the same checklist stays on Home until
 * both steps are done.
 */
export function FarmSetupScreen({
  onAddSeason,
  onAddIrrigationSource,
  onContinue,
}: FarmSetupScreenProps) {
  const setup = useFarmSetup();
  const complete = setup.kind === 'ready' && setup.complete;

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader kicker="Welcome" title="Set up your farm" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text tone="muted">
          Two quick steps before you plan your first crop cycle. You can do them
          now or later from Home.
        </Text>

        {setup.kind === 'ready' ? (
          <SetupChecklist
            status={setup}
            onAddSeason={onAddSeason}
            onAddIrrigationSource={onAddIrrigationSource}
          />
        ) : setup.kind === 'unknown' ? (
          <Callout>
            Couldn&apos;t reach the server. You can finish setup later from
            Home.
          </Callout>
        ) : (
          <View className="items-center py-6">
            <ActivityIndicator color={colors.ink} />
          </View>
        )}
      </ScrollView>
      <View className="p-4">
        <Button
          title={complete ? 'Go to farm' : 'Skip for now'}
          variant={complete ? undefined : 'secondary'}
          haptic={complete ? 'success' : undefined}
          onPress={onContinue}
        />
      </View>
    </Screen>
  );
}
