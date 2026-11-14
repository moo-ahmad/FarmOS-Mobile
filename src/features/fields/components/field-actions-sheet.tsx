import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { EyeOff, Pencil, Trash2, type LucideIcon } from 'lucide-react-native';
import { forwardRef } from 'react';
import { Pressable, View } from 'react-native';

import { MicroLabel, Text } from '@/components/ui';
import { colors } from '@/theme';

export interface FieldActionsSheetProps {
  /** e.g. "Field 3". */
  fieldTitle: string;
  /** Hides Deactivate for a field that's already inactive. */
  isActive: boolean;
  onEdit: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
}

interface ActionRowProps {
  icon: LucideIcon;
  label: string;
  sub: string;
  destructive?: boolean;
  onPress: () => void;
}

function ActionRow({
  icon: Icon,
  label,
  sub,
  destructive = false,
  onPress,
}: ActionRowProps) {
  const color = destructive ? colors.accent.DEFAULT : colors.ink;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-tap flex-row items-center gap-3 border-b-hairline border-divider py-3"
    >
      <Icon size={20} color={color} />
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
  );
}

/**
 * Field Detail's ⋮ menu. Ref-driven like OptionPicker: call
 * `ref.current?.present()` to open. Each action dismisses the sheet before
 * handing off, so a confirm dialog never opens underneath it.
 */
export const FieldActionsSheet = forwardRef<
  BottomSheetModal,
  FieldActionsSheetProps
>(function FieldActionsSheet(
  { fieldTitle, isActive, onEdit, onDeactivate, onDelete },
  ref,
) {
  const dismissThen = (action: () => void) => () => {
    if (ref && typeof ref !== 'function') ref.current?.dismiss();
    action();
  };

  return (
    <BottomSheetModal ref={ref} enableDynamicSizing>
      <BottomSheetView className="px-4 pb-8 pt-2">
        <MicroLabel>{fieldTitle}</MicroLabel>
        <View className="mt-2">
          <ActionRow
            icon={Pencil}
            label="Edit field"
            sub="Name, code, area, type, soil, irrigation"
            onPress={dismissThen(onEdit)}
          />
          {isActive ? (
            <ActionRow
              icon={EyeOff}
              label="Deactivate field"
              sub="Hide it from active lists; history is kept"
              onPress={dismissThen(onDeactivate)}
            />
          ) : null}
          <ActionRow
            icon={Trash2}
            label="Delete field"
            sub="Only for a field with no history yet"
            destructive
            onPress={dismissThen(onDelete)}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
