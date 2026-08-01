import Constants from 'expo-constants';

/**
 * Typed access to the runtime configuration that `app.config.ts` injected into
 * `expo.extra` from the active `.env.<profile>` file. This is the single place
 * the rest of the app reads environment values from — never `process.env`
 * directly, which is not available in the RN runtime.
 */

export type AppEnv = 'development' | 'preview' | 'production';

type Extra = {
  appEnv: AppEnv;
  apiBaseUrl: string;
  sentryDsn: string;
  eas: { projectId: string };
};

const extra = (Constants.expoConfig?.extra ?? {}) as Partial<Extra>;

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing required runtime config "${name}". Check your .env.<profile> file and app.config.ts.`,
    );
  }
  return value;
}

export const env = {
  appEnv: extra.appEnv ?? 'development',
  apiBaseUrl: required(extra.apiBaseUrl, 'apiBaseUrl'),
  sentryDsn: extra.sentryDsn ?? '',
  easProjectId: extra.eas?.projectId ?? '',
} as const;
