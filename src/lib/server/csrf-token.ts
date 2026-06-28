export function generateCsrfToken(): string {
  return globalThis.crypto.randomUUID();
}
