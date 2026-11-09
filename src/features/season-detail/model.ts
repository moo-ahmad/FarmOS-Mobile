import type { Money, Quantity } from '@/lib/decimal';

export type SeasonKind = 'Rabi' | 'Kharif' | 'Annual' | 'Perennial';

export type SeasonStatus = 'open' | 'closed';

export type CycleStatus = 'Active' | 'Harvested' | 'Closed';

export interface SeasonCycle {
  /** Crop P&L route id. */
  id: string;
  fieldCode: string;
  /** e.g. "Wheat · Faisal-11". */
  title: string;
  /** e.g. "F3-WHEAT-R2526". */
  cycleCode: string;
  areaHectares: Quantity;
  status: CycleStatus;
}

export interface SeasonDetail {
  id: string;
  name: string;
  kind: SeasonKind;
  status: SeasonStatus;
  /** Calendar date, `YYYY-MM-DD`. */
  startDate: string;
  /** Calendar date, `YYYY-MM-DD`, inclusive. */
  endDate: string;
  codeSuffix: string;
  plantedHectares: Quantity;
  cost: Money;
  revenue: Money;
  cycles: SeasonCycle[];
}
