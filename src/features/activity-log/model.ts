/**
 * Activity-log domain vocabulary (Log Activity, canvas `1a` frame 6). These
 * enum literals must stay in sync with the `activity_logs` table in
 * src/db/schema.ts.
 */

export const OPERATIONS = [
  'irrigation',
  'spray',
  'fertilizer',
  'weeding',
] as const;
export type Operation = (typeof OPERATIONS)[number];

export const OPERATION_LABEL: Record<Operation, string> = {
  irrigation: 'Irrigation',
  spray: 'Spray',
  fertilizer: 'Fertilizer',
  weeding: 'Weeding',
};

/** Only a spray records a product/dose/water/PHI — the rest just log the operation. */
export function requiresSprayDetails(operation: Operation): boolean {
  return operation === 'spray';
}

// Fixed units for now — the design shows no unit picker, only a filled example
// ("200 ml", "120 L"). Revisit if products with other units are added.
export const DOSE_UNIT = 'ml';
export const WATER_UNIT = 'L';
