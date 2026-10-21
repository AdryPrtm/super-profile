const USERNAME_DOMAIN = "users.super-profile.invalid";

// Better Auth authenticates email addresses. Local usernames have a reserved,
// non-deliverable address so they can use the same account/session system.
export function normalizeLoginIdentifier(value: string) {
  const identifier = value.trim().toLowerCase();
  return /^[a-z0-9][a-z0-9._-]{2,31}$/.test(identifier)
    ? identifier + "@" + USERNAME_DOMAIN
    : identifier;
}
