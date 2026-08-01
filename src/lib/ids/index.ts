import { uuidv7 } from 'uuidv7';

/**
 * Client-generated identifiers. Every row gets a UUIDv7 *before* it is ever
 * sent to the server — this becomes the server's `PublicId`. v7 is used (over
 * v4) because its leading millisecond timestamp gives index locality: rows
 * created around the same time sort and cluster together in the SQLite B-tree.
 *
 * Entropy comes from `crypto.getRandomValues`, which in the app is provided by
 * the `react-native-get-random-values` polyfill imported at the entry point.
 * The generator is monotonic within a millisecond, so ids created in a tight
 * loop remain strictly ordered.
 */

const UUID_V7 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Generate a new UUIDv7 string. */
export function newId(): string {
  return uuidv7();
}

/** True if `value` is a canonical UUID with version 7 and an RFC-4122 variant. */
export function isUuidV7(value: unknown): value is string {
  return typeof value === 'string' && UUID_V7.test(value);
}
