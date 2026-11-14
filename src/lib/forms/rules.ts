import { format, isValid, parse } from 'date-fns';

import {
  compareMoney,
  compareQuantity,
  toMoney,
  toQuantity,
  ZERO_MONEY,
  ZERO_QUANTITY,
} from '@/lib/decimal';

/**
 * Small predicates shared by form schemas. Decimal checks go through the
 * branded decimal helpers — a field value is never parsed as a JS number.
 */

/** A money amount strictly greater than zero. */
export function isPositiveMoney(value: string): boolean {
  try {
    return compareMoney(toMoney(value), ZERO_MONEY) > 0;
  } catch {
    return false;
  }
}

/** A money amount of zero or more. */
export function isNonNegativeMoney(value: string): boolean {
  try {
    return compareMoney(toMoney(value), ZERO_MONEY) >= 0;
  } catch {
    return false;
  }
}

/** A decimal within `[min, max]` (inclusive), e.g. a percentage 0–100. */
export function isDecimalBetween(
  value: string,
  min: string,
  max: string,
): boolean {
  try {
    const quantity = toQuantity(value);
    return (
      compareQuantity(quantity, toQuantity(min)) >= 0 &&
      compareQuantity(quantity, toQuantity(max)) <= 0
    );
  } catch {
    return false;
  }
}

/** A decimal strictly greater than zero (not money-scaled). */
export function isPositiveDecimal(value: string): boolean {
  try {
    return compareQuantity(toQuantity(value), ZERO_QUANTITY) > 0;
  } catch {
    return false;
  }
}

const LOCAL_DATE = 'yyyy-MM-dd';

/** A real calendar date written `YYYY-MM-DD` (rejects e.g. 2026-02-30). */
export function isLocalDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = parse(value, LOCAL_DATE, new Date());
  return isValid(parsed) && format(parsed, LOCAL_DATE) === value;
}

/** Today on this device as `YYYY-MM-DD` — the farmer's local calendar date. */
export function todayLocalDate(now: Date = new Date()): string {
  return format(now, LOCAL_DATE);
}

/** Trimmed text, or null when empty — for optional API string fields. */
export function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}
