import { moneyToString, type Money } from './money';

/**
 * Display formatting for a Money value: thousands separators, drops a
 * trailing ".00" but keeps real cents (e.g. "1,840" / "0.82" / "9,062").
 * Display only — never feed the result back into a calculation; use the
 * Money helpers for that.
 */
export function formatMoneyDisplay(money: Money): string {
  const n = Number(moneyToString(money));
  // Whole amounts show no decimals ("1,840"); fractional amounts always show
  // exactly 2 ("0.82") — never a lone "0.8".
  const fractionDigits = Number.isInteger(n) ? 0 : 2;
  return n.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}
