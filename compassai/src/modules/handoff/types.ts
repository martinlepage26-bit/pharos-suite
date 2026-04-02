// Re-export from shared contract — do not add local fields here
// Breaking change risk: any modification here requires a version bump in
// shared/types/handoff-contract.ts
export type { HandoffPayload, ExtractedEvidence } from "../../../../shared/types/handoff-contract";
