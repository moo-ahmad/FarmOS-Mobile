import NetInfo from '@react-native-community/netinfo';
import { AppState, type AppStateStatus } from 'react-native';

import type { SyncEngine } from './engine';

/**
 * Wires the reliable foreground flush triggers to the engine:
 *  - regained connectivity (netinfo), and
 *  - app returning to the foreground (AppState → active).
 *
 * Returns an unsubscribe function. Background flushes are best-effort and
 * handled separately (see ./background).
 */
export function startAutoSync(engine: SyncEngine): () => void {
  const flush = (): void => {
    void engine.flush();
  };

  const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
    if (state.isConnected && state.isInternetReachable !== false) {
      flush();
    }
  });

  const appStateSubscription = AppState.addEventListener(
    'change',
    (status: AppStateStatus) => {
      if (status === 'active') {
        flush();
      }
    },
  );

  // Attempt an initial flush on startup.
  flush();

  return () => {
    unsubscribeNetInfo();
    appStateSubscription.remove();
  };
}
