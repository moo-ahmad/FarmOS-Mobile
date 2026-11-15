import { problemMessage } from '@/lib/http/problem';

/** Inline message for a failed save or void. */
export function activityApiErrorMessage(error: unknown): string {
  return problemMessage(
    error,
    'Could not save this activity. Please try again.',
  );
}
