import { toMoney, toQuantity } from '@/lib/decimal';

import type { CropPnlInputs } from './compute-pnl';

/**
 * Sample P&L inputs per crop cycle (canvas `1a`, frame 2 — the F3/Wheat
 * example matches the mock's own numbers exactly; see compute-pnl.test.ts).
 * Stands in for the derived P&L domain until the API exposes it — same
 * caveat as src/features/home/fixtures.ts. Keyed by src/features/home's
 * CropCycle id.
 */
export const cropPnlByCycleId: Record<string, CropPnlInputs> = {
  'cycle-f3-wheat': {
    cycleId: 'cycle-f3-wheat',
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
  },
  'cycle-f1-cotton': {
    cycleId: 'cycle-f1-cotton',
    season: 'Kharif 2026',
    yieldPerHaLabel: '0.94 t',
    costBreakdown: [
      { label: 'Inputs', amount: toMoney('1120'), colorClass: 'bg-ink' },
      { label: 'Labour', amount: toMoney('680'), colorClass: 'bg-accent' },
      {
        label: 'Machinery',
        amount: toMoney('310'),
        colorClass: 'bg-neutral-600',
      },
      {
        label: 'Irrigation',
        amount: toMoney('270'),
        colorClass: 'bg-neutral-400',
      },
      {
        label: 'Overhead (allocated)',
        amount: toMoney('420'),
        colorClass: 'bg-neutral-800',
        isOverhead: true,
      },
    ],
    quantitySoldKg: toQuantity('3200'),
    grossRevenue: toMoney('4480'),
    deductions: [
      { label: 'Mandi commission', amount: toMoney('260') },
      { label: 'Transport & labour', amount: toMoney('95') },
    ],
  },
  'cycle-f4-mango': {
    cycleId: 'cycle-f4-mango',
    season: '2026',
    yieldPerHaLabel: '1.17 t',
    costBreakdown: [
      { label: 'Inputs', amount: toMoney('960'), colorClass: 'bg-ink' },
      { label: 'Labour', amount: toMoney('540'), colorClass: 'bg-accent' },
      {
        label: 'Machinery',
        amount: toMoney('180'),
        colorClass: 'bg-neutral-600',
      },
      {
        label: 'Irrigation',
        amount: toMoney('310'),
        colorClass: 'bg-neutral-400',
      },
      {
        label: 'Overhead (allocated)',
        amount: toMoney('350'),
        colorClass: 'bg-neutral-800',
        isOverhead: true,
      },
    ],
    quantitySoldKg: toQuantity('2100'),
    grossRevenue: toMoney('3780'),
    deductions: [
      { label: 'Mandi commission', amount: toMoney('180') },
      { label: 'Transport & labour', amount: toMoney('60') },
    ],
  },
};
