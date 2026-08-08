import { describe, expect, it } from '@jest/globals';

import { moneyToString, toMoney, toQuantity } from '@/lib/decimal';

import { computeCropPnl, type CropPnlInputs } from './compute-pnl';

// The exact F3 · Wheat example from the design canvas (frame 2). Every
// headline figure in the mock is reproduced here as a *derived* check, not
// duplicated as a separate stored value.
const f3: CropPnlInputs = {
  cycleId: 'cycle-f3',
  season: 'Rabi 2026',
  yieldPerHaLabel: '2.97 t',
  costBreakdown: [
    { label: 'Inputs', amount: toMoney('1840'), colorClass: 'bg-ink' },
    { label: 'Labour', amount: toMoney('1180'), colorClass: 'bg-accent' },
    {
      label: 'Machinery',
      amount: toMoney('640'),
      colorClass: 'bg-neutral-600',
    },
    {
      label: 'Irrigation',
      amount: toMoney('540'),
      colorClass: 'bg-neutral-400',
    },
    {
      label: 'Overhead (allocated)',
      amount: toMoney('920'),
      colorClass: 'bg-neutral-800',
      isOverhead: true,
    },
  ],
  quantitySoldKg: toQuantity('6240'),
  grossRevenue: toMoney('9062'),
  deductions: [
    { label: 'Mandi commission', amount: toMoney('540') },
    { label: 'Transport & labour', amount: toMoney('180') },
  ],
};

describe('computeCropPnl — reconciles the design canvas example exactly', () => {
  const pnl = computeCropPnl(f3);

  it('total cost sums the breakdown: $5,120', () => {
    expect(moneyToString(pnl.totalCost)).toBe('5120.00');
  });

  it('net profit = revenue − total cost: $3,942', () => {
    expect(moneyToString(pnl.netProfit)).toBe('3942.00');
  });

  it('gross margin excludes overhead: $4,862', () => {
    expect(moneyToString(pnl.grossMargin)).toBe('4862.00');
  });

  it('ROI ≈ 77%', () => {
    expect(pnl.roiPercent).toBe(77);
  });

  it('cost/kg ≈ $0.82', () => {
    expect(moneyToString(pnl.costPerKg)).toBe('0.82');
  });

  it('break-even equals cost/kg', () => {
    expect(moneyToString(pnl.breakEvenPerKg)).toBe(
      moneyToString(pnl.costPerKg),
    );
  });

  it('sold-at ≈ $1.45', () => {
    expect(moneyToString(pnl.soldAtPerKg)).toBe('1.45');
  });

  it('net received = revenue − deductions: $8,342', () => {
    expect(moneyToString(pnl.netReceived)).toBe('8342.00');
  });
});

describe('computeCropPnl — edge cases', () => {
  it('handles zero quantity sold without dividing by zero', () => {
    const pnl = computeCropPnl({ ...f3, quantitySoldKg: toQuantity('0') });
    expect(moneyToString(pnl.costPerKg)).toBe('0.00');
  });

  it('handles zero total cost without dividing by zero', () => {
    const pnl = computeCropPnl({ ...f3, costBreakdown: [] });
    expect(pnl.roiPercent).toBe(0);
  });
});
