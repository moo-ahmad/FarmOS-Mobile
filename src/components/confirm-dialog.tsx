import type { ReactNode } from 'react';
import { ActivityIndicator, Modal, Pressable, View } from 'react-native';

import { Callout, Text } from '@/components/ui';
import { cn } from '@/lib/cn';
import { colors } from '@/theme';

export interface ConfirmDialogProps {
  visible: boolean;
  /** e.g. "Deactivate this field?". */
  title: string;
  message: string;
  /** The red action's label, e.g. "Deactivate" or "Delete". */
  confirmLabel: string;
  /** Disables both actions and shows a spinner on the red action while the request is in flight. */
  loading?: boolean;
  /** A failed request's message, shown inside the dialog so it isn't hidden behind it. */
  errorMessage?: string;
  /** Extra input shown under the message, e.g. a worker's exit date. */
  children?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Confirmation for a destructive action (Deactivate, Delete) on a field,
 * customer or worker (design handoff: FarmOS Land, "Field 3" detail frame's
 * dialog overlay): a centered, ink-bordered card over a dimmed backdrop. No shadow token — the Modernist system carries structure with
 * ink rules alone, never elevation.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  loading = false,
  errorMessage,
  children,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
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
          <Text variant="title-sm">{title}</Text>
          <Text className="text-[13.5px] leading-[18px]">{message}</Text>
          {children}
          {errorMessage ? <Callout>{errorMessage}</Callout> : null}
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
                  {confirmLabel}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
