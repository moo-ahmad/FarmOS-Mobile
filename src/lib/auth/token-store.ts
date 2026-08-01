import * as SecureStore from 'expo-secure-store';

/**
 * Auth token persistence in the OS keystore (Keychain / Keystore) via
 * expo-secure-store. Tokens must NEVER be stored in MMKV or AsyncStorage.
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  /** Unix epoch ms when the access token expires, if the server told us. */
  accessTokenExpiresAt?: number;
}

const ACCESS_KEY = 'farmos.auth.accessToken';
const REFRESH_KEY = 'farmos.auth.refreshToken';
const EXPIRES_KEY = 'farmos.auth.accessTokenExpiresAt';

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken),
    tokens.accessTokenExpiresAt === undefined
      ? SecureStore.deleteItemAsync(EXPIRES_KEY)
      : SecureStore.setItemAsync(
          EXPIRES_KEY,
          String(tokens.accessTokenExpiresAt),
        ),
  ]);
}

export async function getTokens(): Promise<AuthTokens | null> {
  const [accessToken, refreshToken, expiresRaw] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_KEY),
    SecureStore.getItemAsync(REFRESH_KEY),
    SecureStore.getItemAsync(EXPIRES_KEY),
  ]);
  if (!accessToken || !refreshToken) return null;
  return {
    accessToken,
    refreshToken,
    accessTokenExpiresAt: expiresRaw ? Number(expiresRaw) : undefined,
  };
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_KEY);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
    SecureStore.deleteItemAsync(EXPIRES_KEY),
  ]);
}
