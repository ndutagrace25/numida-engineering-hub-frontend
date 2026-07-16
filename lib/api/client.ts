import axios from "axios";

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
 * This client is intentionally unopinionated about request/response
 * shaping beyond that — auth flows, interceptor-based redirects, and
 * feature-specific calls are added alongside their own modules later.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
