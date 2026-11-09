import type { ExistingSeason } from './model';

/**
 * The farm's current seasons, used for the duplicate-name and overlap checks
 * and to prefill Edit. Stands in for a seasons endpoint the API doesn't expose
 * yet (design handoff: "10 - Seasons").
 */
export const existingSeasons: ExistingSeason[] = [
  {
    id: 'season-rabi-2025-26',
    name: 'Rabi 2025-26',
    kind: 'Rabi',
    status: 'open',
    startDate: '2025-11-01',
    endDate: '2026-04-30',
  },
  {
    id: 'season-kharif-2025',
    name: 'Kharif 2025',
    kind: 'Kharif',
    status: 'closed',
    startDate: '2025-05-01',
    endDate: '2025-10-31',
  },
];
