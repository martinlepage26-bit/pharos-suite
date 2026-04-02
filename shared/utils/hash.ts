// Deterministic ID and hash utilities
// Used by HandoffPayload.payloadId, DataLineage.lineageId, IntakeResult.intakeId
// Uses Web Crypto API (available in Cloudflare Workers)

export async function deterministicHash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  // Smoke test: deterministicHash("test") → "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
}

export function canonicalizeForHash(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

export async function deterministicHashObject(value: unknown): Promise<string> {
  return deterministicHash(canonicalizeForHash(value));
}

export function newSessionId(): string {
  return crypto.randomUUID();
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, sortValue(nested)]),
    );
  }

  return value;
}
