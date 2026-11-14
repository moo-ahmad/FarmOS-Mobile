import {
  Lookup,
  lookupCodeOf,
  lookupName,
  lookupValues,
  type LookupValue,
} from '@/lib/lookups';

/**
 * The kind of buyer — the backend's `CustomerType` lookup. Values come from
 * the generated catalogue (Arthi = 24000, …), never hand-typed.
 */
export const CustomerType = Lookup.CustomerType;
// A value + type pair under one name, so call sites read like an enum.
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CustomerType = LookupValue<'CustomerType'>;

export const CUSTOMER_TYPES: readonly CustomerType[] =
  lookupValues('CustomerType');

/** Display label for a wire value; "Other" for one this build doesn't know. */
export function customerTypeLabel(value: number): string {
  const code = lookupCodeOf('CustomerType', value);
  return code ? lookupName('CustomerType', code) : 'Other';
}

export const CUSTOMER_TYPE_OPTIONS = CUSTOMER_TYPES.map((value) => ({
  value: value as number,
  label: customerTypeLabel(value),
}));
