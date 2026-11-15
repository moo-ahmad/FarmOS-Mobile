import {
  ZERO_MONEY,
  addMoney,
  formatMoneyDisplay,
  lineTotal,
  parseMoney,
  toMoney,
  toQuantity,
  type Money,
} from '@/lib/decimal';

import { PayBasis } from './model';
import type {
  ActivityFormValues,
  InputLineValues,
  LaborLineValues,
  MachineLineValues,
} from './schema';

/*
 * Live cost previews while the farmer types. The server computes the real
 * amounts (same rounding: half-even to 2 places); these only show what a
 * line will come to. Half-typed values ("1.") preview as nothing, never NaN.
 */

function safeLineTotal(price: string, quantity: string): Money | null {
  try {
    return lineTotal(toMoney(price.trim()), toQuantity(quantity.trim()));
  } catch {
    return null;
  }
}

function safeMoney(value: string): Money | null {
  try {
    return toMoney(value.trim());
  } catch {
    return null;
  }
}

/** Quantity × unit cost. */
export function inputLineCost(line: InputLineValues): Money | null {
  return safeLineTotal(line.unitCost, line.quantityValue);
}

/** Hourly: rate × hours; piece rate: rate × units; daily and contract: the flat rate. */
export function laborLineCost(line: LaborLineValues): Money | null {
  if (line.payBasis === PayBasis.Hourly) {
    return safeLineTotal(line.rate, line.hours);
  }
  if (line.payBasis === PayBasis.PieceRate) {
    return safeLineTotal(line.rate, line.units);
  }
  return safeMoney(line.rate);
}

/** Hours × hourly charge. Fuel is recorded but not added — it's costed where it was bought. */
export function machineLineCost(line: MachineLineValues): Money | null {
  return safeLineTotal(line.hourlyChargeRate, line.hours);
}

/** The whole activity's cost so far; lines that don't parse yet count as nothing. */
export function activityCost(values: ActivityFormValues): Money {
  const lines = [
    ...values.inputs.map(inputLineCost),
    ...values.laborLines.map(laborLineCost),
    ...values.machineLines.map(machineLineCost),
  ];
  return lines.reduce<Money>(
    (total, cost) => (cost ? addMoney(total, cost) : total),
    ZERO_MONEY,
  );
}

/** "Rs 1,200" for a preview, or "—" when it can't be worked out yet. */
export function costLabel(cost: Money | null): string {
  return cost ? `Rs ${formatMoneyDisplay(cost)}` : '—';
}

/** "Rs 1,200" for an amount the API sent as a JSON number. Display only. */
export function apiCostLabel(amount: number): string {
  return `Rs ${formatMoneyDisplay(parseMoney(String(amount)))}`;
}
