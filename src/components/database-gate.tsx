import { type PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { getDb, runMigrations } from '@/db';

import { Text } from './ui';

/**
 * Opens the database and applies pending migrations before rendering the app.
 * Feature screens read/write SQLite, so they must not mount until the schema
 * is up to date.
 */
export function DatabaseGate({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        await runMigrations(getDb());
        if (mounted) setReady(true);
      } catch (caught) {
        // Drizzle wraps the driver failure, and its `message` stops at
        // "params:" without the underlying SQLite reason. Log the whole chain
        // so `adb logcat` shows what actually went wrong.
        console.error('[DatabaseGate] migration failed', caught);
        if (mounted) {
          setError(
            caught instanceof Error ? caught : new Error(String(caught)),
          );
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center gap-2 p-6">
        <Text variant="heading" tone="accent">
          Database error
        </Text>
        <Text tone="muted">{error.message}</Text>
        {error.cause ? (
          <Text tone="muted">
            Cause:{' '}
            {error.cause instanceof Error
              ? error.cause.message
              : String(error.cause)}
          </Text>
        ) : null}
      </View>
    );
  }

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return <>{children}</>;
}
