import type { TagVariant } from '@/components/ui';

/**
 * Sample data for the Fields screen (canvas `1a`, frame 4). Stands in for the
 * fields domain until the API exposes it — see the same caveat on
 * src/features/home/fixtures.ts.
 */
export interface Field {
  id: string;
  code: string;
  title: string;
  areaHa: number;
  note: string;
  /** Muted grey badge/border (currently only the fallow field). */
  fallow: boolean;
  tagLabel: string;
  tagVariant: TagVariant;
}

/** The map diagram's layout is fixed to these exact 4 parcels (see FieldMap). */
export const fields: readonly [Field, Field, Field, Field] = [
  {
    id: 'field-f1',
    code: 'F1',
    title: 'Cotton · IUB-13',
    areaHa: 3.4,
    note: 'Sandy loam',
    fallow: false,
    tagLabel: 'Flowering',
    tagVariant: 'neutral',
  },
  {
    id: 'field-f2',
    code: 'F2',
    title: 'Fallow',
    areaHa: 1.2,
    note: 'Resting',
    fallow: true,
    tagLabel: 'Idle',
    tagVariant: 'neutral',
  },
  {
    id: 'field-f3',
    code: 'F3',
    title: 'Wheat · Faisal-11',
    areaHa: 2.1,
    note: 'Clay loam',
    fallow: false,
    tagLabel: 'Ready 14d',
    tagVariant: 'solid',
  },
  {
    id: 'field-f4',
    code: 'F4',
    title: 'Mango orchard',
    areaHa: 2.9,
    note: '148 trees',
    fallow: false,
    tagLabel: 'Perennial',
    tagVariant: 'neutral',
  },
];
