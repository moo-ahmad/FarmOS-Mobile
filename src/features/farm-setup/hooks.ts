import { useSession } from '@/features/auth';
import { useIrrigationSources } from '@/features/fields';
import { useSeasons } from '@/features/season-form';

import { computeFarmSetupStatus, type FarmSetupStatus } from './setup-status';

export type FarmSetupState =
  | { kind: 'loading' }
  /** Offline or the API failed — we can't tell, so don't nag. */
  | { kind: 'unknown' }
  /** Workers can't create seasons or sources; setup isn't theirs to do. */
  | { kind: 'not-applicable' }
  | ({ kind: 'ready' } & FarmSetupStatus);

/**
 * Whether the current farm still needs its first open season and
 * irrigation source. Managers only. Any failure resolves to `unknown`
 * rather than "incomplete", so an offline login never shows a false nag.
 */
export function useFarmSetup(): FarmSetupState {
  const { role } = useSession();
  const seasons = useSeasons();
  const irrigationSources = useIrrigationSources();

  if (role !== 'manager') return { kind: 'not-applicable' };
  if (seasons.isError || irrigationSources.isError) return { kind: 'unknown' };
  if (!seasons.data || !irrigationSources.data) return { kind: 'loading' };

  return {
    kind: 'ready',
    ...computeFarmSetupStatus(seasons.data, irrigationSources.data),
  };
}
