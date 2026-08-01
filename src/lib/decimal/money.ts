import type { Brand } from './brand';
import { Decimal, parseDecimal } from './decimal-core';

/**
 * A monetary amount, stored as a canonical fixed-2-decimal string to mirror the
 * server's `decimal(18,2)`. Never do JavaScript arithmetic on a `Money` — use
 * the helpers below (the `local/no-money-arithmetic` lint rule enforces this).
 */
export type Money = Brand<string, 'Money'>;

/** Server column is decimal(18,2). */
const MONEY_SCALE = 2;

function toDecimal(value: Money): Decimal {
  return new Decimal(value as unknown as string);
}

function normalize(d: Decimal): Money {
  return d.toFixed(MONEY_SCALE) as Money;
}

/** Zero money, canonical form. */
export const ZERO_MONEY = '0.00' as Money;

/**
 * Build a Money from a decimal string (e.g. validated user input). Rounds to 2
 * decimal places (HALF_UP). Throws if the input is not a valid decimal.
 */
export function toMoney(value: string): Money {
  return normalize(parseDecimal(value, 'Money'));
}

/**
 * Parse an untrusted value (API JSON string, SQLite TEXT) into Money. Rejects
 * anything that is not a decimal string — this is the guard that keeps floats
 * out of the money pipeline.
 */
export function parseMoney(value: unknown): Money {
  return normalize(parseDecimal(value, 'Money'));
}

/** Type guard: is this value a parseable Money string? */
export function isMoney(value: unknown): value is Money {
  try {
    parseDecimal(value, 'Money');
    return true;
  } catch {
    return false;
  }
}

export function addMoney(a: Money, b: Money): Money {
  return normalize(toDecimal(a).plus(toDecimal(b)));
}

export function subtractMoney(a: Money, b: Money): Money {
  return normalize(toDecimal(a).minus(toDecimal(b)));
}

/**
 * Scale a Money by a plain decimal factor (a rate, a count, or a Quantity via
 * `quantityToString`). Result is re-rounded to money scale.
 */
export function scaleMoney(a: Money, factor: string | number): Money {
  return normalize(toDecimal(a).times(new Decimal(factor)));
}

export function compareMoney(a: Money, b: Money): -1 | 0 | 1 {
  return toDecimal(a).comparedTo(toDecimal(b));
}

export function equalsMoney(a: Money, b: Money): boolean {
  return compareMoney(a, b) === 0;
}

/** The raw string for transport/storage (SQLite TEXT, JSON body). */
export function moneyToString(value: Money): string {
  return value as unknown as string;
}
