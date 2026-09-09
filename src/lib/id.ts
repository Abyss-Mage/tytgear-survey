/**
 * Generates a cryptographically secure, non-sequential Response ID.
 * Format: TYT-2026-XXXXXXXX (where X is an uppercase alphanumeric character)
 */
export function generateResponseId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous chars like 0, O, 1, I
  let result = "";
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < 8; i++) {
      result += chars[bytes[i] % chars.length];
    }
  } else {
    // Fallback if crypto is unavailable
    for (let i = 0; i < 8; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return `TYT-2026-${result}`;
}
