import { scaleQuantity, type Quantity } from '@/lib/decimal';

/**
 * Net weight after field loss: grossWeight × (1 − lossPercent / 100).
 * `lossPercent` is the raw form string, parsed as a plain number purely to
 * derive the scale *factor* — the weight itself stays a proper Quantity
 * throughout, so this never does JS arithmetic on the branded value.
 */
export function computeNetWeight(
  grossWeight: Quantity,
  lossPercent: string,
): Quantity {
  const loss = Number(lossPercent);
  const safeLoss = Number.isFinite(loss) ? Math.min(100, Math.max(0, loss)) : 0;
  return scaleQuantity(grossWeight, (100 - safeLoss) / 100);
}
