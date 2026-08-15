import type { TagVariant } from '@/components/ui';
import { toMoney, type Money } from '@/lib/decimal';

import type { IrrigationSource, SoilType } from './model';

/**
 * Sample data for the Fields feature (design handoff: FarmOS Land). Stands
 * in for the fields domain until the API exposes it — see the same caveat on
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
  soilType: SoilType;
  irrigationSource: IrrigationSource;
  boundaryMapped: boolean;
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
    soilType: 'sandy-loam',
    irrigationSource: 'tubewell',
    boundaryMapped: false,
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
    soilType: 'loam',
    irrigationSource: 'rain-fed',
    boundaryMapped: false,
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
    soilType: 'clay-loam',
    irrigationSource: 'tubewell',
    boundaryMapped: false,
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
    soilType: 'loam',
    irrigationSource: 'drip',
    boundaryMapped: false,
  },
];

export interface CropHistoryEntry {
  id: string;
  month: string;
  year: number;
  cropTitle: string;
  /** e.g. "Rabi 2026 · 18 Dec – open". */
  seasonLabel: string;
  status: 'active' | 'completed';
  /** Net cycle result; omitted while `status` is "active" (still open). */
  netAmount?: Money;
}

/**
 * Crop-rotation history per field (design handoff: FarmOS Land, "Field 3"
 * detail frame) — F3's 5 entries match the handoff's numbers exactly. The
 * handoff's header/grid for that frame shows F1's stats (3.4 ha, Sandy loam)
 * instead of F3's — a copy-paste slip in the mock — so FieldDetailScreen
 * pulls area/soil/irrigation from the `fields` fixture above instead, to
 * stay consistent with the Fields list the user just came from.
 */
export const cropHistoryByFieldCode: Record<string, CropHistoryEntry[]> = {
  F1: [
    {
      id: 'f1-2026-cotton',
      month: 'Jun',
      year: 2026,
      cropTitle: 'Cotton · IUB-13',
      seasonLabel: 'Kharif 2026 · 12 Jun – open',
      status: 'active',
    },
    {
      id: 'f1-2025-wheat',
      month: 'Dec',
      year: 2025,
      cropTitle: 'Wheat · Faisal-11',
      seasonLabel: 'Rabi 2025 · 18 Dec – 5 May',
      status: 'completed',
      netAmount: toMoney('3260'),
    },
  ],
  F2: [
    {
      id: 'f2-2025-wheat',
      month: 'Dec',
      year: 2024,
      cropTitle: 'Wheat · Faisal-11',
      seasonLabel: 'Rabi 2025 · 22 Dec – 8 May',
      status: 'completed',
      netAmount: toMoney('2680'),
    },
  ],
  F3: [
    {
      id: 'f3-2026-wheat',
      month: 'Dec',
      year: 2025,
      cropTitle: 'Wheat · Faisal-11',
      seasonLabel: 'Rabi 2026 · 18 Dec – open',
      status: 'active',
    },
    {
      id: 'f3-2025-cotton',
      month: 'Jun',
      year: 2025,
      cropTitle: 'Cotton · IUB-13',
      seasonLabel: 'Kharif 2025 · 14 Jun – 3 Nov',
      status: 'completed',
      netAmount: toMoney('3942'),
    },
    {
      id: 'f3-2024-wheat',
      month: 'Dec',
      year: 2024,
      cropTitle: 'Wheat · Faisal-11',
      seasonLabel: 'Rabi 2025 · 20 Dec – 9 May',
      status: 'completed',
      netAmount: toMoney('3410'),
    },
    {
      id: 'f3-2024-cotton',
      month: 'Jul',
      year: 2024,
      cropTitle: 'Cotton · IUB-13',
      seasonLabel: 'Kharif 2024 · 2 Jul – 18 Nov',
      status: 'completed',
      netAmount: toMoney('-280'),
    },
    {
      id: 'f3-2023-wheat',
      month: 'Dec',
      year: 2023,
      cropTitle: 'Wheat · Faisal-11',
      seasonLabel: 'Rabi 2024 · 22 Dec – 6 May',
      status: 'completed',
      netAmount: toMoney('3120'),
    },
  ],
  F4: [
    {
      id: 'f4-2026-mango',
      month: 'Jan',
      year: 2026,
      cropTitle: 'Mango orchard',
      seasonLabel: 'Perennial · fruit set',
      status: 'active',
    },
    {
      id: 'f4-2025-mango',
      month: 'Jan',
      year: 2025,
      cropTitle: 'Mango orchard',
      seasonLabel: 'Perennial season · harvested',
      status: 'completed',
      netAmount: toMoney('5180'),
    },
  ],
};
