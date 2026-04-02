// CROSS-SYSTEM EVIDENCE HANDOFF CONTRACT
// Source: Spec 05 — cross-system-evidence-handoff
// CRITICAL: This is the single source of truth for the AurorA → COMPASSai boundary.
// AurorA EMITS this shape. COMPASSai RECEIVES this shape.
// Any change to this file is a breaking change for both applications.
// TODO: version this type (HandoffPayloadV1, HandoffPayloadV2) once Spec 05 is locked

export interface HandoffPayload {
  payloadId: string;            // deterministic hash of the canonical payload body
  schemaVersion: string;        // carried forward from the bounded extraction evidence package
  packageHash: string;          // original extraction package hash from AurorA Module 04
  sourceSystem: "AurorA";       // always "AurorA"; literal type enforced
  targetSystem: "COMPASSai";    // always "COMPASSai"; literal type enforced
  useCaseId: string;            // stable governance-program link target
  sessionRef: string;           // links to GovernanceContext.sessionId
  processingRunId: string;      // extraction processing run lineage anchor
  documentType: string;
  fileRef: {
    artifactId: string;
    r2Key: string;              // R2 bucket key for the original file
    mimeType: string;
    sizeBytes: number;
    receivedAtIso: string;
    sourceFilename: string;
    sourceHash: string;
  };
  extractedEvidence: ExtractedEvidence[];
  extractionControlsApplied: string[];  // control IDs from AurorA controls.ts
  evidenceTier: 1 | 2 | 3 | 4;         // per evidence hierarchy, Spec 00
  admissible: boolean;                  // tier 4 = always false
  reviewStatus: "auto_approved" | "hitl_required";
  reviewReason: string | null;
  lineageRef: string;                   // links to DataLineage record
  emittedAtIso: string;
}

export interface ExtractedEvidence {
  evidenceId: string;
  sourceField: string;
  rawValue: string;
  normalizedValue: string;
  confidence: number;           // 0.0–1.0
  controlApplied: string;       // control ID that produced this evidence item
  // TODO: add provenance chain ref once Spec 08 lineage is implemented
}
