/** Derives display initials from a first/last name, falling back to email. */
export function getInitials(
  firstName: string,
  lastName: string,
  fallback: string,
): string {
  const first = firstName.trim();
  const last = lastName.trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first.slice(0, 2).toUpperCase();
  if (last) return last.slice(0, 2).toUpperCase();
  return fallback.slice(0, 2).toUpperCase();
}
