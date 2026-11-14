import { ApiError } from './errors';

/**
 * A failed request as one sentence for the UI: the first FluentValidation
 * message from a 400's `errors` dict (already written as a sentence), else a
 * 422's domain-rule `detail`, else `fallback`.
 */
export function problemMessage(error: unknown, fallback: string): string {
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
    if (error.status === 422 && body.detail) return body.detail;
  }
  return fallback;
}
