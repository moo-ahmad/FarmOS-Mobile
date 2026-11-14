import {
  Lookup,
  lookupCodeOf,
  lookupName,
  type LookupValue,
} from '@/lib/lookups';

/**
 * A crop cycle's lifecycle state — the backend's `CropCycleStatus` lookup
 * (Planned = 14000, …), from the generated catalogue.
 */
export const CropCycleStatus = Lookup.CropCycleStatus;
// A value + type pair under one name, so call sites read like an enum.
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CropCycleStatus = LookupValue<'CropCycleStatus'>;

/** Display label for a wire value; "Unknown" for one this build doesn't know. */
export function cropCycleStatusLabel(value: number): string {
  const code = lookupCodeOf('CropCycleStatus', value);
  return code ? lookupName('CropCycleStatus', code) : 'Unknown';
}

const ENDED: readonly number[] = [
  CropCycleStatus.Closed,
  CropCycleStatus.Failed,
  CropCycleStatus.Abandoned,
];

/** Closed, Failed and Abandoned are terminal: no further moves, no edits. */
export function isEndedStatus(value: number): boolean {
  return ENDED.includes(value);
}

export type CycleFilter = 'active' | 'ended' | 'all';

export function matchesFilter(status: number, filter: CycleFilter): boolean {
  if (filter === 'all') return true;
  return filter === 'ended' ? isEndedStatus(status) : !isEndedStatus(status);
}

/** What a status move needs from the farmer before it can be sent. */
export type TransitionInput = 'sowDate' | 'harvestEnd' | 'reason' | null;

export interface CycleTransition {
  to: CropCycleStatus;
  label: string;
  sub: string;
  input: TransitionInput;
  /** Ends the cycle for good (Failed / Abandoned). */
  destructive?: boolean;
}

const FAILED: CycleTransition = {
  to: CropCycleStatus.Failed,
  label: 'Mark as failed',
  sub: 'The crop was lost (pest, flood, drought…) — ends the cycle',
  input: 'reason',
  destructive: true,
};

const ABANDONED: CycleTransition = {
  to: CropCycleStatus.Abandoned,
  label: 'Mark as abandoned',
  sub: 'You stopped this cycle on purpose — ends it, costs are kept',
  input: 'reason',
  destructive: true,
};

/**
 * The moves the lifecycle allows from `status` — mirrors
 * `CropCycle.EnsureTransitionAllowed`: Planned → Sown → Growing → Harvesting
 * → Closed, and Failed/Abandoned from any open state.
 */
export function availableTransitions(status: number): CycleTransition[] {
  switch (status) {
    case CropCycleStatus.Planned:
      return [
        {
          to: CropCycleStatus.Sown,
          label: 'Mark as sown',
          sub: 'Record the sowing date; growth stages are projected from it',
          input: 'sowDate',
        },
        FAILED,
        ABANDONED,
      ];
    case CropCycleStatus.Sown:
      return [
        {
          to: CropCycleStatus.Growing,
          label: 'Mark as growing',
          sub: 'The crop has come up',
          input: null,
        },
        FAILED,
        ABANDONED,
      ];
    case CropCycleStatus.Growing:
      return [
        {
          to: CropCycleStatus.Harvesting,
          label: 'Start harvest',
          sub: 'Recording a harvest does this for you',
          input: null,
        },
        FAILED,
        ABANDONED,
      ];
    case CropCycleStatus.Harvesting:
      return [
        {
          to: CropCycleStatus.Closed,
          label: 'Close cycle',
          sub: 'Harvest is done — locks the cycle for its final P&L',
          input: 'harvestEnd',
        },
        FAILED,
        ABANDONED,
      ];
    default:
      return [];
  }
}
