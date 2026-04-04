// HandoffPayload — Shared contract between AurorA and COMPASSai
// Source: Spec 05 — cross-system-evidence-handoff
// Version: v1.0
// ⚠️ Do NOT duplicate in local module files — this is the single source of truth

export interface HandoffPayload {
  payloadId: string;           // Deterministic hash of session inputs
  sessionId: string;           // Parent session identifier
  timestamp: string;           // ISO 8601 UTC
  sourceApp: "AurorA";         // Source application identifier
  intakeSource: string;        // Original file r2Key
  extractedEvidence: ExtractedEvidence[];
  regulatory: RegulatoryMeta;
  lineage: DataLineageRef;
}

export interface ExtractedEvidence {
  claimId: string;
  claimText: string;
  evidenceType: "text" | "table" | "citation" | "regulatory_ref";
  sourceRef: string;
  pageRef?: string;
  confidence: number;          // 0.0 – 1.0
  extractionMethod: string;   // e.g., "pdfplumber", "ocr", "regex"
  controlResult: ControlResult;
}

export interface ControlResult {
  controlsPassed: boolean;
  violations: ControlViolation[];
  extractionTimestamp: string;
}

export interface ControlViolation {
  controlId: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
}

export interface RegulatoryMeta {
  jurisdiction: string;        // e.g., "CA-QC", "EU"
  dataResidencyRequired: boolean;
  retentionDays: number;
}

export interface DataLineageRef {
  lineageId: string;
  chain: ProvenanceRecord[];
  rootSourceRef: string;
}

export interface ProvenanceRecord {
  stepId: string;
  stepName: string;
  inputHash: string;
  outputHash: string;
  timestamp: string;
  actor: string;               // e.g., "AurorA", "COMPASSai"
}
