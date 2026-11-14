import { AREA_UOMS } from '@/features/fields/model';
import type { TagVariant } from '@/components/ui';
import type { CropCycleDto } from '@/lib/crop-cycles';

import type { CycleNames } from './hooks';
import { CropCycleStatus } from './model';

/** The short label for an area unit id ("acre"); "units" for one this build doesn't know. */
export function areaUnitLabel(uomId: number): string {
  return AREA_UOMS.find((uom) => uom.id === uomId)?.code ?? 'units';
}

/** "2.5 acre" — display only; the API sends area as a JSON number. */
export function areaLabel(value: number, uomId: number): string {
  return `${String(value)} ${areaUnitLabel(uomId)}`;
}

/** "Wheat · North block · Rabi 2026-27", skipping names that haven't loaded. */
export function cycleSubtitle(cycle: CropCycleDto, names: CycleNames): string {
  return [
    names.crop(cycle.cropId),
    names.field(cycle.fieldId),
    names.season(cycle.seasonId),
  ]
    .filter((part): part is string => Boolean(part))
    .join(' · ');
}

/** The one date that says where the cycle stands: sown, planned, or ended. */
export function cycleDateLine(cycle: CropCycleDto): string | null {
  if (cycle.status === CropCycleStatus.Closed && cycle.actualHarvestEnd) {
    return `Harvest ended ${cycle.actualHarvestEnd}`;
  }
  if (cycle.actualSowDate) return `Sown ${cycle.actualSowDate}`;
  if (cycle.plannedSowDate) return `Sowing planned ${cycle.plannedSowDate}`;
  return null;
}

/** Planned reads as "not yet", growing stages as live, endings quiet; a loss in ink. */
export function statusTagVariant(status: number): TagVariant {
  switch (status) {
    case CropCycleStatus.Planned:
      return 'outline';
    case CropCycleStatus.Sown:
    case CropCycleStatus.Growing:
    case CropCycleStatus.Harvesting:
      return 'accent';
    case CropCycleStatus.Failed:
      return 'ink';
    default:
      return 'neutral';
  }
}
