import {
  addMoney,
  compareMoney,
  moneyToString,
  quantityToString,
  scaleMoney,
  subtractMoney,
  ZERO_MONEY,
  type Money,
  type Quantity,
} from '@/lib/decimal';

export interface CostLine {
  label: string;
  amount: Money;
  /** Tailwind bg-* class for the stacked-bar segment + legend swatch. */
  colorClass: string;
  /** Excluded from gross margin (but not from total cost/net profit). */
  isOverhead?: boolean;
}

export interface DeductionLine {
  label: string;
  amount: Money;
}

/** Raw P&L inputs for one crop cycle — everything else below is derived. */
export interface CropPnlInputs {
  cycleId: string;
  /** e.g. "Rabi 2026" — for the header kicker, alongside field code + crop. */
  season: string;
  /** Pre-formatted, e.g. "2.97 t" — no hectare figure exists to derive this from yet. */
  yieldPerHaLabel: string;
  costBreakdown: CostLine[];
  quantitySoldKg: Quantity;
  grossRevenue: Money;
  deductions: DeductionLine[];
}

export interface CropPnl extends CropPnlInputs {
  totalCost: Money;
  directCost: Money;
  grossMargin: Money;
  netProfit: Money;
  /** Rounded ROI, e.g. 77 for "+77% ROI". */
  roiPercent: number;
  costPerKg: Money;
  breakEvenPerKg: Money;
  soldAtPerKg: Money;
  netReceived: Money;
}

/**
 * Derive every Crop P&L figure from the raw inputs — nothing is stored
 * independently, so the numbers can never drift out of reconciliation with
 * each other (net profit = revenue − total cost, gross margin excludes
 * overhead, cost/kg = total cost ÷ quantity sold, etc).
 */
export function computeCropPnl(inputs: CropPnlInputs): CropPnl {
  const totalCost = inputs.costBreakdown.reduce(
    (sum, line) => addMoney(sum, line.amount),
    ZERO_MONEY,
  );
  const overheadCost = inputs.costBreakdown
    .filter((line) => line.isOverhead)
    .reduce((sum, line) => addMoney(sum, line.amount), ZERO_MONEY);
  const directCost = subtractMoney(totalCost, overheadCost);

  const grossMargin = subtractMoney(inputs.grossRevenue, directCost);
  const netProfit = subtractMoney(inputs.grossRevenue, totalCost);

  const totalDeductions = inputs.deductions.reduce(
    (sum, line) => addMoney(sum, line.amount),
    ZERO_MONEY,
  );
  const netReceived = subtractMoney(inputs.grossRevenue, totalDeductions);

  // Per-kg figures divide Money by a plain quantity; the decimal helpers have
  // no Money-by-Money or Money-by-Quantity division, so this scales by the
  // reciprocal instead — converting through the string form (not the branded
  // value directly) keeps the same "display-only escape hatch" discipline as
  // src/features/home/money-ratio.ts, never letting the lint rule see an
  // operator applied to a Money/Quantity-typed operand.
  const kg = Number(quantityToString(inputs.quantitySoldKg));
  const perKgFactor = kg > 0 ? 1 / kg : 0;
  const costPerKg = scaleMoney(totalCost, perKgFactor);
  const soldAtPerKg = scaleMoney(inputs.grossRevenue, perKgFactor);

  const roiPercent =
    compareMoney(totalCost, ZERO_MONEY) > 0
      ? Math.round(
          (Number(moneyToString(netProfit)) /
            Number(moneyToString(totalCost))) *
            100,
        )
      : 0;

  return {
    ...inputs,
    totalCost,
    directCost,
    grossMargin,
    netProfit,
    roiPercent,
    costPerKg,
    breakEvenPerKg: costPerKg,
    soldAtPerKg,
    netReceived,
  };
}
