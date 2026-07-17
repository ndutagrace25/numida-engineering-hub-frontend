/**
 * The minimal user reference nested throughout the API (standups,
 * presence, AOB, PTO, PR links — anywhere apps.accounts.serializers'
 * MinimalUserSerializer is used). No `role` field — the backend's User
 * model has none.
 */
export interface UserRef {
  id: number;
  firstName: string;
  lastName: string;
  displayName: string;
  initials: string;
}
