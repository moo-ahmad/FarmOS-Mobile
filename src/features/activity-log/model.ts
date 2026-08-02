/**
 * Activity-log domain vocabulary. These enum literals must stay in sync with the
 * `activity_logs` table in src/db/schema.ts.
 */

export const ACTIVITY_TYPES = [
  'irrigation',
  'fertilizer',
  'pesticide',
  'harvest',
  'other',
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const UNITS = ['kg', 'L', 'bag', 'hour', 'acre'] as const;
export type Unit = (typeof UNITS)[number];

/** i18n keys for activity-type labels (units are symbols, shown as-is). */
export const ACTIVITY_TYPE_TKEY: Record<ActivityType, string> = {
  irrigation: 'activity.types.irrigation',
  fertilizer: 'activity.types.fertilizer',
  pesticide: 'activity.types.pesticide',
  harvest: 'activity.types.harvest',
  other: 'activity.types.other',
};
