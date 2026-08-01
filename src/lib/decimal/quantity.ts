import type { Brand } from './brand';
import { Decimal, parseDecimal } from './decimal-core';

/**
 * A physical quantity (weight, area, count, volume), stored as a canonical
 * decimal string. Unlike Money it has no fixed scale — quantities keep whatever
 * precision they were entered with. Never do JavaScript arithmetic on a
 * `Quantity`; use the helpers below.
 */
export type Quantity = Brand<string, 'Quantity'>;

function toDecimal(value: Quantity): Decimal {
  return new Decimal(value as unknown as string);
}

function normalize(d: Decimal): Quantity {
  return d.toString() as Quantity;
}

/** Zero quantity, canonical form. */
export const ZERO_QUANTITY = '0' as Quantity;

/** Build a Quantity from a decimal string. Throws if it is not a valid decimal. */
export function toQuantity(value: string): Quantity {
  return normalize(parseDecimal(value, 'Quantity'));
}

/** Parse an untrusted value (API JSON string, SQLite TEXT) into Quantity. */
export function parseQuantity(value: unknown): Quantity {
  return normalize(parseDecimal(value, 'Quantity'));
}

/** Type guard: is this value a parseable Quantity string? */
export function isQuantity(value: unknown): value is Quantity {
  try {
    parseDecimal(value, 'Quantity');
    return true;
  } catch {
    return false;
  }
}

export function addQuantity(a: Quantity, b: Quantity): Quantity {
  return normalize(toDecimal(a).plus(toDecimal(b)));
}

export function subtractQuantity(a: Quantity, b: Quantity): Quantity {
  return normalize(toDecimal(a).minus(toDecimal(b)));
}

/** Scale a Quantity by a plain decimal factor. */
export function scaleQuantity(a: Quantity, factor: string | number): Quantity {
  return normalize(toDecimal(a).times(new Decimal(factor)));
}

export function compareQuantity(a: Quantity, b: Quantity): -1 | 0 | 1 {
  return toDecimal(a).comparedTo(toDecimal(b));
}

export function equalsQuantity(a: Quantity, b: Quantity): boolean {
  return compareQuantity(a, b) === 0;
}

/** The raw string for transport/storage (SQLite TEXT, JSON body). */
export function quantityToString(value: Quantity): string {
  return value as unknown as string;
}
