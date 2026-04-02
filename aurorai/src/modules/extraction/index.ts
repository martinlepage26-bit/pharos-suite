// AurorA — extraction orchestrator
// Source: Spec 04 — extraction, controls, and evidence

import { deterministicHash } from "../../../../shared/utils/hash";
import { AuroraExtractionError } from "../../lib/errors";
import { log } from "../../lib/logger";
import { recordExtractionLog } from "../../storage/d1";
import {
  DEFAULT_PII_PATTERN_LIBRARY,
  EXTRACTION_SCHEMA_VERSION,
  IF_TRACE_BINDING_NOTE,
  getDocumentTypeProfile,
} from "./controls";
import type {
  ControlResult,
  ExtractionEvidencePackage,
  ExtractionFieldInput,
  ExtractionJob,
  ExtractionResult,
  NormalizedExtractionField,
  ReviewDecision,
} from "./types";
import type { ExtractedEvidence } from "../../../../shared/types/handoff-contract";

export async function runExtraction(
  job: ExtractionJob,
  env?: { AURORA_DB?: D1Database },
): Promise<ExtractionResult> {
  const startedAt = Date.now();
  const documentType = job.documentType.trim();
  if (!documentType) {
    throw new AuroraExtractionError("MISSING_DOCUMENT_TYPE");
  }

  const fieldEntries = Object.entries(job.fields ?? {});
  if (fieldEntries.length === 0) {
    throw new AuroraExtractionError("MISSING_FIELDS");
  }

  const profile = getDocumentTypeProfile(documentType);
  const mandatoryFields = (job.mandatoryFields?.length ? job.mandatoryFields : profile.mandatoryFields).map((value) =>
    value.trim(),
  );
  const defaultThreshold =
    typeof job.defaultThreshold === "number" && Number.isFinite(job.defaultThreshold)
      ? job.defaultThreshold
      : profile.defaultThreshold;
  const piiPatterns = job.piiPatterns?.length ? job.piiPatterns : Object.keys(DEFAULT_PII_PATTERN_LIBRARY);
  const processingTimestamp = new Date().toISOString();

  const normalizedFields: Record<string, NormalizedExtractionField> = {};
  const rawFieldValues: Record<string, string> = {};
  const piiDetected: string[] = [];
  const evidenceItems: ExtractedEvidence[] = [];

  for (const [fieldName, rawInput] of fieldEntries) {
    const threshold = job.fieldThresholds?.[fieldName] ?? defaultThreshold;
    const normalized = await normalizeField(fieldName, rawInput, {
      threshold,
      isMandatory: mandatoryFields.includes(fieldName),
      piiPatterns,
    });
    normalizedFields[fieldName] = normalized;
    rawFieldValues[fieldName] = normalized.value;
    if (normalized.piiDetected) {
      piiDetected.push(fieldName);
    }
  }

  const missingMandatoryFields = mandatoryFields.filter((fieldName) => {
    const field = normalizedFields[fieldName];
    return !field || field.value.trim().length === 0;
  });
  const belowThresholdFields = Object.entries(normalizedFields)
    .filter(([, field]) => field.belowThreshold)
    .map(([fieldName]) => fieldName);
  const hitlEvaluation = evaluateHitlRules(job.hitlRequiredWhen ?? [], rawFieldValues);

  const confidenceCheck: ControlResult = {
    controlId: "EC-01",
    passed: belowThresholdFields.length === 0,
    reason:
      belowThresholdFields.length > 0
        ? `Below-threshold fields: ${belowThresholdFields.join(", ")}`
        : "All field confidences meet configured thresholds.",
    findingCode: belowThresholdFields.length > 0 ? "BELOW_THRESHOLD_FIELDS" : undefined,
    findingDetail: belowThresholdFields.length > 0 ? { belowThresholdFields } : undefined,
  };

  const requiredFieldCheck: ControlResult = {
    controlId: "EC-02",
    passed: missingMandatoryFields.length === 0,
    reason:
      missingMandatoryFields.length > 0
        ? `Missing mandatory fields: ${missingMandatoryFields.join(", ")}`
        : "All mandatory fields are present.",
    findingCode: missingMandatoryFields.length > 0 ? "MANDATORY_FIELDS_MISSING" : undefined,
    findingDetail: missingMandatoryFields.length > 0 ? { missingMandatoryFields } : undefined,
  };

  const piiCheck: ControlResult = {
    controlId: "EC-03",
    passed: true,
    reason:
      piiDetected.length > 0
        ? `Configured PII patterns were detected and masked in: ${piiDetected.join(", ")}`
        : "No configured PII patterns detected.",
    findingDetail: { piiDetected, piiMaskingApplied: piiDetected.length > 0 },
  };

  const reviewReasons = [
    ...missingMandatoryFields.map((fieldName) => `missing mandatory field: ${fieldName}`),
    ...belowThresholdFields.map((fieldName) => `below-threshold field: ${fieldName}`),
  ];
  if (hitlEvaluation.triggered && hitlEvaluation.reason) {
    reviewReasons.push(hitlEvaluation.reason);
  }

  const validationStatus: ReviewDecision["status"] =
    reviewReasons.length === 0 ? "auto_approved" : "hitl_required";
  const reviewDecision: ReviewDecision = {
    decision_type: validationStatus === "auto_approved" ? "auto_approve" : "escalate_hitl",
    status: validationStatus,
    reason: reviewReasons.length > 0 ? reviewReasons.join("; ") : null,
    reviewer_identity: null,
    decided_at: null,
    override_reason: null,
  };

  const domainTriggerCheck: ControlResult = {
    controlId: "EC-04",
    passed: !hitlEvaluation.triggered,
    reason: hitlEvaluation.reason ?? "No explicit HITL rules fired.",
    triggeredHumanReview: hitlEvaluation.triggered,
    findingCode: hitlEvaluation.triggered ? "HITL_TRIGGERED" : undefined,
    findingDetail: hitlEvaluation.details.length > 0 ? { rules: hitlEvaluation.details } : undefined,
  };

  const reviewDecisionCheck: ControlResult = {
    controlId: "EC-05",
    passed: validationStatus === "auto_approved",
    reason:
      validationStatus === "auto_approved"
        ? "Rules permit auto-approval for this extraction pass."
        : reviewDecision.reason ?? "Human review required.",
    triggeredHumanReview: validationStatus === "hitl_required",
    findingCode: validationStatus === "hitl_required" ? "REVIEW_REQUIRED" : undefined,
    findingDetail: { reviewDecision },
  };

  const extractionResultsFields: Record<string, ExtractionFieldInput> = {};
  for (const [fieldName, field] of Object.entries(normalizedFields)) {
    extractionResultsFields[fieldName] = {
      value: field.normalizedValue,
      confidence: field.confidence,
    };
    evidenceItems.push({
      evidenceId: await deterministicHash(`${job.intakeId}:${fieldName}:${field.normalizedValue}:${processingTimestamp}`),
      sourceField: fieldName,
      rawValue: field.normalizedValue,
      normalizedValue: field.normalizedValue,
      confidence: field.confidence,
      controlApplied: field.piiDetected ? "EC-03" : "EC-01",
    });
  }

  const qualityControls: ExtractionEvidencePackage["quality_controls"] = {
    pii_detected: piiDetected,
    pii_masking_applied: piiDetected.length > 0,
    hitl_triggered: validationStatus === "hitl_required",
    hitl_trigger_reason: reviewDecision.reason,
    confidence_check: belowThresholdFields.length === 0 ? "passed" : "failed",
    validation_status: validationStatus,
  };

  const auditTrail: ExtractionEvidencePackage["audit_trail"] = {
    processor_id: job.processorId ?? "aurora-extraction-worker",
    validation_chain: ["field_normalization", "confidence_check", "required_field_check", "pii_scan", "review_gate"],
    approver: null,
    override_applied: false,
  };

  const processingTimeMs = Math.max(1, Date.now() - startedAt);
  const processingRunId = await deterministicHash(
    `${job.intakeId}:${documentType}:${processingTimestamp}:${Object.keys(normalizedFields).sort().join("|")}`,
  );
  const extractionId = await deterministicHash(`${processingRunId}:${job.sourceHash}:extraction`);
  const evidenceTier: 1 | 2 | 3 | 4 = validationStatus === "auto_approved" ? 2 : 3;

  const packageWithoutHash: Omit<ExtractionEvidencePackage, "package_hash"> = {
    extraction_id: extractionId,
    schema_version: EXTRACTION_SCHEMA_VERSION,
    document_metadata: {
      source_hash: job.sourceHash,
      document_type: documentType,
      processing_timestamp: processingTimestamp,
    },
    extraction_results: {
      fields: extractionResultsFields,
      mandatory_fields_present: missingMandatoryFields.length === 0,
      below_threshold_fields: belowThresholdFields,
    },
    quality_controls: qualityControls,
    metrics: {
      processing_time_ms: processingTimeMs,
      model_version: job.modelVersion ?? "aurora-bounded-worker-v0",
      accuracy_score_benchmark: job.benchmark?.accuracyScore ?? null,
      benchmark_dataset: job.benchmark?.dataset ?? null,
      benchmark_date: job.benchmark?.date ?? null,
    },
    audit_trail: auditTrail,
    review_decision: reviewDecision,
    legal_basis: job.legalBasis,
    purpose: job.purpose,
    jurisdiction_context: job.jurisdictionContext,
    retention_profile: job.retentionProfile,
    if_trace_receipt: null,
    if_trace_binding_note: IF_TRACE_BINDING_NOTE,
  };

  const packageHash = await deterministicHash(JSON.stringify(packageWithoutHash));
  const packageHashCheck: ControlResult = {
    controlId: "EC-06",
    passed: true,
    reason: "Package hash generated for append-only evidence package.",
    findingDetail: { packageHash },
  };

  const evidencePackage: ExtractionEvidencePackage = {
    ...packageWithoutHash,
    package_hash: packageHash,
  };

  const controlsApplied = [
    confidenceCheck,
    requiredFieldCheck,
    piiCheck,
    domainTriggerCheck,
    reviewDecisionCheck,
    packageHashCheck,
  ];

  if (env?.AURORA_DB) {
    await recordExtractionLog(env.AURORA_DB, {
      extractionId,
      processingRunId,
      artifactId: job.intakeId,
      parentRunId: job.parentRunId,
      schemaVersion: EXTRACTION_SCHEMA_VERSION,
      sourceHash: job.sourceHash,
      documentType,
      processingTimestamp,
      extractionResults: evidencePackage.extraction_results,
      evidencePackage,
      mandatoryFieldsPresent: missingMandatoryFields.length === 0,
      belowThresholdFields,
      qualityControls,
      auditTrail,
      evidenceItems,
      controlsApplied,
      reviewDecision,
      evidenceTier,
      packageHash,
      ifTraceReceipt: evidencePackage.if_trace_receipt,
    });
  }

  log("info", "extraction_completed", {
    extractionId,
    processingRunId,
    artifactId: job.intakeId,
    documentType,
    validationStatus,
    belowThresholdFields,
    piiDetected,
  });

  return {
    extractionId,
    processingRunId,
    intakeId: job.intakeId,
    documentType,
    evidenceItems,
    controlsApplied,
    overallAdmissible: validationStatus === "auto_approved",
    mandatoryFieldsPresent: missingMandatoryFields.length === 0,
    belowThresholdFields,
    reviewDecision,
    evidencePackage,
    packageHash,
    evidenceTier,
  };
}

async function normalizeField(
  fieldName: string,
  rawInput: ExtractionJob["fields"][string],
  options: {
    threshold: number;
    isMandatory: boolean;
    piiPatterns: string[];
  },
): Promise<NormalizedExtractionField> {
  let value: string;
  let confidence = 1;

  if (typeof rawInput === "string" || typeof rawInput === "number" || typeof rawInput === "boolean") {
    value = String(rawInput);
  } else if (typeof rawInput === "object" && rawInput !== null && "value" in rawInput) {
    value = String(rawInput.value);
    confidence = Number(rawInput.confidence);
  } else {
    throw new AuroraExtractionError("INVALID_FIELD_VALUE", { fieldName });
  }

  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    throw new AuroraExtractionError("INVALID_FIELD_CONFIDENCE", { fieldName, confidence });
  }

  const piiDetected = matchesConfiguredPii(value, options.piiPatterns);
  const maskedValue = piiDetected ? await maskValue(value) : value;
  const normalizedValue = maskedValue.replace(/\s+/g, " ").trim();

  return {
    value: value.trim(),
    normalizedValue,
    confidence,
    threshold: options.threshold,
    belowThreshold: confidence < options.threshold,
    isMandatory: options.isMandatory,
    piiDetected,
    piiMasked: piiDetected,
  };
}

function matchesConfiguredPii(value: string, configuredPatterns: string[]): boolean {
  for (const patternName of configuredPatterns) {
    const defaultPattern = DEFAULT_PII_PATTERN_LIBRARY[patternName];
    const compiled = defaultPattern ?? compileCustomPattern(patternName);
    if (compiled && compiled.test(value)) {
      return true;
    }
  }
  return false;
}

function compileCustomPattern(pattern: string): RegExp | null {
  try {
    return new RegExp(pattern, "i");
  } catch {
    return null;
  }
}

async function maskValue(value: string): Promise<string> {
  const hash = await deterministicHash(value);
  return `sha256:${hash.slice(0, 16)}`;
}

function evaluateHitlRules(
  rules: string[],
  fields: Record<string, string>,
): { triggered: boolean; reason: string | null; details: string[] } {
  if (rules.length === 0) {
    return { triggered: false, reason: null, details: [] };
  }

  const details: string[] = [];
  for (const rule of rules) {
    const parsed = rule.match(/^\s*([a-zA-Z0-9_]+)\s*(>=|<=|==|!=|>|<)\s*(.+?)\s*$/);
    if (!parsed) {
      details.push(`unsupported rule: ${rule}`);
      return {
        triggered: true,
        reason: `Unsupported HITL rule requires human review: ${rule}`,
        details,
      };
    }

    const [, fieldName, operator, rawExpected] = parsed;
    const actualValue = fields[fieldName];
    if (actualValue === undefined) {
      details.push(`missing field for rule: ${rule}`);
      return {
        triggered: true,
        reason: `HITL rule references missing field: ${fieldName}`,
        details,
      };
    }

    const matched = compareRule(actualValue, operator, rawExpected);
    details.push(`${rule} => ${matched ? "matched" : "not_matched"}`);
    if (matched) {
      return {
        triggered: true,
        reason: `Configured HITL rule matched: ${rule}`,
        details,
      };
    }
  }

  return { triggered: false, reason: null, details };
}

function compareRule(actualValue: string, operator: string, expectedValue: string): boolean {
  if (operator === "==" || operator === "!=") {
    const actual = actualValue.trim().toLowerCase();
    const expected = expectedValue.trim().toLowerCase();
    return operator === "==" ? actual === expected : actual !== expected;
  }

  const actualNumber = Number.parseFloat(actualValue.replace(/[^0-9.-]/g, ""));
  const expectedNumber = Number.parseFloat(expectedValue.replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(actualNumber) || !Number.isFinite(expectedNumber)) {
    return true;
  }

  switch (operator) {
    case ">":
      return actualNumber > expectedNumber;
    case ">=":
      return actualNumber >= expectedNumber;
    case "<":
      return actualNumber < expectedNumber;
    case "<=":
      return actualNumber <= expectedNumber;
    default:
      return false;
  }
}
