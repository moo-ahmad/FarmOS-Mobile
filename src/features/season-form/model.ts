export type SeasonKind = 'Rabi' | 'Kharif' | 'Annual' | 'Perennial';

export const SEASON_KINDS: readonly SeasonKind[] = [
  'Rabi',
  'Kharif',
  'Annual',
  'Perennial',
];

export interface ExistingSeason {
  id: string;
  name: string;
  kind: SeasonKind;
  status: 'open' | 'closed';
  /** Calendar date, `YYYY-MM-DD`. */
  startDate: string;
  /** Calendar date, `YYYY-MM-DD`, inclusive. */
  endDate: string;
}

export interface SeasonFormValues {
  kind: SeasonKind;
  name: string;
  startDate: string;
  endDate: string;
}

export type SeasonFormErrors = Partial<
  Record<'name' | 'startDate' | 'endDate', string>
>;
