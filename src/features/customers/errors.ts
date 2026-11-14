import { ApiError } from '@/lib/http/errors';
import { problemMessage } from '@/lib/http/problem';

/** Inline message for a failed save/deactivate/reactivate. */
export function customerApiErrorMessage(error: unknown): string {
  return problemMessage(
    error,
    'Could not save this customer. Please try again.',
  );
}

/**
 * Message for a failed delete. A 422 means sales already reference the
 * customer — said here because the API only includes `detail` in Development.
 */
export function deleteCustomerErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 422) {
    return "This customer already has sales, so they can't be deleted. Deactivate them instead.";
  }
  if (error instanceof ApiError && error.status === 404) {
    return 'This customer no longer exists.';
  }
  return 'Could not delete this customer. Please try again.';
}
