// Deterministic ID and hash utilities
// Source: Spec 08 — data-lineage-storage-and-recursion
// ⚠️ Do NOT duplicate in local module files — this is the single source of truth

/**
 * Produces a deterministic SHA-256 hash of the input string.
 * Used for: HandoffPayload.payloadId, DataLineageRef.lineageId, ProvenanceRecord hashes.
 * 
 * TODO (Module 08 build): implement using Web Crypto API (available in CF Workers)
 */
export async function deterministicHash(_input: string): Promise<string> {
  throw new Error("NOT IMPLEMENTED — see Spec 08 §deterministic-identifiers");
}

/**
 * Generates a new session identifier.
 * 
 * TODO: replace with deterministic hash of session inputs
 */
export function newSessionId(): string {
  throw new Error("NOT IMPLEMENTED");
}
