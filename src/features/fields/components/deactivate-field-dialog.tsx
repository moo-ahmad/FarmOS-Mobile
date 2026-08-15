import { ActivityIndicator, Modal, Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { cn } from '@/lib/cn';
import { colors } from '@/theme';

export interface DeactivateFieldDialogProps {
  visible: boolean;
  /** e.g. "Field 3". */
  fieldTitle: string;
  /** Disables both actions and shows a spinner on Deactivate while the request is in flight. */
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Deactivate confirmation (design handoff: FarmOS Land, "Field 3" detail
 * frame's dialog overlay): a centered, ink-bordered card over a dimmed
 * backdrop. No shadow token — the Modernist system carries structure with
 * ink rules alone, never elevation.
 */
export function DeactivateFieldDialog({
  visible,
  fieldTitle,
  loading = false,
  onCancel,
  onConfirm,
}: DeactivateFieldDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        className="flex-1 items-center justify-center p-5"
        style={{ backgroundColor: 'rgba(45,43,43,0.5)' }}
      >
        <View className="w-full gap-3 border-rule border-ink bg-surface p-[18px]">
          <Text variant="title-sm">Deactivate this field?</Text>
          <Text className="text-[13.5px] leading-[18px]">
            {fieldTitle} will be hidden from active lists. Its crop history
            stays intact.
          </Text>
          <View className="mt-1 flex-row justify-end gap-2.5">
            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={onCancel}
              className={cn(
                'min-h-tap justify-center border-field border-divider px-4',
                loading && 'opacity-45',
              )}
            >
              <Text className="font-archivo-bold text-label">Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={onConfirm}
              className={cn(
                'min-h-tap min-w-[110px] items-center justify-center bg-accent px-4',
                loading && 'opacity-70',
              )}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text tone="inverse" className="font-archivo-bold text-label">
                  Deactivate
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
