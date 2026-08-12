import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { HeroFigure, MicroLabel, Screen, Text } from '@/components/ui';
import { colors } from '@/theme/tokens';

/** How long the tagline shows before the splash switches to the syncing copy. */
const TAGLINE_DURATION_MS = 2000;
/** Duration of one indeterminate loader sweep. */
const SWEEP_DURATION_MS = 2000;
/** Width of the sweeping fill, as a fraction of the track. */
const SWEEP_WIDTH_PERCENT = 30;

/** Splash (canvas `1a`): shown while fonts load, before the app boots. */
export function SplashScreen() {
  const version = Constants.expoConfig?.version;
  const [syncing, setSyncing] = useState(false);
  const sweep = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => setSyncing(true), TAGLINE_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!syncing) return;
    sweep.value = withRepeat(
      withTiming(1, {
        duration: SWEEP_DURATION_MS,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false,
    );
  }, [syncing, sweep]);

  const sweepStyle = useAnimatedStyle(() => ({
    left: `${interpolate(sweep.value, [0, 1], [-SWEEP_WIDTH_PERCENT, 100])}%`,
  }));

  return (
    <Screen className="px-8">
      <View className="flex-1 justify-center">
        <View className="h-[34px] w-[34px] bg-accent" />
        <HeroFigure large className="mt-5">
          FarmOS
        </HeroFigure>
        <View className="mt-[18px] h-[3px] w-14 bg-accent" />
        <Text variant="body" tone="muted" className="mt-[18px] max-w-[230px]">
          {syncing
            ? 'Syncing your farm…'
            : 'Field operations, cost allocation and a trustworthy per-crop P&amp;L.'}
        </Text>
      </View>
      <View className="pb-[34px]">
        {syncing ? (
          <View className="h-0.5 overflow-hidden bg-surface">
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  height: '100%',
                  width: `${SWEEP_WIDTH_PERCENT}%`,
                  backgroundColor: colors.accent.DEFAULT,
                },
                sweepStyle,
              ]}
            />
          </View>
        ) : null}
        <View className="mt-3 flex-row justify-between">
          <MicroLabel>Greenfield Farms</MicroLabel>
          {version ? <MicroLabel>v{version}</MicroLabel> : null}
        </View>
      </View>
    </Screen>
  );
}
