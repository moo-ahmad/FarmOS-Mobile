import type { IrrigationSourceDto } from '@/lib/irrigation-sources';
import type { SeasonDto } from '@/lib/seasons';

export interface FarmSetupStatus {
  /** At least one season that isn't closed — crop cycles attach to one. */
  hasOpenSeason: boolean;
  hasIrrigationSource: boolean;
  complete: boolean;
}

/** Pure check behind `useFarmSetup`, split out so it can be unit-tested. */
export function computeFarmSetupStatus(
  seasons: readonly SeasonDto[],
  irrigationSources: readonly IrrigationSourceDto[],
): FarmSetupStatus {
  const hasOpenSeason = seasons.some((season) => !season.isClosed);
  const hasIrrigationSource = irrigationSources.length > 0;
  return {
    hasOpenSeason,
    hasIrrigationSource,
    complete: hasOpenSeason && hasIrrigationSource,
  };
}
