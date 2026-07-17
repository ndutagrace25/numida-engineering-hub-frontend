import axios, { isAxiosError } from "axios";

/**
 * Base URL of the Numida Engineering Hub backend API, e.g.
 * "http://localhost:8000/api/v1". Must be set via NEXT_PUBLIC_API_BASE_URL
 * so it's available in the browser bundle (see .env.example).
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

/**
 * Shared Axios instance for every backend request. `withCredentials: true`
 * sends the session cookie the backend's session authentication relies on,
 * so callers never need to attach it manually.
 *
 * The backend's session auth enforces Django's CSRF check on every
 * state-changing request made with an established session (see
 * SessionAuthentication.enforce_csrf in DRF) — `xsrfCookieName` /
 * `xsrfHeaderName` tell Axios to read the `csrftoken` cookie Django sets
 * and echo it back as `X-CSRFToken`. `withXSRFToken: true` is required
 * because the frontend (localhost:3000) and backend (localhost:8000) are
 * different origins, and Axios only does this automatically same-origin
 * by default.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  headers: {
    "Content-Type": "application/json",
  },
});

type UnauthorizedListener = () => void;
const unauthorizedListeners = new Set<UnauthorizedListener>();

/**
 * Subscribes to "the server just told us the session is no longer valid"
 * (a 401 from any authenticated request). Returns an unsubscribe function.
 * Used by AuthProvider to clear the cached user and let the protected-route
 * layout redirect to login — kept as a plain event bus (not a React import)
 * so this module has no dependency on React/TanStack Query.
 */
export function onUnauthorized(listener: UnauthorizedListener) {
  unauthorizedListeners.add(listener);
  return () => {
    unauthorizedListeners.delete(listener);
  };
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      unauthorizedListeners.forEach((listener) => listener());
    }
    return Promise.reject(error);
  },
);
