import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Thin haptics wrapper. Confirmation feedback matters when the screen isn't
 * being watched (data entry in the field). No-ops on web, and never throws —
 * haptics are a nicety, not a correctness concern.
 */

async function safe(run: () => Promise<void>): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await run();
  } catch {
    // Ignore — some devices lack a haptic engine.
  }
}

export function selection(): Promise<void> {
  return safe(() => Haptics.selectionAsync());
}

export function success(): Promise<void> {
  return safe(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  );
}

export function warning(): Promise<void> {
  return safe(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  );
}

export function error(): Promise<void> {
  return safe(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  );
}

export function impact(
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium,
): Promise<void> {
  return safe(() => Haptics.impactAsync(style));
}
