import * as Sentry from '@sentry/react-native';

import { env } from '@/lib/config/env';

/**
 * Crash + performance reporting. Offline-sync bugs are effectively invisible
 * without breadcrumbs, so this is load-bearing for the field app, not optional.
 *
 * Initialisation is a no-op when no DSN is configured (the default in local
 * dev), so nothing is sent to Sentry until a real DSN is provided per profile.
 */

let initialized = false;

export function initSentry(): boolean {
  if (initialized || !env.sentryDsn) return false;

  Sentry.init({
    dsn: env.sentryDsn,
    environment: env.appEnv,
    // Full traces in dev/preview; sampled in production to control volume.
    tracesSampleRate: env.appEnv === 'production' ? 0.2 : 1.0,
    // Attach a breadcrumb trail — critical for reconstructing sync failures.
    maxBreadcrumbs: 100,
  });

  initialized = true;
  return true;
}

export { Sentry };
