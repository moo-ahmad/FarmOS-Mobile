import { moneyToString, type Money } from '@/lib/decimal';

/**
 * A plain 0–1 ratio for progress-bar width — display only, never stored or
 * used in a monetary calculation. Converting to `number` here (rather than
 * doing JS arithmetic on the `Money` values themselves) keeps the branded
 * types honest: the `local/no-money-arithmetic` rule never sees an operator
 * applied to a `Money`-typed operand.
 */
export function moneyRatio(numerator: Money, denominator: Money): number {
  const num = Number(moneyToString(numerator));
  const den = Number(moneyToString(denominator));
  if (den <= 0) return 0;
  return Math.min(1, num / den);
}
