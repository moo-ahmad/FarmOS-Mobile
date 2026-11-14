import { Lookup, LookupName } from './codes';

export { Lookup, LookupName, LOOKUP_FLAGS_TYPES } from './codes';

/** A backend enum's name, e.g. `'SeasonType'`. */
export type LookupType = keyof typeof Lookup;

/** A member's stable code within a type, e.g. `'Rabi'` for `SeasonType`. */
export type LookupCode<T extends LookupType> = keyof (typeof Lookup)[T] &
  string;

/** The wire value of a member of `T`, e.g. `34000` for `SeasonType.Rabi`. */
export type LookupValue<T extends LookupType> =
  (typeof Lookup)[T][LookupCode<T>];

/** Every code of a type, in the backend's declaration (sort) order. */
export function lookupCodes<T extends LookupType>(type: T): LookupCode<T>[] {
  return Object.keys(Lookup[type]) as LookupCode<T>[];
}

/** Every wire value of a type, in the backend's declaration (sort) order. */
export function lookupValues<T extends LookupType>(type: T): LookupValue<T>[] {
  return Object.values(Lookup[type]) as LookupValue<T>[];
}

/**
 * Wire value → code, or `undefined` for a value this build doesn't know
 * (e.g. a member added on the server after this app shipped).
 */
export function lookupCodeOf<T extends LookupType>(
  type: T,
  value: number,
): LookupCode<T> | undefined {
  const entry = Object.entries(Lookup[type]).find(([, v]) => v === value);
  return entry?.[0] as LookupCode<T> | undefined;
}

/** The API's display label for a code. */
export function lookupName<T extends LookupType>(
  type: T,
  code: LookupCode<T>,
): string {
  return (LookupName[type] as Record<string, string>)[code] ?? code;
}
