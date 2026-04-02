// AurorA — evidence handoff emitter
// Source: Spec 05 — cross-system-evidence-handoff

import { deterministicHashObject } from "../../../../shared/utils/hash";
import { AuroraHandoffError } from "../../lib/errors";
import type { HandoffPayload } from "./types";
import type { ExtractionEvidencePackage, ExtractionResult } from "../extraction/types";
import type { IntakeAcceptedResult, IntakeResult } from "../intake/types";
import type { ExtractionLogRecord } from "../../storage/d1";

export interface EmitHandoffOptions {
  useCaseId: string;
  sessionRef?: string | undefined;
  emittedAtIso?: string | undefined;
}

export async function emitHandoff(
  intakeResult: IntakeResult,
  extractionResult: ExtractionResult,
  options: EmitHandoffOptions,
): Promise<HandoffPayload> {
  const acceptedIntake = requireAcceptedIntake(intakeResult);
  const useCaseId = options.useCaseId.trim();
  if (!useCaseId) {
    throw new AuroraHandoffError("HANDOFF_REQUIRES_USE_CASE_ID");
  }

  if (extractionResult.evidenceItems.length === 0) {
    throw new AuroraHandoffError("HANDOFF_REQUIRES_EXTRACTED_EVIDENCE", {
      intakeId: extractionResult.intakeId,
    });
  }

  const emittedAtIso = options.emittedAtIso ?? new Date().toISOString();
  const sessionRef = options.sessionRef?.trim() || extractionResult.processingRunId;
  const lineageRef = await deterministicHashObject({
    artifactId: acceptedIntake.artifact_id,
    extractionId: extractionResult.extractionId,
    processingRunId: extractionResult.processingRunId,
    sourceHash: acceptedIntake.source_hash,
    packageHash: extractionResult.packageHash,
  });

  const payloadBody: Omit<HandoffPayload, "payloadId"> = {
    schemaVersion: extractionResult.evidencePackage.schema_version,
    packageHash: extractionResult.packageHash,
    sourceSystem: "AurorA",
    targetSystem: "COMPASSai",
    useCaseId,
    sessionRef,
    processingRunId: extractionResult.processingRunId,
    documentType: extractionResult.documentType,
    fileRef: {
      artifactId: acceptedIntake.artifact_id,
      r2Key: acceptedIntake.storage.r2_key,
      mimeType: acceptedIntake.source_mime_type,
      sizeBytes: acceptedIntake.size_bytes,
      receivedAtIso: acceptedIntake.received_at,
      sourceFilename: acceptedIntake.source_filename,
      sourceHash: acceptedIntake.source_hash,
    },
    extractedEvidence: extractionResult.evidenceItems,
    extractionControlsApplied: extractionResult.controlsApplied.map((control) => control.controlId),
    evidenceTier: extractionResult.evidenceTier,
    admissible: extractionResult.overallAdmissible,
    reviewStatus: extractionResult.reviewDecision.status,
    reviewReason: extractionResult.reviewDecision.reason,
    lineageRef,
    emittedAtIso,
  };

  const payloadId = await deterministicHashObject(payloadBody);
  return {
    payloadId,
    ...payloadBody,
  };
}

export function buildExtractionResultFromLogRecord(record: ExtractionLogRecord): ExtractionResult {
  try {
    const evidencePackage = parseJson<ExtractionEvidencePackage>(record.evidence_package_json);
    const evidenceItems = parseJson<ExtractionResult["evidenceItems"]>(record.evidence_items_json);
    const controlsApplied = parseJson<ExtractionResult["controlsApplied"]>(record.controls_applied_json);
    const reviewDecision = parseJson<ExtractionResult["reviewDecision"]>(record.review_decision_json);
    const belowThresholdFields = parseJson<string[]>(record.below_threshold_fields_json);

    return {
      extractionId: record.extraction_id,
      processingRunId: record.processing_run_id,
      intakeId: record.artifact_id,
      documentType: record.document_type,
      evidenceItems,
      controlsApplied,
      overallAdmissible: reviewDecision.status === "auto_approved",
      mandatoryFieldsPresent: record.mandatory_fields_present === 1,
      belowThresholdFields,
      reviewDecision,
      evidencePackage,
      packageHash: record.package_hash,
      evidenceTier: record.evidence_tier as 1 | 2 | 3 | 4,
    };
  } catch (error) {
    throw new AuroraHandoffError("HANDOFF_INVALID_EXTRACTION_LOG", {
      extractionId: record.extraction_id,
      reason: error instanceof Error ? error.message : String(error),
    });
  }
}

function requireAcceptedIntake(result: IntakeResult): IntakeAcceptedResult {
  if (result.intake_state !== "ingested" || !result.artifact_id) {
    throw new AuroraHandoffError("HANDOFF_REQUIRES_ACCEPTED_INTAKE", {
      intakeState: result.intake_state,
    });
  }
  return result;
}

function parseJson<T>(value: string): T {
  return JSON.parse(value) as T;
}
