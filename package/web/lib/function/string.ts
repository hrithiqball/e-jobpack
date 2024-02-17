export function isNullOrEmpty(value: string | null | undefined): string | null {
  return !value || value.trim().length === 0 ? null : value;
}
