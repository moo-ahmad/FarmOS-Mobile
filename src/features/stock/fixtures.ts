import { toMoney, type Money } from '@/lib/decimal';

import type { StockItem } from './model';

/**
 * Sample data for the Inventory screen (canvas `1a`, frame 9). Stands in for
 * the derived stock/valuation domain, which is not modeled yet — same caveat
 * as src/features/home/fixtures.ts. Fill/threshold fractions reproduce the
 * mock's bar widths exactly; they aren't derived from a capacity figure
 * because the mock itself doesn't imply one consistently.
 */
export const stockValuation: Money = toMoney('8410');

export const stockItems: StockItem[] = [
  {
    id: 'urea',
    name: 'Urea 46-0-0',
    status: 'low',
    onHandLabel: '2 bags on hand',
    reorderLabel: 'reorder at 5',
    fillFraction: 0.14,
    thresholdFraction: 0.33,
  },
  {
    id: 'emamectin',
    name: 'Emamectin 1.9 EC',
    status: 'low',
    onHandLabel: '1.2 L on hand · exp Nov 26',
    reorderLabel: 'reorder at 2 L',
    fillFraction: 0.24,
    thresholdFraction: 0.4,
  },
  {
    id: 'dap',
    name: 'DAP 18-46-0',
    status: 'ok',
    onHandLabel: '11 bags on hand',
    reorderLabel: 'reorder at 4',
    fillFraction: 0.78,
  },
  {
    id: 'diesel',
    name: 'Diesel',
    status: 'ok',
    onHandLabel: '180 L on hand',
    reorderLabel: 'reorder at 60 L',
    fillFraction: 0.64,
  },
  {
    id: 'wheat-seed',
    name: 'Wheat seed · Faisal-11',
    status: 'ok',
    onHandLabel: '40 kg on hand',
    reorderLabel: 'reorder at 10 kg',
    fillFraction: 0.88,
  },
];
