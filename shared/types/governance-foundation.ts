// Shared governance foundation types
// Source: Spec 01 — shared-governance-foundation
// TODO: Populate with full type definitions once Spec 01 is confirmed stable

export type GovernanceStatus =
  | "ready_full"
  | "ready_with_bounded_gaps"
  | "blocked_not_ready"; // TODO: verify enum against Spec 01

export interface GovernanceContext {
  sessionId: string;         // deterministic session identifier
  operator: string;          // named accountable actor
  timestampIso: string;      // ISO 8601, no local time
  jurisdictionCode: string;  // e.g. "CA-QC" — see Spec 09
  // TODO: add evidence tier, audit trail ref
}

export interface GovernanceControl {
  controlId: string;
  riskPattern: string;
  workflowInterface: string;
  accountableActor: string;
  evidenceArtifactRef: string;
  reviewIntervalDays: number;
  // NOTE: A control missing any of these fields is a "governance aspiration" per Spec 01
}
