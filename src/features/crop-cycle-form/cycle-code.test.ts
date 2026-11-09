import { describe, expect, it } from '@jest/globals';

import { cropName, cycleCode } from './cycle-code';
import { crops, openSeasons } from './fixtures';

const wheat = crops[0]!;
const rabi2526 = openSeasons[0]!;
const rabi2627 = openSeasons[1]!;

describe('cropName', () => {
  it('drops the variety', () => {
    expect(cropName(wheat)).toBe('Wheat');
    expect(cropName({ id: 'x', title: 'Sugarcane' })).toBe('Sugarcane');
  });
});

describe('cycleCode', () => {
  it('joins field code, crop and season suffix', () => {
    expect(cycleCode('F3', wheat, rabi2526)).toBe('F3-WHEAT-R2526');
    expect(cycleCode('F3', wheat, rabi2627)).toBe('F3-WHEAT-R2627');
  });

  it('upper-cases the field code and strips spaces from the crop', () => {
    expect(
      cycleCode('f001', { id: 'x', title: 'Sweet corn · Local' }, rabi2526),
    ).toBe('F001-SWEETCORN-R2526');
  });
});

describe('openSeasons', () => {
  it('never lists a closed season', () => {
    expect(openSeasons.map((s) => s.name)).not.toContain('Kharif 2025');
  });
});
