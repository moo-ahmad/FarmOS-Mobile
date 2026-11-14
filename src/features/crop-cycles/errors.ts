import { ApiError } from '@/lib/http/errors';
import { problemMessage } from '@/lib/http/problem';

/** Inline message for a failed save or status change. */
export function cropCycleApiErrorMessage(error: unknown): string {
  return problemMessage(
    error,
    'Could not save this crop cycle. Please try again.',
  );
}

/**
 * Message for a failed delete. A 422 means activities, harvests, sales or
 * costs reference the cycle — said here because the API only includes
 * `detail` in Development.
 */
export function deleteCropCycleErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 422) {
    return "This cycle already has activities, harvests, sales or costs, so it can't be deleted. Mark it as abandoned instead.";
  }
  if (error instanceof ApiError && error.status === 404) {
    return 'This crop cycle no longer exists.';
  }
  return 'Could not delete this crop cycle. Please try again.';
}
