import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/cn';

export interface ScreenProps extends ViewProps {
  className?: string;
  /** Apply safe-area padding to the bottom edge as well as the top. */
  edgeToEdgeBottom?: boolean;
}

/**
 * Safe-area screen container. Scroll bodies in the Modernist system are pure
 * white; sections manage their own horizontal padding and dividers, so this
 * adds none by default.
 */
export function Screen({
  className,
  style,
  edgeToEdgeBottom = true,
  children,
  ...rest
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={cn('flex-1 bg-neutral-0', className)}
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: edgeToEdgeBottom ? insets.bottom : 0,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
