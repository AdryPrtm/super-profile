export function getText(formData: FormData, name: string, fallback: string) {
  const value = formData.get(name);
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim() || fallback;
}

export function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
