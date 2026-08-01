import type { Money } from './money';
import { scaleMoney } from './money';
import type { Quantity } from './quantity';
import { quantityToString } from './quantity';

export type { Brand } from './brand';

export type { Money } from './money';
export {
  ZERO_MONEY,
  toMoney,
  parseMoney,
  isMoney,
  addMoney,
  subtractMoney,
  scaleMoney,
  compareMoney,
  equalsMoney,
  moneyToString,
} from './money';

export type { Quantity } from './quantity';
export {
  ZERO_QUANTITY,
  toQuantity,
  parseQuantity,
  isQuantity,
  addQuantity,
  subtractQuantity,
  scaleQuantity,
  compareQuantity,
  equalsQuantity,
  quantityToString,
} from './quantity';

/**
 * The canonical money × quantity operation: a unit price times a quantity gives
 * a line total, rounded to money scale. This is the one place the two branded
 * types legitimately meet.
 */
export function lineTotal(unitPrice: Money, quantity: Quantity): Money {
  return scaleMoney(unitPrice, quantityToString(quantity));
}
