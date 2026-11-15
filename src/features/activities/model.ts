import {
  Lookup,
  lookupCodeOf,
  lookupName,
  lookupValues,
  type LookupType,
  type LookupValue,
} from '@/lib/lookups';

/*
 * Activity vocabulary from the generated lookup catalogue: ActivityType
 * (LandPrep = 1000, …), ActivityStatus (Planned = 2000, …) and PayBasis
 * (Daily = 3000, …). Value + type pairs under one name, so call sites read
 * like enums.
 */

export const ActivityType = Lookup.ActivityType;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ActivityType = LookupValue<'ActivityType'>;

export const ActivityStatus = Lookup.ActivityStatus;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ActivityStatus = LookupValue<'ActivityStatus'>;

export const PayBasis = Lookup.PayBasis;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PayBasis = LookupValue<'PayBasis'>;

function labelOf(type: LookupType, value: number, fallback: string): string {
  const code = lookupCodeOf(type, value);
  return code ? lookupName(type, code) : fallback;
}

export const activityTypeLabel = (value: number) =>
  labelOf('ActivityType', value, 'Activity');
export const activityStatusLabel = (value: number) =>
  labelOf('ActivityStatus', value, 'Unknown');
export const payBasisLabel = (value: number) =>
  labelOf('PayBasis', value, 'Other');

const toOptions = (values: readonly number[], label: (v: number) => string) =>
  values.map((value) => ({ value, label: label(value) }));

export const ACTIVITY_TYPE_OPTIONS = toOptions(
  lookupValues('ActivityType'),
  activityTypeLabel,
);
export const ACTIVITY_STATUS_OPTIONS = toOptions(
  lookupValues('ActivityStatus'),
  activityStatusLabel,
);
export const PAY_BASIS_OPTIONS = toOptions(
  lookupValues('PayBasis'),
  payBasisLabel,
);

/** What the activity is done to. A crop cycle is the usual target — that's where costs land. */
export type ActivityTarget = 'cycle' | 'field' | 'farm';

export const TARGET_OPTIONS: readonly {
  value: ActivityTarget;
  label: string;
}[] = [
  { value: 'cycle', label: 'Crop cycle' },
  { value: 'field', label: 'Field' },
  { value: 'farm', label: 'Whole farm' },
];

/** Hourly pay needs hours; piece rate needs units; daily and contract are flat amounts. */
export function payBasisNeeds(basis: number): 'hours' | 'units' | null {
  if (basis === PayBasis.Hourly) return 'hours';
  if (basis === PayBasis.PieceRate) return 'units';
  return null;
}

/**
 * Deep links from reminders name an operation ("spray"); map it onto the
 * activity type. Unknown names fall through to the form's default.
 */
const OPERATION_TYPES: Record<string, ActivityType> = {
  irrigation: ActivityType.Irrigation,
  spray: ActivityType.Spray,
  fertilizer: ActivityType.Fertilizer,
  weeding: ActivityType.Weeding,
  sowing: ActivityType.Sowing,
  harvest: ActivityType.Harvest,
};

export function activityTypeForOperation(
  operation: string | undefined,
): ActivityType | undefined {
  return operation ? OPERATION_TYPES[operation.toLowerCase()] : undefined;
}

/** Units an input can be measured in: seed and fertilizer by mass, sprays by volume, plants by count. */
export const INPUT_DIMENSIONS: readonly number[] = [
  Lookup.Dimension.Mass,
  Lookup.Dimension.Volume,
  Lookup.Dimension.Count,
];
