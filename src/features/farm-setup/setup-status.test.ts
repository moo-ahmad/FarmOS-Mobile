import { describe, expect, it } from '@jest/globals';

import type { IrrigationSourceDto } from '@/lib/irrigation-sources';
import type { SeasonDto } from '@/lib/seasons';

import { computeFarmSetupStatus } from './setup-status';

function season(isClosed: boolean): SeasonDto {
  return {
    seasonId: 1,
    publicId: 'p',
    name: 'Rabi 2026-27',
    seasonType: 34000,
    startDate: '2026-11-01',
    endDate: '2027-04-30',
    isClosed,
  };
}

const source: IrrigationSourceDto = {
  irrigationSourceId: 1,
  publicId: 'p',
  name: 'Main tubewell',
  sourceType: 36001,
  costModel: 37000,
  ratePerUnit: 350,
  dischargeLpm: null,
  pumpAssetId: null,
};

describe('computeFarmSetupStatus', () => {
  it('is incomplete for a brand-new farm', () => {
    expect(computeFarmSetupStatus([], [])).toEqual({
      hasOpenSeason: false,
      hasIrrigationSource: false,
      complete: false,
    });
  });

  it('does not count a closed season', () => {
    expect(computeFarmSetupStatus([season(true)], [source]).hasOpenSeason).toBe(
      false,
    );
  });

  it('is complete with an open season and a source', () => {
    expect(
      computeFarmSetupStatus([season(true), season(false)], [source]).complete,
    ).toBe(true);
  });
});
