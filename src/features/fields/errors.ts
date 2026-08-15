import { ApiError } from '@/lib/http';

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
    const body = error.body as { errors?: Record<string, string[]> };
    const firstMessage = body.errors && Object.values(body.errors)[0]?.[0];
    if (firstMessage) return firstMessage;
  }
  return 'Could not save this field. Please try again.';
}
