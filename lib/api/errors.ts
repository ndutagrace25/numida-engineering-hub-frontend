import { isAxiosError } from "axios";

import type { ApiError, ApiErrorBody } from "@/types/api";

function isApiErrorBody(data: unknown): data is ApiErrorBody {
  if (typeof data !== "object" || data === null || !("error" in data)) {
    return false;
  }
  const { error } = data as { error: unknown };
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}

/**
 * Normalizes anything caught from an apiClient request into the shared
 * ApiError shape, so calling code never has to branch on Axios internals.
 * Safe to call with any thrown value, not just AxiosError.
 */
export function getApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    if (isApiErrorBody(error.response?.data)) {
      const { code, message, fields } = error.response.data.error;
      return {
        status: error.response.status,
        code,
        message,
        fields: fields ?? {},
      };
    }

    return {
      status: error.response?.status ?? 0,
      code: "NETWORK_ERROR",
      message: error.message,
      fields: {},
    };
  }

  return {
    status: 0,
    code: "UNKNOWN_ERROR",
    message:
      error instanceof Error ? error.message : "An unexpected error occurred.",
    fields: {},
  };
}

/**
 * A safe, user-facing message for any caught request error. Backend
 * validation/auth messages (e.g. "Unable to log in with the provided
 * credentials.") are already written to be shown to users, so those pass
 * through as-is; network failures and unexpected server errors — which
 * carry no safe message from the backend — get a generic fallback instead
 * of leaking Axios/HTTP internals.
 */
export function getErrorMessage(error: unknown): string {
  const apiError = getApiError(error);

  if (apiError.status === 0) {
    return "Can't reach the server. Check your connection and try again.";
  }
  if (apiError.status >= 500) {
    return "Something went wrong on our end. Please try again.";
  }
  return apiError.message;
}
