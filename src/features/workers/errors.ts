import { ApiError } from '@/lib/http/errors';
import { problemMessage } from '@/lib/http/problem';

/** Inline message for a failed save/deactivate/reactivate. */
export function workerApiErrorMessage(error: unknown): string {
  return problemMessage(error, 'Could not save this worker. Please try again.');
}

/**
 * Message for a failed delete. A 422 means attendance, labor or wage history
 * references the worker — said here because the API only includes `detail`
 * in Development.
 */
export function deleteWorkerErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 422) {
    return "This worker already has attendance, labor or wage history, so they can't be deleted. Deactivate them instead.";
  }
  if (error instanceof ApiError && error.status === 404) {
    return 'This worker no longer exists.';
  }
  return 'Could not delete this worker. Please try again.';
}
