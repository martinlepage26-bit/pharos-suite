// AurorA — extraction types
// Source: Spec 04 — aurora-extraction-controls-and-evidence
// NOTE: ExtractedEvidence is re-exported from shared/types/handoff-contract
// to keep the handoff contract as single source of truth.
export type { ExtractedEvidence } from "../../../../shared/types/handoff-contract";

export interface ExtractionFieldInput {
  value: string;
  confidence: number;
}

export interface NormalizedExtractionField {
  value: string;
  normalizedValue: string;
  confidence: number;
  threshold: number;
  belowThreshold: boolean;
  isMandatory: boolean;
  piiDetected: boolean;
  piiMasked: boolean;
}

export interface ReviewDecision {
  decision_type: "auto_approve" | "escalate_hitl";
  status: "auto_approved" | "hitl_required";
  reason: string | null;
  reviewer_identity: string | null;
  decided_at: string | null;
  override_reason: string | null;
}

export interface ExtractionQualityControls {
  pii_detected: string[];
  pii_masking_applied: boolean;
  hitl_triggered: boolean;
  hitl_trigger_reason: string | null;
  confidence_check: "passed" | "failed";
  validation_status: ReviewDecision["status"];
}

export interface ExtractionEvidencePackage {
  extraction_id: string;
  schema_version: string;
  document_metadata: {
    source_hash: string;
    document_type: string;
    processing_timestamp: string;
  };
  extraction_results: {
    fields: Record<string, ExtractionFieldInput>;
    mandatory_fields_present: boolean;
    below_threshold_fields: string[];
  };
  quality_controls: ExtractionQualityControls;
  metrics: {
    processing_time_ms: number;
    model_version: string;
    accuracy_score_benchmark: number | null;
    benchmark_dataset: string | null;
    benchmark_date: string | null;
  };
  audit_trail: {
    processor_id: string;
    validation_chain: string[];
    approver: string | null;
    override_applied: boolean;
  };
  review_decision: ReviewDecision;
  legal_basis?: string | undefined;
  purpose?: string | undefined;
  jurisdiction_context?: string | undefined;
  retention_profile?: string | undefined;
  if_trace_receipt: string | null;
  if_trace_binding_note: string;
  package_hash: string;
}

export interface ExtractionJob {
  intakeId: string;
  r2Key: string;
  mimeType: string;
  sourceHash: string;
  sourceFilename: string;
  operatorOrServiceIdentity: string;
  documentType: string;
  fields: Record<string, string | number | boolean | ExtractionFieldInput>;
  defaultThreshold?: number | undefined;
  fieldThresholds?: Record<string, number> | undefined;
  mandatoryFields?: string[] | undefined;
  hitlRequiredWhen?: string[] | undefined;
  piiPatterns?: string[] | undefined;
  legalBasis?: string | undefined;
  purpose?: string | undefined;
  jurisdictionContext?: string | undefined;
  retentionProfile?: string | undefined;
  processorId?: string | undefined;
  modelVersion?: string | undefined;
  parentRunId?: string | undefined;
  benchmark?: {
    accuracyScore?: number | undefined;
    dataset?: string | undefined;
    date?: string | undefined;
  } | undefined;
}

export interface ExtractionResult {
  extractionId: string;
  processingRunId: string;
  intakeId: string;
  documentType: string;
  evidenceItems: import("../../../../shared/types/handoff-contract").ExtractedEvidence[];
  controlsApplied: ControlResult[];
  overallAdmissible: boolean;
  mandatoryFieldsPresent: boolean;
  belowThresholdFields: string[];
  reviewDecision: ReviewDecision;
  evidencePackage: ExtractionEvidencePackage;
  packageHash: string;
  evidenceTier: 1 | 2 | 3 | 4;
}

export interface ControlResult {
  controlId: string;
  passed: boolean;
  reason?: string | undefined;
  triggeredHumanReview?: boolean | undefined;
  findingCode?: string | undefined;
  findingDetail?: Record<string, unknown> | undefined;
}
