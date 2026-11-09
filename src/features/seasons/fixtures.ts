import { toMoney, toQuantity } from '@/lib/decimal';

import type { Season } from './model';

/**
 * Sample seasons for the Seasons list (design handoff: "10 - Seasons", "Seasons
 * list" frame). Stands in for a seasons endpoint, which the API doesn't expose
 * yet — same caveat as src/features/stock/fixtures.ts.
 */
export const seasons: Season[] = [
  {
    id: 'season-rabi-2025-26',
    name: 'Rabi 2025-26',
    type: 'Rabi',
    status: 'open',
    startDate: '2025-11-01',
    endDate: '2026-04-30',
    cycleCount: 2,
    plantedHectares: toQuantity('3.9'),
    cost: toMoney('7060'),
    revenue: toMoney('9062'),
    codeSuffix: 'R2526',
  },
  {
    id: 'season-kharif-2025',
    name: 'Kharif 2025',
    type: 'Kharif',
    status: 'closed',
    startDate: '2025-05-01',
    endDate: '2025-10-31',
    cycleCount: 0,
    plantedHectares: toQuantity('0'),
    cost: toMoney('0'),
    revenue: toMoney('0'),
    codeSuffix: 'K25',
  },
];
