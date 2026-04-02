// AurorA — extraction control table
// Source: Spec 04 §extraction-controls

import type { GovernanceControl } from "../../../../shared/types/governance-foundation";

export interface ExtractionControlDefinition extends GovernanceControl {
  description: string;
  evidenceTierProduced: 1 | 2 | 3 | 4;
}

export interface DocumentTypeProfile {
  mandatoryFields: string[];
  defaultThreshold: number;
}

export const EXTRACTION_SCHEMA_VERSION = "2026-03-31";

export const IF_TRACE_BINDING_NOTE =
  "if.trace binding available via operator-initiated receipt generation; not automatic on every package in current implementation. Configure explicit binding for high-risk use cases.";

export const DOCUMENT_TYPE_PROFILES: Record<string, DocumentTypeProfile> = {
  invoice: {
    mandatoryFields: ["invoice_number", "total_amount", "vendor_name"],
    defaultThreshold: 0.85,
  },
  contract: {
    mandatoryFields: ["counterparty_name", "effective_date", "termination_clause"],
    defaultThreshold: 0.8,
  },
  intake_form: {
    mandatoryFields: ["applicant_name", "submission_date"],
    defaultThreshold: 0.8,
  },
  generic_document: {
    mandatoryFields: [],
    defaultThreshold: 0.8,
  },
};

export const DEFAULT_PII_PATTERN_LIBRARY: Record<string, RegExp> = {
  email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  phone: /\b(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/,
  credit_card: /\b(?:\d[ -]*?){13,16}\b/,
};

export function getDocumentTypeProfile(documentType: string): DocumentTypeProfile {
  return DOCUMENT_TYPE_PROFILES[documentType] ?? DOCUMENT_TYPE_PROFILES.generic_document;
}

export const EXTRACTION_CONTROLS: Record<string, ExtractionControlDefinition> = {
  "EC-01": {
    controlId: "EC-01",
    description: "Per-field confidence thresholds are enforced and low-confidence fields are surfaced explicitly.",
    evidenceTierProduced: 2,
    riskPattern: "below-threshold extraction confidence",
    workflowInterface: "extraction confidence gate",
    accountableActor: "aurora-extraction-worker",
    evidenceArtifactRef: "quality_controls.confidence_check",
    reviewIntervalDays: 30,
  },
  "EC-02": {
    controlId: "EC-02",
    description: "Required fields are checked per document type and missing mandatory values force review-gated output.",
    evidenceTierProduced: 2,
    riskPattern: "missing mandatory extraction fields",
    workflowInterface: "required-field gate",
    accountableActor: "aurora-extraction-worker",
    evidenceArtifactRef: "extraction_results.mandatory_fields_present",
    reviewIntervalDays: 30,
  },
  "EC-03": {
    controlId: "EC-03",
    description: "PII detection and masking are bounded to configured patterns only and logged as part of package quality controls.",
    evidenceTierProduced: 2,
    riskPattern: "bounded pii detection and masking",
    workflowInterface: "pii scan and masking pass",
    accountableActor: "aurora-extraction-worker",
    evidenceArtifactRef: "quality_controls.pii_detected",
    reviewIntervalDays: 30,
  },
  "EC-04": {
    controlId: "EC-04",
    description: "Configured domain triggers and HITL rules are evaluated fail-closed when a rule is unsupported or fires.",
    evidenceTierProduced: 3,
    riskPattern: "domain-specific human review escalation",
    workflowInterface: "hitl trigger gate",
    accountableActor: "aurora-validator",
    evidenceArtifactRef: "quality_controls.hitl_trigger_reason",
    reviewIntervalDays: 14,
  },
  "EC-05": {
    controlId: "EC-05",
    description: "Review decisions are recorded explicitly so auto-approval and human-review requirements remain supportable.",
    evidenceTierProduced: 3,
    riskPattern: "missing review-decision trace",
    workflowInterface: "review decision ledger",
    accountableActor: "aurora-validator",
    evidenceArtifactRef: "review_decision",
    reviewIntervalDays: 14,
  },
  "EC-06": {
    controlId: "EC-06",
    description: "Input and package hashing preserve append-only evidence-package integrity without overstating semantic correctness.",
    evidenceTierProduced: 2,
    riskPattern: "package integrity drift",
    workflowInterface: "package hashing",
    accountableActor: "aurora-extraction-worker",
    evidenceArtifactRef: "package_hash",
    reviewIntervalDays: 30,
  },
};
