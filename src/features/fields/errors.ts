import { ApiError } from '@/lib/http/errors';

/**
 * Turns a failed Create/Update Field request into a message the form can
 * show inline — the backend's `errors` dict (FluentValidation, e.g.
 * `{ Code: ["A field with code 'F-001' already exists on this farm."] }`)
 * already reads as a sentence, so the first one is used as-is.
 */
export function fieldApiErrorMessage(error: unknown): string {
  if (
    error instanceof ApiError &&
    error.body &&
    typeof error.body === 'object'
  ) {
    const body = error.body as {
      errors?: Record<string, string[]>;
      detail?: string;
    };
    const firstMessage = body.errors && Object.values(body.errors)[0]?.[0];
    if (firstMessage) return firstMessage;
    // Domain rule failures (422), e.g. deleting a field that has history.
    if (error.status === 422 && body.detail) return body.detail;
  }
  return 'Could not save this field. Please try again.';
}

/**
 * Message for a failed delete. A 422 means the field already has history —
 * the backend only includes its own explanation in Development, so say it
 * here rather than rely on `detail`.
 */
export function deleteFieldErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 422) {
    return "This field already has history (crop cycles, activities or harvests), so it can't be deleted. Deactivate it instead.";
  }
  if (error instanceof ApiError && error.status === 404) {
    return 'This field no longer exists.';
  }
  return 'Could not delete this field. Please try again.';
}
