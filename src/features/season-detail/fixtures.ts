import { toMoney, toQuantity } from '@/lib/decimal';

import type { SeasonDetail } from './model';

/**
 * Sample seasons for Season detail (design handoff: "10 - Seasons", "Season
 * detail & close" frames). Stands in for a seasons endpoint the API doesn't
 * expose yet.
 */
export const seasonDetails: SeasonDetail[] = [
  {
    id: 'season-rabi-2025-26',
    name: 'Rabi 2025-26',
    kind: 'Rabi',
    status: 'open',
    startDate: '2025-11-01',
    endDate: '2026-04-30',
    codeSuffix: 'R2526',
    plantedHectares: toQuantity('3.9'),
    cost: toMoney('7060'),
    revenue: toMoney('9062'),
    cycles: [
      {
        id: 'cycle-f3-wheat',
        fieldCode: 'F3',
        title: 'Wheat · Faisal-11',
        cycleCode: 'F3-WHEAT-R2526',
        areaHectares: toQuantity('2.1'),
        status: 'Active',
      },
      {
        id: 'cycle-f2-mustard',
        fieldCode: 'F2',
        title: 'Mustard · Brassica',
        cycleCode: 'F2-MUSTARD-R2526',
        areaHectares: toQuantity('1.8'),
        status: 'Harvested',
      },
    ],
  },
  {
    id: 'season-kharif-2025',
    name: 'Kharif 2025',
    kind: 'Kharif',
    status: 'closed',
    startDate: '2025-05-01',
    endDate: '2025-10-31',
    codeSuffix: 'K25',
    plantedHectares: toQuantity('0'),
    cost: toMoney('0'),
    revenue: toMoney('0'),
    cycles: [],
  },
];
