import { toMoney, type Money } from '@/lib/decimal';

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
 * detail frame) — F3's 5 entries match the handoff's numbers exactly.
 *
 * Unlike the rest of the Fields feature, this stays a fixture: there's no
 * crop-cycle API yet, only Field CRUD. Keyed by the old demo codes (F1–F4),
 * so it won't match a real field's code (e.g. "F-001") — FieldDetailScreen
 * falls back to an empty list, which is honest given no backend exists for
 * this yet. Kept as a reference for the shape a real crop-history endpoint
 * should return.
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
