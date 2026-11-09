import type { Crop, OpenSeason } from './model';

/**
 * Crops and open seasons for the Crop-cycle form (design handoff: "10 -
 * Seasons", "Crop-cycle form" frame). Stand-ins for crop and season endpoints
 * the API doesn't expose yet. Closed seasons (e.g. Kharif 2025) are left out on
 * purpose: the form only lists open ones.
 */
export const crops: Crop[] = [
  { id: 'crop-wheat-faisal-11', title: 'Wheat · Faisal-11' },
  { id: 'crop-mustard-brassica', title: 'Mustard · Brassica' },
  { id: 'crop-cotton-iub-13', title: 'Cotton · IUB-13' },
  { id: 'crop-mango-sindhri', title: 'Mango · Sindhri' },
];

export const openSeasons: OpenSeason[] = [
  {
    id: 'season-rabi-2025-26',
    name: 'Rabi 2025-26',
    kind: 'Rabi',
    codeSuffix: 'R2526',
    startDate: '2025-11-01',
    endDate: '2026-04-30',
  },
  {
    id: 'season-rabi-2026-27',
    name: 'Rabi 2026-27',
    kind: 'Rabi',
    codeSuffix: 'R2627',
    startDate: '2026-11-01',
    endDate: '2027-04-30',
  },
];
