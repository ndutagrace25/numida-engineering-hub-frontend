/**
 * The authenticated user, normalized from the backend's snake_case
 * `UserSerializer`/`CurrentUserSerializer` payload (see
 * apps/accounts/serializers.py in the Django backend). `role` is not part
 * of this type: the backend's User model has no role/title field today —
 * see the README's "Authentication" section for how the UI falls back.
 */
export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  /** Derived on the frontend from firstName/lastName/email — not a backend field. */
  initials: string;
  isActive: boolean;
  dateJoined: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
