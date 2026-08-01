// decimal.js-light's default export is the Decimal constructor; it also happens
// to expose a same-named property, which trips import/no-named-as-default.
// eslint-disable-next-line import/no-named-as-default
import Decimal from 'decimal.js-light';

/**
 * Shared decimal.js-light configuration and the boundary parser.
 *
 * All monetary/quantity math in the app goes through decimal.js-light so that
 * IEEE-754 float error can never touch a value. Values are stored and
 * transported as canonical decimal *strings* (SQLite TEXT / JSON) and only
 * become `Decimal` instances transiently, inside these helpers.
 */

// High working precision so intermediate results never lose digits; individual
// values are rounded to their storage scale (e.g. money → 2dp) on the way out.
// Banker-unfriendly HALF_UP matches the server's rounding.
Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP });

export { Decimal };

/**
 * Parse an untrusted string into a Decimal, throwing a descriptive error if it
 * is not a finite decimal. decimal.js-light throws on `NaN`/`Infinity`/garbage,
 * which is exactly what we want at the API/DB boundary.
 */
export function parseDecimal(value: unknown, label: string): Decimal {
  if (typeof value !== 'string') {
    throw new TypeError(
      `Invalid ${label}: expected a decimal string, got ${typeof value}`,
    );
  }
  const trimmed = value.trim();
  if (trimmed === '') {
    throw new RangeError(`Invalid ${label}: empty string`);
  }
  try {
    return new Decimal(trimmed);
  } catch {
    throw new RangeError(`Invalid ${label}: "${value}" is not a valid decimal`);
  }
}
