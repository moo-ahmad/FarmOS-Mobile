import { describe, expect, it } from '@jest/globals';

import snapshot from '../../../docs/lookups.json';

import { FIELD_USAGE_TYPES, SOIL_TEXTURES } from '@/features/fields/model';

import {
  Lookup,
  LOOKUP_FLAGS_TYPES,
  lookupCodeOf,
  lookupCodes,
  lookupName,
  lookupValues,
  type LookupType,
} from '.';

interface SnapshotRow {
  lookupType: string;
  code: string;
  value: number;
  name: string;
  isActive: boolean;
  isFlags: boolean;
}

const rows = snapshot as SnapshotRow[];
const types = Object.keys(Lookup) as LookupType[];

describe('generated lookup codes', () => {
  it('match docs/lookups.json exactly (re-run pnpm lookups:generate)', () => {
    const fromSnapshot: Record<string, Record<string, number>> = {};
    for (const row of rows.filter((r) => r.isActive)) {
      (fromSnapshot[row.lookupType] ??= {})[row.code] = row.value;
    }
    expect(Lookup).toEqual(fromSnapshot);
  });

  it('follow the backend rule: one 1000-block per type, members numbered from its start', () => {
    for (const type of types) {
      if ((LOOKUP_FLAGS_TYPES as readonly string[]).includes(type)) continue;
      const values = lookupValues(type) as number[];
      const base = Math.floor(values[0]! / 1000) * 1000;
      expect(base).toBeGreaterThan(0);
      values.forEach((value, index) => expect(value).toBe(base + index));
    }
  });

  it('give every type its own block', () => {
    const blocks = types
      .filter((t) => !(LOOKUP_FLAGS_TYPES as readonly string[]).includes(t))
      .map((t) => Math.floor((lookupValues(t) as number[])[0]! / 1000));
    expect(new Set(blocks).size).toBe(blocks.length);
  });
});

describe('the enums the app sends', () => {
  it('uses lookup ids for FieldUsageType (was 0-5)', () => {
    expect(Lookup.FieldUsageType.RowCrop).toBe(35000);
    expect(FIELD_USAGE_TYPES).toEqual([
      35000, 35001, 35002, 35003, 35004, 35005,
    ]);
  });

  it('uses SoilTexture lookup values (47000-47011) with API labels', () => {
    expect(SOIL_TEXTURES).toHaveLength(12);
    expect(SOIL_TEXTURES[0]).toEqual({
      id: 47000,
      code: 'Sand',
      label: 'Sand',
    });
    expect(SOIL_TEXTURES.find((t) => t.code === 'SandyLoam')).toEqual({
      id: 47002,
      code: 'SandyLoam',
      label: 'Sandy Loam',
    });
    expect(SOIL_TEXTURES.at(-1)?.id).toBe(47011);
  });

  it('uses lookup ids for seasons and irrigation sources', () => {
    expect(Lookup.SeasonType.Rabi).toBe(34000);
    expect(Lookup.IrrigationSourceType.Tubewell).toBe(36001);
    expect(Lookup.IrrigationCostModel.Free).toBe(37003);
  });
});

describe('helpers', () => {
  it('lists codes in backend sort order', () => {
    expect(lookupCodes('SeasonType')).toEqual([
      'Rabi',
      'Kharif',
      'Annual',
      'Perennial',
    ]);
  });

  it('maps a wire value back to its code', () => {
    expect(lookupCodeOf('ActivityType', 1008)).toBe('Harvest');
    expect(lookupCodeOf('ActivityType', 6)).toBeUndefined();
  });

  it('uses the API display label, including [Description] overrides', () => {
    expect(lookupName('ActivityType', 'PostHarvest')).toBe('Post Harvest');
    expect(lookupName('PaymentMethod', 'EasyPaisa')).toBe('EasyPaisa');
    expect(lookupName('WeatherSource', 'Api')).toBe('API');
  });
});
