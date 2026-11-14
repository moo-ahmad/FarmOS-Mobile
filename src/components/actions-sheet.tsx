import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import type { LucideIcon } from 'lucide-react-native';
import { forwardRef } from 'react';
import { Pressable, View } from 'react-native';

import { MicroLabel, Text } from '@/components/ui';
import { colors } from '@/theme';

export interface SheetAction {
  key: string;
  icon: LucideIcon;
  label: string;
  sub: string;
  destructive?: boolean;
  onPress: () => void;
}

export interface ActionsSheetProps {
  /** Small caps title above the actions, e.g. the record's name. */
  title: string;
  actions: readonly SheetAction[];
}

/**
 * A detail screen's ⋮ menu: one 48px row per action. Ref-driven like
 * OptionPicker — call `ref.current?.present()` to open. Each action dismisses
 * the sheet before running, so a confirm dialog never opens underneath it.
 */
export const ActionsSheet = forwardRef<BottomSheetModal, ActionsSheetProps>(
  function ActionsSheet({ title, actions }, ref) {
    const dismissThen = (action: () => void) => () => {
      if (ref && typeof ref !== 'function') ref.current?.dismiss();
      action();
    };

    return (
      <BottomSheetModal ref={ref} enableDynamicSizing>
        <BottomSheetView className="px-4 pb-8 pt-2">
          <MicroLabel>{title}</MicroLabel>
          <View className="mt-2">
            {actions.map(
              ({ key, icon: Icon, label, sub, destructive, onPress }) => (
                <Pressable
                  key={key}
                  accessibilityRole="button"
                  onPress={dismissThen(onPress)}
                  className="min-h-tap flex-row items-center gap-3 border-b-hairline border-divider py-3"
                >
                  <Icon
                    size={20}
                    color={destructive ? colors.accent.DEFAULT : colors.ink}
                  />
                  <View className="flex-1">
                    <Text
                      tone={destructive ? 'accent' : 'default'}
                      className="font-archivo-bold text-label"
                    >
                      {label}
                    </Text>
                    <Text variant="caption" tone="muted">
                      {sub}
                    </Text>
                  </View>
                </Pressable>
              ),
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
