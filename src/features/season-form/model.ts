import {
  Lookup,
  lookupCodeOf,
  lookupCodes,
  type LookupCode,
} from '@/lib/lookups';

/** A `SeasonType` lookup code — Rabi, Kharif, Annual, Perennial. */
export type SeasonKind = LookupCode<'SeasonType'>;

export const SEASON_KINDS: readonly SeasonKind[] = lookupCodes('SeasonType');

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

/** `SeasonType` wire values, from the generated lookup catalogue. */
export const SEASON_TYPE_WIRE = Lookup.SeasonType;

/** Wire value → kind; `undefined` for a value this app doesn't know. */
export function seasonKindFromWire(value: number): SeasonKind | undefined {
  return lookupCodeOf('SeasonType', value);
}
