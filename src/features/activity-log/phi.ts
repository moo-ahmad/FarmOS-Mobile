import { addDays } from 'date-fns';

import { parseUtc, toUtcIso, type UtcIso } from '@/lib/datetime';

/**
 * Pre-harvest interval, in days, by product. A stand-in for a real product
 * database — see the fixtures caveat in ../home/fixtures.ts.
 */
export const PRODUCT_PHI_DAYS: Record<string, number> = {
  'Emamectin 1.9EC': 7,
  'Cypermethrin 10EC': 5,
  'Imidacloprid 200SL': 14,
};

/** Look up a product's PHI, matching case-insensitively and trimmed. */
export function lookupPhiDays(product: string): number | undefined {
  const key = Object.keys(PRODUCT_PHI_DAYS).find(
    (name) => name.toLowerCase() === product.trim().toLowerCase(),
  );
  return key ? PRODUCT_PHI_DAYS[key] : undefined;
}

/** The instant after which the crop is safe to harvest. */
export function computeSafeHarvestDate(
  occurredAtUtc: UtcIso,
  phiDays: number,
): UtcIso {
  return toUtcIso(addDays(parseUtc(occurredAtUtc), phiDays));
}
