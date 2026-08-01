import { TZDate } from '@date-fns/tz';
import { format as formatDate } from 'date-fns';

/**
 * Time handling. The app follows the API's two-timestamp model:
 *
 *  - `ClientCreatedAtUtc` — set on-device with {@link nowUtc} the moment a row
 *    is created offline. It is the source of truth for *ordering* the outbox.
 *  - `CreatedAtUtc` — set by the server when the row is persisted during sync.
 *
 * Everything is stored and transported as UTC ISO-8601 strings and only
 * converted to the farm's timezone for display.
 */

/** An ISO-8601 timestamp in UTC, e.g. `2026-08-01T12:00:00.000Z`. */
export type UtcIso = string;

/** Current instant as a UTC ISO string. */
export function nowUtc(): UtcIso {
  return new Date().toISOString();
}

/** Convert a Date to a UTC ISO string. */
export function toUtcIso(date: Date): UtcIso {
  return date.toISOString();
}

/** Parse a UTC ISO string to a Date, throwing on an invalid value. */
export function parseUtc(iso: UtcIso): Date {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Invalid UTC timestamp: "${iso}"`);
  }
  return date;
}

/**
 * Format a UTC instant for display in the farm's IANA timezone
 * (e.g. `Asia/Karachi`). Falls back to formatting the raw instant if the
 * timezone is not recognised by the runtime.
 */
export function formatInTimeZone(
  iso: UtcIso,
  timeZone: string,
  pattern = 'yyyy-MM-dd HH:mm',
): string {
  const instant = parseUtc(iso);
  return formatDate(new TZDate(instant, timeZone), pattern);
}
