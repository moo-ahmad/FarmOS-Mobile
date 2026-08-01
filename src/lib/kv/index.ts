import { createMMKV, type MMKV } from 'react-native-mmkv';

/**
 * Fast synchronous key/value storage (MMKV) for session state, last-used
 * defaults, and query-cache persistence.
 *
 * SECURITY: never store auth tokens or other secrets here — those go in
 * expo-secure-store (Keychain/Keystore), wired up in Phase 3.
 */
export const kv: MMKV = createMMKV({ id: 'farmos-app' });

/** Read and JSON-parse a value, returning undefined if absent or malformed. */
export function getJson<T>(key: string): T | undefined {
  const raw = kv.getString(key);
  if (raw === undefined) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

/** JSON-encode and store a value. */
export function setJson(key: string, value: unknown): void {
  kv.set(key, JSON.stringify(value));
}

/** Delete a key. */
export function remove(key: string): void {
  kv.remove(key);
}
