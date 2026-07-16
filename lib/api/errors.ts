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
