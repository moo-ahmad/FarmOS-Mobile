import type { Money, Quantity } from '@/lib/decimal';

export type SeasonType = 'Rabi' | 'Kharif';

export type SeasonStatus = 'open' | 'closed';

export type SeasonFilter = 'all' | SeasonStatus;

export interface Season {
  id: string;
  name: string;
  type: SeasonType;
  status: SeasonStatus;
  /** Calendar date, `YYYY-MM-DD`. */
  startDate: string;
  /** Calendar date, `YYYY-MM-DD`; the season runs through this day inclusive. */
  endDate: string;
  cycleCount: number;
  plantedHectares: Quantity;
  cost: Money;
  revenue: Money;
  /** Suffix appended to the codes of crop cycles started in this season. */
  codeSuffix: string;
}
