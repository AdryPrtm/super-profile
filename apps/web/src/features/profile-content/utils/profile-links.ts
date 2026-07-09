export function toMailto(email: string) {
  return email.startsWith("mailto:") ? email : `mailto:${email}`;
}
