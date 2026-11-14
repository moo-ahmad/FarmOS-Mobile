import { describe, expect, it } from '@jest/globals';

import type { CropCycleDto } from '@/lib/crop-cycles';
import { ApiError } from '@/lib/http/errors';

import { areaLabel, cycleDateLine, cycleSubtitle } from './display';
import { deleteCropCycleErrorMessage } from './errors';
import {
  emptyCropCycleForm,
  toCreateCropCycleRequest,
  toCropCycleFormValues,
  toUpdateCropCycleRequest,
} from './form-values';
import {
  CropCycleStatus,
  availableTransitions,
  cropCycleStatusLabel,
  isEndedStatus,
  matchesFilter,
} from './model';
import { cropCycleFormSchema } from './schema';

const cycle: CropCycleDto = {
  cropCycleId: 7,
  publicId: 'p',
  fieldId: 3,
  seasonId: 2,
  cropId: 1,
  varietyId: 11,
  cycleCode: 'F3-WHEAT-R2627',
  plannedSowDate: '2026-11-20',
  actualSowDate: null,
  plannedHarvestDate: '2027-04-15',
  actualHarvestStart: null,
  actualHarvestEnd: null,
  areaSownValue: 2.5,
  areaUomId: 28,
  seedQuantityValue: 50,
  seedUomId: 1,
  seedSupplierId: 4,
  seedLotCode: 'LOT-9',
  seedCost: 12500,
  germinationPct: null,
  germinationCheckDate: null,
  plantPopulationPerAcre: null,
  expectedYieldValue: 40,
  actualYieldValue: null,
  yieldUomId: 1,
  actualYieldKg: null,
  status: CropCycleStatus.Planned,
  terminationReason: null,
  isIntercrop: false,
  intercropParentCycleId: null,
  areaSharePct: 100,
  notes: null,
  stages: [],
};

describe('crop cycle lifecycle', () => {
  it('offers the next step plus failed/abandoned from each open state', () => {
    expect(
      availableTransitions(CropCycleStatus.Planned).map((t) => t.to),
    ).toEqual([
      CropCycleStatus.Sown,
      CropCycleStatus.Failed,
      CropCycleStatus.Abandoned,
    ]);
    expect(availableTransitions(CropCycleStatus.Harvesting)[0]).toMatchObject({
      to: CropCycleStatus.Closed,
      input: 'harvestEnd',
    });
  });

  it('asks for a sowing date when sowing and a reason when ending early', () => {
    const [sow, failed] = availableTransitions(CropCycleStatus.Planned);
    expect(sow?.input).toBe('sowDate');
    expect(failed?.input).toBe('reason');
  });

  it('offers nothing once a cycle has ended', () => {
    for (const status of [
      CropCycleStatus.Closed,
      CropCycleStatus.Failed,
      CropCycleStatus.Abandoned,
    ]) {
      expect(isEndedStatus(status)).toBe(true);
      expect(availableTransitions(status)).toEqual([]);
    }
  });

  it('splits the list into active and ended', () => {
    expect(matchesFilter(CropCycleStatus.Growing, 'active')).toBe(true);
    expect(matchesFilter(CropCycleStatus.Growing, 'ended')).toBe(false);
    expect(matchesFilter(CropCycleStatus.Closed, 'ended')).toBe(true);
    expect(matchesFilter(CropCycleStatus.Closed, 'all')).toBe(true);
  });

  it('labels statuses from the lookup catalogue', () => {
    expect(cropCycleStatusLabel(CropCycleStatus.Harvesting)).toMatch(
      /harvest/i,
    );
    expect(cropCycleStatusLabel(99999)).toBe('Unknown');
  });
});

describe('cropCycleFormSchema', () => {
  const valid = {
    ...emptyCropCycleForm({ fieldId: 3, seasonId: 2 }),
    cropId: 1,
    areaSownValue: '2.5',
  };

  it('accepts a cycle with only the required picks and an area', () => {
    expect(cropCycleFormSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ['no field', { fieldId: null }],
    ['no crop', { cropId: null }],
    ['a zero area', { areaSownValue: '0' }],
    ['an area that is not a number', { areaSownValue: 'abc' }],
    ['an impossible sowing date', { plannedSowDate: '2026-02-30' }],
    [
      'a harvest before sowing',
      { plannedSowDate: '2026-11-20', plannedHarvestDate: '2026-11-01' },
    ],
  ])('rejects %s', (_label, patch) => {
    expect(cropCycleFormSchema.safeParse({ ...valid, ...patch }).success).toBe(
      false,
    );
  });
});

describe('crop cycle requests', () => {
  it('creates in the field unit and crop yield unit, area as a string', () => {
    const body = toCreateCropCycleRequest(
      { ...toCropCycleFormValues(cycle), notes: '  ' },
      { areaUomId: 28, yieldUomId: 1 },
    );
    expect(body).toMatchObject({
      fieldId: 3,
      seasonId: 2,
      cropId: 1,
      varietyId: 11,
      areaSownValue: '2.5',
      areaUomId: 28,
      yieldUomId: 1,
      plannedSowDate: '2026-11-20',
      isIntercrop: false,
      areaSharePct: '100',
      notes: null,
    });
  });

  it('carries the fields the form hides over on update', () => {
    const body = toUpdateCropCycleRequest(
      { ...toCropCycleFormValues(cycle), areaSownValue: '2', varietyId: null },
      cycle,
    );
    expect(body).toEqual({
      varietyId: null,
      areaSownValue: '2',
      areaUomId: 28,
      plannedSowDate: '2026-11-20',
      plannedHarvestDate: '2027-04-15',
      expectedYieldValue: '40',
      seedQuantityValue: '50',
      seedUomId: 1,
      seedSupplierId: 4,
      seedLotCode: 'LOT-9',
      seedCost: '12500',
      plantPopulationPerAcre: null,
      notes: null,
    });
  });
});

describe('crop cycle display', () => {
  it('joins the names it has and skips the ones still loading', () => {
    expect(
      cycleSubtitle(cycle, {
        crop: () => 'Wheat',
        field: () => undefined,
        season: () => 'Rabi 2026-27',
      }),
    ).toBe('Wheat · Rabi 2026-27');
  });

  it('shows the date that says where the cycle stands', () => {
    expect(cycleDateLine(cycle)).toBe('Sowing planned 2026-11-20');
    expect(cycleDateLine({ ...cycle, actualSowDate: '2026-11-22' })).toBe(
      'Sown 2026-11-22',
    );
    expect(areaLabel(2.5, 28)).toBe('2.5 acre');
  });

  it('explains a 422 delete without relying on the API detail', () => {
    expect(
      deleteCropCycleErrorMessage(new ApiError(422, '/api/crop-cycles/7', {})),
    ).toMatch(/abandoned/);
  });
});
