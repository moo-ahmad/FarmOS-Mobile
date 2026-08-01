import { config as loadEnv } from 'dotenv';
import type { ConfigContext, ExpoConfig } from 'expo/config';

// Load environment variables from `.env.<profile>` (falling back to `.env`).
// APP_ENV is set by the EAS build profile (see eas.json) or the shell.
const APP_ENV = (process.env.APP_ENV ?? 'development') as
  'development' | 'preview' | 'production';

loadEnv({ path: `.env.${APP_ENV}` });
loadEnv({ path: '.env' }); // shared defaults; does not override values already set

/** Return a trimmed env var, or undefined if unset/empty. */
function envValue(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

type Variant = {
  name: string;
  androidPackage: string;
  iosBundleId: string;
  scheme: string;
};

const VARIANTS: Record<typeof APP_ENV, Variant> = {
  development: {
    name: 'FarmOS (Dev)',
    androidPackage: 'com.farmos.mobile.dev',
    iosBundleId: 'com.farmos.mobile.dev',
    scheme: 'farmos-dev',
  },
  preview: {
    name: 'FarmOS (Preview)',
    androidPackage: 'com.farmos.mobile.preview',
    iosBundleId: 'com.farmos.mobile.preview',
    scheme: 'farmos-preview',
  },
  production: {
    name: 'FarmOS',
    androidPackage: 'com.farmos.mobile',
    iosBundleId: 'com.farmos.mobile',
    scheme: 'farmos',
  },
};

const variant = VARIANTS[APP_ENV];

export default ({ config }: ConfigContext): ExpoConfig => {
  // EAS project id: prefer an explicit env override, otherwise use the value
  // `eas init` wrote into app.json (config.extra.eas.projectId).
  const easProjectId =
    envValue('EAS_PROJECT_ID') ?? config.extra?.eas?.projectId ?? '';

  return {
    ...config,
    name: variant.name,
    slug: config.slug ?? 'farmos',
    scheme: variant.scheme,
    android: {
      ...config.android,
      package: variant.androidPackage,
    },
    ios: {
      ...config.ios,
      bundleIdentifier: variant.iosBundleId,
    },
    extra: {
      ...config.extra,
      appEnv: APP_ENV,
      apiBaseUrl: envValue('API_BASE_URL') ?? 'http://localhost:5000',
      sentryDsn: envValue('SENTRY_DSN') ?? '',
      eas: {
        projectId: easProjectId,
      },
    },
  };
};
