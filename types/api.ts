/**
 * Shared API-level types. Matches the Numida Engineering Hub backend's
 * standard response envelopes (see the backend README's "Response format"
 * and "Error format" sections):
 *
 *   Success: { "message": string, "data": T }
 *   Error:   { "error": { "code": string, "message": string, "fields": {...} } }
 */

export interface ApiSuccessResponse<T> {
  message: string;
  data: T;
}

/** The `data` shape for any paginated list endpoint (common/pagination.py). */
export interface PaginatedData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiErrorFields {
  [field: string]: string[];
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    fields: ApiErrorFields;
  };
}

/**
 * Normalized shape produced by lib/api/errors.ts from a caught Axios error.
 * `status` is the HTTP status code (0 if the request never reached the
 * server, e.g. a network failure).
 */
export interface ApiError {
  status: number;
  code: string;
  message: string;
  fields: ApiErrorFields;
}
