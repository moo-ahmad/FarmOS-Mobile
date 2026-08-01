/** A non-2xx API response, surfaced to callers with status and parsed body. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
    readonly body: unknown,
    message?: string,
  ) {
    super(message ?? `API request failed (HTTP ${status}) for ${url}`);
    this.name = 'ApiError';
  }
}
