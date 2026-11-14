import {
  Lookup,
  lookupCodeOf,
  lookupName,
  lookupValues,
  type LookupValue,
} from '@/lib/lookups';

/**
 * How a worker is engaged — the backend's `EmploymentType` lookup
 * (Permanent = 31000, …), from the generated catalogue.
 */
export const EmploymentType = Lookup.EmploymentType;
// A value + type pair under one name, so call sites read like an enum.
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EmploymentType = LookupValue<'EmploymentType'>;

export const EMPLOYMENT_TYPES: readonly EmploymentType[] =
  lookupValues('EmploymentType');

/** Display label for a wire value; "Other" for one this build doesn't know. */
export function employmentTypeLabel(value: number): string {
  const code = lookupCodeOf('EmploymentType', value);
  return code ? lookupName('EmploymentType', code) : 'Other';
}

export const EMPLOYMENT_TYPE_OPTIONS = EMPLOYMENT_TYPES.map((value) => ({
  value: value as number,
  label: employmentTypeLabel(value),
}));

/**
 * Owner and family labor is unpaid in cash but still has to be costed —
 * DESIGN §8: uncosted owner labor makes "profit per acre" fiction. These
 * types get a nudge to set a notional daily wage.
 */
export function isNotionallyWaged(value: number): boolean {
  return value === EmploymentType.Self || value === EmploymentType.Family;
}
