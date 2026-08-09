import Constants from 'expo-constants';
import { View } from 'react-native';

import { HeroFigure, MicroLabel, Screen, Text } from '@/components/ui';

/** Splash (canvas `1a`): shown while fonts load, before the app boots. */
export function SplashScreen() {
  const version = Constants.expoConfig?.version;

  return (
    <Screen className="px-8">
      <View className="flex-1 justify-center">
        <View className="h-[34px] w-[34px] bg-accent" />
        <HeroFigure large className="mt-5">
          FarmOS
        </HeroFigure>
        <View className="mt-[18px] h-[3px] w-14 bg-accent" />
        <Text variant="body" tone="muted" className="mt-[18px] max-w-[230px]">
          Field operations, cost allocation and a trustworthy per-crop P&amp;L.
        </Text>
      </View>
      <View className="pb-[34px]">
        <View className="h-0.5 bg-surface">
          <View className="h-full w-[38%] bg-accent" />
        </View>
        <View className="mt-3 flex-row justify-between">
          <MicroLabel>Greenfield Farms</MicroLabel>
          {version ? <MicroLabel>v{version}</MicroLabel> : null}
        </View>
      </View>
    </Screen>
  );
}
