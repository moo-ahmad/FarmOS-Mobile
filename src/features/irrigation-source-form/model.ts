import { Lookup, lookupCodes, type LookupCode } from '@/lib/lookups';

/** Where the water comes from — an `IrrigationSourceType` lookup code. */
export type IrrigationSourceKind = LookupCode<'IrrigationSourceType'>;

/** How water from the source is charged — an `IrrigationCostModel` lookup code. */
export type IrrigationCostKind = LookupCode<'IrrigationCostModel'>;

export const SOURCE_KINDS = lookupCodes('IrrigationSourceType') as [
  IrrigationSourceKind,
  ...IrrigationSourceKind[],
];

export const COST_KINDS = lookupCodes('IrrigationCostModel') as [
  IrrigationCostKind,
  ...IrrigationCostKind[],
];

/** Wire values, from the generated lookup catalogue (`pnpm lookups:generate`). */
export const SOURCE_KIND_WIRE = Lookup.IrrigationSourceType;
export const COST_KIND_WIRE = Lookup.IrrigationCostModel;

export const COST_KIND_LABEL: Record<IrrigationCostKind, string> = {
  PerHour: 'Per hour',
  PerAcreInch: 'Per acre-inch',
  PerTurn: 'Per turn',
  Free: 'Free',
};

/** Label for the rate field under each paid cost model. */
export const RATE_LABEL: Record<Exclude<IrrigationCostKind, 'Free'>, string> = {
  PerHour: 'Rate per hour (Rs)',
  PerAcreInch: 'Rate per acre-inch (Rs)',
  PerTurn: 'Rate per turn (Rs)',
};

/** A sensible starting cost model for each source type. */
export const DEFAULT_COST_KIND: Record<
  IrrigationSourceKind,
  IrrigationCostKind
> = {
  Canal: 'PerTurn',
  Tubewell: 'PerHour',
  Rain: 'Free',
  Pond: 'Free',
  Purchased: 'PerHour',
};
