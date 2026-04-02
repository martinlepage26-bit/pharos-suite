// Aurora — D1 intake, lineage, extraction, and handoff bindings
// Source: Spec 03, Spec 04, Spec 05, Spec 08, docs/d1-r2-endpoint-mapping.md

import { deterministicHash } from "../../../shared/utils/hash";
import type {
  ArtifactLineageRecord,
  ArtifactVersionRecord,
  AuditEventRecord,
  ControlCheckRecord,
  DataLineage,
  EvidencePackageLineageRecord,
  HandoffHistoryRecord,
  LineageExposedStatus,
  ProcessingRunRecord,
  ReviewDecisionLineageRecord,
} from "../../../shared/types/lineage";
import type { HandoffPayload } from "../../../shared/types/handoff-contract";
import { StorageWriteError } from "../lib/errors";
import type {
  ControlResult,
  ExtractionEvidencePackage,
  ReviewDecision,
} from "../modules/extraction/types";

export interface IntakeRecord {
  artifact_id: string;
  r2_key: string;
  source_mime_type: string;
  size_bytes: number;
  source_filename: string;
  received_at: string;
  source_channel: string;
  operator_or_service_identity: string;
  document_type_hint: string | null;
  jurisdiction_context: string | null;
  legal_basis: string | null;
  purpose_of_processing: string | null;
  retention_profile: string | null;
  intake_state: string;
  known_unknowns: string;
  rejection_reason: string | null;
  source_hash: string;
}

export interface ExtractionLogRecord {
  extraction_id: string;
  processing_run_id: string;
  artifact_id: string;
  parent_run_id: string | null;
  schema_version: string;
  source_hash: string;
  document_type: string;
  processing_timestamp: string;
  extraction_results_json: string;
  evidence_package_json: string;
  mandatory_fields_present: number;
  below_threshold_fields_json: string;
  quality_controls_json: string;
  audit_trail_json: string;
  evidence_items_json: string;
  controls_applied_json: string;
  review_decision_json: string;
  evidence_tier: number;
  package_hash: string;
  if_trace_receipt: string | null;
  created_at: string;
}

export interface HandoffAuditRecord {
  event_id: string;
  artifact_id: string;
  extraction_id: string;
  payload_id: string | null;
  use_case_id: string;
  target_system: string;
  target_endpoint: string;
  event_type: "handoff_attempted" | "handoff_succeeded" | "handoff_failed";
  http_status: number | null;
  error_code: string | null;
  response_body_json: string | null;
  created_at: string;
}

interface ArtifactRow {
  artifact_id: string;
  source_channel: string;
  source_filename: string;
  source_mime_type: string;
  operator_or_service_identity: string;
  document_type_hint: string | null;
  jurisdiction_context: string | null;
  legal_basis: string | null;
  purpose_of_processing: string | null;
  retention_profile: string | null;
  known_unknowns_json: string;
  source_hash: string;
  current_state: string;
  current_review_state: "pending" | "auto_approved" | "hitl_required";
  latest_version_no: number;
  latest_version_id: string | null;
  latest_run_id: string | null;
  latest_package_id: string | null;
  latest_handoff_id: string | null;
  created_at: string;
  updated_at: string;
}

interface ArtifactVersionRow {
  version_id: string;
  artifact_id: string;
  version_no: number;
  source_object_key: string;
  source_hash: string;
  source_filename: string;
  source_mime_type: string;
  file_size_bytes: number;
  created_at: string;
}

interface ProcessingRunRow {
  run_id: string;
  artifact_id: string;
  artifact_version_id: string;
  parent_run_id: string | null;
  stage: string;
  iteration_index: number;
  triggered_by: string;
  source_hash: string;
  document_type: string;
  status: string;
  started_at: string;
  completed_at: string | null;
}

interface ControlCheckRow {
  check_id: string;
  run_id: string;
  control_id: string;
  status: "passed" | "failed";
  finding_code: string | null;
  finding_detail_json: string | null;
  triggered_human_review: number;
  created_at: string;
}

interface ReviewDecisionRow {
  decision_id: string;
  artifact_id: string;
  run_id: string | null;
  parent_decision_id: string | null;
  review_round: number;
  actor_type: string;
  actor_id: string | null;
  decision_type: string;
  rationale: string | null;
  resulting_state: "pending" | "auto_approved" | "hitl_required";
  created_at: string;
}

interface EvidencePackageRow {
  package_id: string;
  artifact_id: string;
  run_id: string;
  use_case_id: string;
  session_ref: string;
  schema_version: string;
  package_hash: string;
  lineage_ref: string;
  target_system: string;
  supersedes_package_id: string | null;
  payload_json: string;
  created_at: string;
}

interface HandoffHistoryRow {
  event_id: string;
  artifact_id: string;
  run_id: string;
  package_id: string | null;
  use_case_id: string;
  target_system: string;
  target_endpoint: string;
  event_type: "handoff_attempted" | "handoff_succeeded" | "handoff_failed";
  http_status: number | null;
  error_code: string | null;
  response_body_json: string | null;
  created_at: string;
}

interface AuditEventRow {
  event_id: string;
  aggregate_type: string;
  aggregate_id: string;
  event_type: string;
  event_payload_json: string;
  created_at: string;
}

export async function recordIntake(
  db: D1Database,
  params: {
    artifactId: string;
    r2Key: string;
    sourceMimeType: string;
    sizeBytes: number;
    sourceFilename: string;
    receivedAt: string;
    sourceChannel: string;
    operatorOrServiceIdentity: string;
    documentTypeHint?: string | undefined;
    jurisdictionContext?: string | undefined;
    legalBasis?: string | undefined;
    purposeOfProcessing?: string | undefined;
    retentionProfile?: string | undefined;
    intakeState: "ingested";
    knownUnknowns: string[];
    sourceHash: string;
  },
): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO file_intake (
          artifact_id,
          r2_key,
          source_mime_type,
          size_bytes,
          source_filename,
          received_at,
          source_channel,
          operator_or_service_identity,
          document_type_hint,
          jurisdiction_context,
          legal_basis,
          purpose_of_processing,
          retention_profile,
          intake_state,
          known_unknowns,
          rejection_reason,
          source_hash
        )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)`,
      )
      .bind(
        params.artifactId,
        params.r2Key,
        params.sourceMimeType,
        params.sizeBytes,
        params.sourceFilename,
        params.receivedAt,
        params.sourceChannel,
        params.operatorOrServiceIdentity,
        params.documentTypeHint ?? null,
        params.jurisdictionContext ?? null,
        params.legalBasis ?? null,
        params.purposeOfProcessing ?? null,
        params.retentionProfile ?? null,
        params.intakeState,
        JSON.stringify(params.knownUnknowns),
        params.sourceHash,
      )
      .run();

    await ensureArtifactLineageRoot(db, {
      artifact_id: params.artifactId,
      r2_key: params.r2Key,
      source_mime_type: params.sourceMimeType,
      size_bytes: params.sizeBytes,
      source_filename: params.sourceFilename,
      received_at: params.receivedAt,
      source_channel: params.sourceChannel,
      operator_or_service_identity: params.operatorOrServiceIdentity,
      document_type_hint: params.documentTypeHint ?? null,
      jurisdiction_context: params.jurisdictionContext ?? null,
      legal_basis: params.legalBasis ?? null,
      purpose_of_processing: params.purposeOfProcessing ?? null,
      retention_profile: params.retentionProfile ?? null,
      intake_state: params.intakeState,
      known_unknowns: JSON.stringify(params.knownUnknowns),
      rejection_reason: null,
      source_hash: params.sourceHash,
    });

    const auditEventId = await deterministicHash(`${params.artifactId}:artifact_uploaded:${params.receivedAt}`);
    await recordAuditEvent(db, {
      eventId: auditEventId,
      artifactId: params.artifactId,
      eventType: "artifact_uploaded",
      createdAt: params.receivedAt,
      payload: {
        artifactId: params.artifactId,
        r2Key: params.r2Key,
        sourceHash: params.sourceHash,
        versionNo: 1,
      },
    });
  } catch (err) {
    throw toStorageWriteError("recordIntake", err);
  }
}

export async function ensureArtifactLineageRoot(db: D1Database, intakeRecord: IntakeRecord): Promise<void> {
  try {
    const versionId = await buildArtifactVersionId(intakeRecord.artifact_id, 1);

    await db
      .prepare(
        `INSERT OR IGNORE INTO artifacts (
          artifact_id,
          source_channel,
          source_filename,
          source_mime_type,
          operator_or_service_identity,
          document_type_hint,
          jurisdiction_context,
          legal_basis,
          purpose_of_processing,
          retention_profile,
          known_unknowns_json,
          source_hash,
          current_state,
          current_review_state,
          latest_version_no,
          latest_version_id,
          latest_run_id,
          latest_package_id,
          latest_handoff_id,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ingested', 'pending', 1, ?, NULL, NULL, NULL, ?, ?)`,
      )
      .bind(
        intakeRecord.artifact_id,
        intakeRecord.source_channel,
        intakeRecord.source_filename,
        intakeRecord.source_mime_type,
        intakeRecord.operator_or_service_identity,
        intakeRecord.document_type_hint,
        intakeRecord.jurisdiction_context,
        intakeRecord.legal_basis,
        intakeRecord.purpose_of_processing,
        intakeRecord.retention_profile,
        intakeRecord.known_unknowns,
        intakeRecord.source_hash,
        versionId,
        intakeRecord.received_at,
        intakeRecord.received_at,
      )
      .run();

    await db
      .prepare(
        `INSERT OR IGNORE INTO artifact_versions (
          version_id,
          artifact_id,
          version_no,
          source_object_key,
          source_hash,
          source_filename,
          source_mime_type,
          file_size_bytes,
          created_at
        )
        VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        versionId,
        intakeRecord.artifact_id,
        intakeRecord.r2_key,
        intakeRecord.source_hash,
        intakeRecord.source_filename,
        intakeRecord.source_mime_type,
        intakeRecord.size_bytes,
        intakeRecord.received_at,
      )
      .run();
  } catch (err) {
    throw toStorageWriteError("ensureArtifactLineageRoot", err);
  }
}

export async function getIntakeById(db: D1Database, artifactId: string): Promise<IntakeRecord | null> {
  const result = await db
    .prepare("SELECT * FROM file_intake WHERE artifact_id = ?")
    .bind(artifactId)
    .first<IntakeRecord>();
  return result ?? null;
}

export async function recordExtractionLog(
  db: D1Database,
  params: {
    extractionId: string;
    processingRunId: string;
    artifactId: string;
    parentRunId?: string | undefined;
    schemaVersion: string;
    sourceHash: string;
    documentType: string;
    processingTimestamp: string;
    extractionResults: unknown;
    evidencePackage: ExtractionEvidencePackage;
    mandatoryFieldsPresent: boolean;
    belowThresholdFields: string[];
    qualityControls: unknown;
    auditTrail: unknown;
    evidenceItems: unknown;
    controlsApplied: ControlResult[];
    reviewDecision: ReviewDecision;
    evidenceTier: 1 | 2 | 3 | 4;
    packageHash: string;
    ifTraceReceipt?: string | null | undefined;
  },
): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO extraction_log (
          extraction_id,
          processing_run_id,
          artifact_id,
          parent_run_id,
          schema_version,
          source_hash,
          document_type,
          processing_timestamp,
          extraction_results_json,
          evidence_package_json,
          mandatory_fields_present,
          below_threshold_fields_json,
          quality_controls_json,
          audit_trail_json,
          evidence_items_json,
          controls_applied_json,
          review_decision_json,
          evidence_tier,
          package_hash,
          if_trace_receipt,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        params.extractionId,
        params.processingRunId,
        params.artifactId,
        params.parentRunId ?? null,
        params.schemaVersion,
        params.sourceHash,
        params.documentType,
        params.processingTimestamp,
        JSON.stringify(params.extractionResults),
        JSON.stringify(params.evidencePackage),
        params.mandatoryFieldsPresent ? 1 : 0,
        JSON.stringify(params.belowThresholdFields),
        JSON.stringify(params.qualityControls),
        JSON.stringify(params.auditTrail),
        JSON.stringify(params.evidenceItems),
        JSON.stringify(params.controlsApplied),
        JSON.stringify(params.reviewDecision),
        params.evidenceTier,
        params.packageHash,
        params.ifTraceReceipt ?? null,
        params.processingTimestamp,
      )
      .run();

    const artifactVersionId = await buildArtifactVersionId(params.artifactId, 1);
    const processingStatus = params.reviewDecision.status === "auto_approved" ? "completed" : "review_required";
    await db
      .prepare(
        `INSERT INTO processing_runs (
          run_id,
          artifact_id,
          artifact_version_id,
          parent_run_id,
          stage,
          iteration_index,
          triggered_by,
          source_hash,
          document_type,
          status,
          started_at,
          completed_at
        )
        VALUES (?, ?, ?, ?, 'extraction', ?, 'aurora-extraction-worker', ?, ?, ?, ?, ?)`,
      )
      .bind(
        params.processingRunId,
        params.artifactId,
        artifactVersionId,
        params.parentRunId ?? null,
        params.parentRunId ? 2 : 1,
        params.sourceHash,
        params.documentType,
        processingStatus,
        params.processingTimestamp,
        params.processingTimestamp,
      )
      .run();

    for (const control of params.controlsApplied) {
      const checkId = await deterministicHash(`${params.extractionId}:${control.controlId}`);
      await db
        .prepare(
          `INSERT INTO control_checks (
            check_id,
            run_id,
            control_id,
            status,
            finding_code,
            finding_detail_json,
            triggered_human_review,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          checkId,
          params.processingRunId,
          control.controlId,
          control.passed ? "passed" : "failed",
          control.findingCode ?? null,
          control.findingDetail ? JSON.stringify(control.findingDetail) : null,
          control.triggeredHumanReview ? 1 : 0,
          params.processingTimestamp,
        )
        .run();
    }

    const reviewDecisionId = await deterministicHash(`${params.extractionId}:review_decision`);
    await db
      .prepare(
        `INSERT INTO review_decisions (
          decision_id,
          artifact_id,
          run_id,
          parent_decision_id,
          review_round,
          actor_type,
          actor_id,
          decision_type,
          rationale,
          resulting_state,
          created_at
        )
        VALUES (?, ?, ?, NULL, ?, 'system', ?, ?, ?, ?, ?)`,
      )
      .bind(
        reviewDecisionId,
        params.artifactId,
        params.processingRunId,
        params.parentRunId ? 2 : 1,
        params.reviewDecision.reviewer_identity ?? "aurora-extraction-worker",
        params.reviewDecision.decision_type,
        params.reviewDecision.reason,
        params.reviewDecision.status,
        params.processingTimestamp,
      )
      .run();

    await db
      .prepare(
        `UPDATE artifacts
         SET document_type_hint = ?,
             current_state = ?,
             current_review_state = ?,
             latest_run_id = ?,
             updated_at = ?
         WHERE artifact_id = ?`,
      )
      .bind(
        params.documentType,
        params.reviewDecision.status === "auto_approved" ? "extracted" : "review_required",
        params.reviewDecision.status,
        params.processingRunId,
        params.processingTimestamp,
        params.artifactId,
      )
      .run();

    const auditEventId = await deterministicHash(`${params.artifactId}:extraction_completed:${params.processingRunId}`);
    await recordAuditEvent(db, {
      eventId: auditEventId,
      artifactId: params.artifactId,
      eventType: "extraction_completed",
      createdAt: params.processingTimestamp,
      payload: {
        extractionId: params.extractionId,
        processingRunId: params.processingRunId,
        documentType: params.documentType,
        reviewState: params.reviewDecision.status,
        packageHash: params.packageHash,
      },
    });
  } catch (err) {
    throw toStorageWriteError("recordExtractionLog", err);
  }
}

export async function getLatestExtractionLogByArtifactId(
  db: D1Database,
  artifactId: string,
): Promise<ExtractionLogRecord | null> {
  const result = await db
    .prepare("SELECT * FROM extraction_log WHERE artifact_id = ? ORDER BY created_at DESC LIMIT 1")
    .bind(artifactId)
    .first<ExtractionLogRecord>();
  return result ?? null;
}

export async function recordEvidencePackage(
  db: D1Database,
  payload: HandoffPayload,
): Promise<void> {
  try {
    const priorPackage = await getLatestEvidencePackageByArtifactAndUseCase(
      db,
      payload.fileRef.artifactId,
      payload.useCaseId,
    );

    await db
      .prepare(
        `INSERT INTO evidence_packages (
          package_id,
          artifact_id,
          run_id,
          use_case_id,
          session_ref,
          schema_version,
          package_hash,
          lineage_ref,
          target_system,
          supersedes_package_id,
          payload_json,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        payload.payloadId,
        payload.fileRef.artifactId,
        payload.processingRunId,
        payload.useCaseId,
        payload.sessionRef,
        payload.schemaVersion,
        payload.packageHash,
        payload.lineageRef,
        payload.targetSystem,
        priorPackage?.packageId ?? null,
        JSON.stringify(payload),
        payload.emittedAtIso,
      )
      .run();

    await db
      .prepare(
        `UPDATE artifacts
         SET current_state = 'packaged',
             latest_package_id = ?,
             updated_at = ?
         WHERE artifact_id = ?`,
      )
      .bind(payload.payloadId, payload.emittedAtIso, payload.fileRef.artifactId)
      .run();

    const auditEventId = await deterministicHash(`${payload.fileRef.artifactId}:evidence_package_created:${payload.payloadId}`);
    await recordAuditEvent(db, {
      eventId: auditEventId,
      artifactId: payload.fileRef.artifactId,
      eventType: "evidence_package_created",
      createdAt: payload.emittedAtIso,
      payload: {
        packageId: payload.payloadId,
        useCaseId: payload.useCaseId,
        processingRunId: payload.processingRunId,
        supersedesPackageId: priorPackage?.packageId ?? null,
      },
    });
  } catch (err) {
    throw toStorageWriteError("recordEvidencePackage", err);
  }
}

export async function recordHandoffAuditEvent(
  db: D1Database,
  params: {
    eventId: string;
    artifactId: string;
    extractionId: string;
    payloadId?: string | null | undefined;
    useCaseId: string;
    targetSystem: string;
    targetEndpoint: string;
    eventType: HandoffAuditRecord["event_type"];
    httpStatus?: number | null | undefined;
    errorCode?: string | null | undefined;
    responseBody?: unknown;
    createdAt: string;
  },
): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO handoff_audit_log (
          event_id,
          artifact_id,
          extraction_id,
          payload_id,
          use_case_id,
          target_system,
          target_endpoint,
          event_type,
          http_status,
          error_code,
          response_body_json,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        params.eventId,
        params.artifactId,
        params.extractionId,
        params.payloadId ?? null,
        params.useCaseId,
        params.targetSystem,
        params.targetEndpoint,
        params.eventType,
        params.httpStatus ?? null,
        params.errorCode ?? null,
        params.responseBody === undefined ? null : JSON.stringify(params.responseBody),
        params.createdAt,
      )
      .run();

    await db
      .prepare(
        `INSERT INTO handoff_history (
          event_id,
          artifact_id,
          run_id,
          package_id,
          use_case_id,
          target_system,
          target_endpoint,
          event_type,
          http_status,
          error_code,
          response_body_json,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        params.eventId,
        params.artifactId,
        params.extractionId,
        params.payloadId ?? null,
        params.useCaseId,
        params.targetSystem,
        params.targetEndpoint,
        params.eventType,
        params.httpStatus ?? null,
        params.errorCode ?? null,
        params.responseBody === undefined ? null : JSON.stringify(params.responseBody),
        params.createdAt,
      )
      .run();

    await db
      .prepare(
        `UPDATE artifacts
         SET current_state = ?,
             latest_handoff_id = ?,
             updated_at = ?
         WHERE artifact_id = ?`,
      )
      .bind(
        params.eventType === "handoff_succeeded"
          ? "handoff_succeeded"
          : params.eventType === "handoff_failed"
            ? "handoff_failed"
            : "packaged",
        params.eventId,
        params.createdAt,
        params.artifactId,
      )
      .run();

    await recordAuditEvent(db, {
      eventId: await deterministicHash(`${params.artifactId}:${params.eventType}:${params.eventId}`),
      artifactId: params.artifactId,
      eventType: params.eventType,
      createdAt: params.createdAt,
      payload: {
        extractionId: params.extractionId,
        packageId: params.payloadId ?? null,
        useCaseId: params.useCaseId,
        targetSystem: params.targetSystem,
        targetEndpoint: params.targetEndpoint,
        httpStatus: params.httpStatus ?? null,
        errorCode: params.errorCode ?? null,
      },
    });
  } catch (err) {
    throw toStorageWriteError("recordHandoffAuditEvent", err);
  }
}

export async function getAuroraLineageSnapshot(db: D1Database, artifactId: string): Promise<DataLineage | null> {
  const intakeRecord = await getIntakeById(db, artifactId);
  if (!intakeRecord) {
    return null;
  }

  const artifact = await getArtifactById(db, artifactId);
  const versions = artifact ? await listArtifactVersionsByArtifactId(db, artifactId) : [];
  const processingRuns = artifact ? await listProcessingRunsByArtifactId(db, artifactId) : [];
  const controlChecks =
    processingRuns.length > 0 ? await listControlChecksByRunIds(db, processingRuns.map((run) => run.runId)) : [];
  const reviewDecisions = artifact ? await listReviewDecisionsByArtifactId(db, artifactId) : [];
  const evidencePackages = artifact ? await listEvidencePackagesByArtifactId(db, artifactId) : [];
  const handoffHistory = artifact ? await listHandoffHistoryByArtifactId(db, artifactId) : [];
  const auditEvents = artifact ? await listAuditEventsByArtifactId(db, artifactId) : [];

  const exposedStatus = deriveAuroraLineageStatus({
    artifact,
    versions,
    processingRuns,
    controlChecks,
    reviewDecisions,
    evidencePackages,
    handoffHistory,
  });

  const lineageId = await deterministicHash(
    JSON.stringify({
      artifactId,
      latestVersionId: exposedStatus.latestVersionId,
      latestRunId: exposedStatus.latestRunId,
      latestPackageId: exposedStatus.latestPackageId,
      latestHandoffId: exposedStatus.latestHandoffId,
      counts: {
        versions: versions.length,
        runs: processingRuns.length,
        packages: evidencePackages.length,
        handoffs: handoffHistory.length,
      },
    }),
  );

  return {
    lineageId,
    artifactId,
    artifact,
    versions,
    processingRuns,
    controlChecks,
    reviewDecisions,
    evidencePackages,
    handoffHistory,
    auditEvents,
    exposedStatus,
  };
}

async function getArtifactById(db: D1Database, artifactId: string): Promise<ArtifactLineageRecord | null> {
  const result = await db.prepare("SELECT * FROM artifacts WHERE artifact_id = ?").bind(artifactId).first<ArtifactRow>();
  return result ? mapArtifactRow(result) : null;
}

async function listArtifactVersionsByArtifactId(
  db: D1Database,
  artifactId: string,
): Promise<ArtifactVersionRecord[]> {
  const result = await db
    .prepare("SELECT * FROM artifact_versions WHERE artifact_id = ? ORDER BY version_no ASC")
    .bind(artifactId)
    .all<ArtifactVersionRow>();
  return (result.results ?? []).map(mapArtifactVersionRow);
}

async function listProcessingRunsByArtifactId(
  db: D1Database,
  artifactId: string,
): Promise<ProcessingRunRecord[]> {
  const result = await db
    .prepare("SELECT * FROM processing_runs WHERE artifact_id = ? ORDER BY started_at ASC")
    .bind(artifactId)
    .all<ProcessingRunRow>();
  return (result.results ?? []).map(mapProcessingRunRow);
}

async function listControlChecksByRunIds(db: D1Database, runIds: string[]): Promise<ControlCheckRecord[]> {
  if (runIds.length === 0) {
    return [];
  }

  const placeholders = buildInClause(runIds.length);
  const result = await db
    .prepare(`SELECT * FROM control_checks WHERE run_id IN (${placeholders}) ORDER BY created_at ASC`)
    .bind(...runIds)
    .all<ControlCheckRow>();
  return (result.results ?? []).map(mapControlCheckRow);
}

async function listReviewDecisionsByArtifactId(
  db: D1Database,
  artifactId: string,
): Promise<ReviewDecisionLineageRecord[]> {
  const result = await db
    .prepare("SELECT * FROM review_decisions WHERE artifact_id = ? ORDER BY created_at ASC")
    .bind(artifactId)
    .all<ReviewDecisionRow>();
  return (result.results ?? []).map(mapReviewDecisionRow);
}

async function listEvidencePackagesByArtifactId(
  db: D1Database,
  artifactId: string,
): Promise<EvidencePackageLineageRecord[]> {
  const result = await db
    .prepare("SELECT * FROM evidence_packages WHERE artifact_id = ? ORDER BY created_at ASC")
    .bind(artifactId)
    .all<EvidencePackageRow>();
  return (result.results ?? []).map(mapEvidencePackageRow);
}

async function getLatestEvidencePackageByArtifactAndUseCase(
  db: D1Database,
  artifactId: string,
  useCaseId: string,
): Promise<EvidencePackageLineageRecord | null> {
  const result = await db
    .prepare(
      "SELECT * FROM evidence_packages WHERE artifact_id = ? AND use_case_id = ? ORDER BY created_at DESC LIMIT 1",
    )
    .bind(artifactId, useCaseId)
    .first<EvidencePackageRow>();
  return result ? mapEvidencePackageRow(result) : null;
}

async function listHandoffHistoryByArtifactId(
  db: D1Database,
  artifactId: string,
): Promise<HandoffHistoryRecord[]> {
  const result = await db
    .prepare("SELECT * FROM handoff_history WHERE artifact_id = ? ORDER BY created_at ASC")
    .bind(artifactId)
    .all<HandoffHistoryRow>();
  return (result.results ?? []).map(mapHandoffHistoryRow);
}

async function listAuditEventsByArtifactId(
  db: D1Database,
  artifactId: string,
): Promise<AuditEventRecord[]> {
  const result = await db
    .prepare("SELECT * FROM audit_events WHERE aggregate_id = ? ORDER BY created_at ASC")
    .bind(artifactId)
    .all<AuditEventRow>();
  return (result.results ?? []).map(mapAuditEventRow);
}

async function recordAuditEvent(
  db: D1Database,
  params: {
    eventId: string;
    artifactId: string;
    eventType: string;
    createdAt: string;
    payload: Record<string, unknown>;
  },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO audit_events (
        event_id,
        aggregate_type,
        aggregate_id,
        event_type,
        event_payload_json,
        created_at
      )
      VALUES (?, 'artifact', ?, ?, ?, ?)`,
    )
    .bind(params.eventId, params.artifactId, params.eventType, JSON.stringify(params.payload), params.createdAt)
    .run();
}

function deriveAuroraLineageStatus(params: {
  artifact: ArtifactLineageRecord | null;
  versions: ArtifactVersionRecord[];
  processingRuns: ProcessingRunRecord[];
  controlChecks: ControlCheckRecord[];
  reviewDecisions: ReviewDecisionLineageRecord[];
  evidencePackages: EvidencePackageLineageRecord[];
  handoffHistory: HandoffHistoryRecord[];
}): LineageExposedStatus {
  const reasons: string[] = [];
  const latestArtifactVersionId = params.artifact?.latestVersionId ?? params.versions.at(-1)?.versionId ?? null;

  if (!params.artifact) {
    reasons.push("Normalized artifact lineage root is missing; falling back to the narrower legacy intake state.");
    return {
      state: "ingested",
      reviewState: "pending",
      lineageIntegrity: "degraded",
      reasons,
      latestVersionId: null,
      latestRunId: null,
      latestPackageId: null,
      latestHandoffId: null,
    };
  }

  if (params.versions.length === 0) {
    reasons.push("Artifact version lineage is missing.");
    return {
      state: "ingested",
      reviewState: params.artifact.currentReviewState,
      lineageIntegrity: "degraded",
      reasons,
      latestVersionId: latestArtifactVersionId,
      latestRunId: params.artifact.latestRunId,
      latestPackageId: params.artifact.latestPackageId,
      latestHandoffId: params.artifact.latestHandoffId,
    };
  }

  const latestRun = selectLatestProcessingRun(params.processingRuns, params.artifact.latestRunId);
  if (!latestRun) {
    reasons.push("No processing run has been recorded for this artifact.");
    return {
      state: "ingested",
      reviewState: params.artifact.currentReviewState,
      lineageIntegrity: "complete",
      reasons,
      latestVersionId: latestArtifactVersionId,
      latestRunId: null,
      latestPackageId: params.artifact.latestPackageId,
      latestHandoffId: params.artifact.latestHandoffId,
    };
  }

  const runChecks = params.controlChecks.filter((check) => check.runId === latestRun.runId);
  const latestReviewDecision = selectLatestReviewDecision(
    params.reviewDecisions.filter((decision) => decision.runId === latestRun.runId),
  );

  if (runChecks.length === 0) {
    reasons.push("The latest processing run is missing control-check records.");
    return {
      state: "processing_incomplete",
      reviewState: "pending",
      lineageIntegrity: "degraded",
      reasons,
      latestVersionId: latestArtifactVersionId,
      latestRunId: latestRun.runId,
      latestPackageId: params.artifact.latestPackageId,
      latestHandoffId: params.artifact.latestHandoffId,
    };
  }

  if (!latestReviewDecision) {
    reasons.push("The latest processing run is missing a review-decision record.");
    return {
      state: "processing_incomplete",
      reviewState: "pending",
      lineageIntegrity: "degraded",
      reasons,
      latestVersionId: latestArtifactVersionId,
      latestRunId: latestRun.runId,
      latestPackageId: params.artifact.latestPackageId,
      latestHandoffId: params.artifact.latestHandoffId,
    };
  }

  if (latestReviewDecision.resultingState === "hitl_required") {
    return {
      state: "review_required",
      reviewState: "hitl_required",
      lineageIntegrity: "complete",
      reasons,
      latestVersionId: latestArtifactVersionId,
      latestRunId: latestRun.runId,
      latestPackageId: params.artifact.latestPackageId,
      latestHandoffId: params.artifact.latestHandoffId,
    };
  }

  const latestPackage = selectLatestEvidencePackage(params.evidencePackages, params.artifact.latestPackageId);
  if (!latestPackage) {
    reasons.push("No append-only evidence package has been recorded for the latest run.");
    return {
      state: "extracted_ready",
      reviewState: "auto_approved",
      lineageIntegrity: "complete",
      reasons,
      latestVersionId: latestArtifactVersionId,
      latestRunId: latestRun.runId,
      latestPackageId: null,
      latestHandoffId: params.artifact.latestHandoffId,
    };
  }

  if (latestPackage.runId !== latestRun.runId) {
    reasons.push("A newer extraction run exists than the latest packaged envelope, so status stays narrower.");
    return {
      state: "extracted_ready",
      reviewState: "auto_approved",
      lineageIntegrity: "complete",
      reasons,
      latestVersionId: latestArtifactVersionId,
      latestRunId: latestRun.runId,
      latestPackageId: latestPackage.packageId,
      latestHandoffId: params.artifact.latestHandoffId,
    };
  }

  const latestHandoff = selectLatestHandoff(
    params.handoffHistory.filter((event) => event.packageId === latestPackage.packageId),
    params.artifact.latestHandoffId,
  );
  if (!latestHandoff) {
    reasons.push("No handoff outcome has been recorded for the latest package.");
    return {
      state: "packaged",
      reviewState: "auto_approved",
      lineageIntegrity: "complete",
      reasons,
      latestVersionId: latestArtifactVersionId,
      latestRunId: latestRun.runId,
      latestPackageId: latestPackage.packageId,
      latestHandoffId: null,
    };
  }

  if (latestHandoff.eventType === "handoff_failed") {
    reasons.push("The latest handoff event failed.");
    return {
      state: "handoff_failed",
      reviewState: "auto_approved",
      lineageIntegrity: "complete",
      reasons,
      latestVersionId: latestArtifactVersionId,
      latestRunId: latestRun.runId,
      latestPackageId: latestPackage.packageId,
      latestHandoffId: latestHandoff.eventId,
    };
  }

  if (latestHandoff.eventType === "handoff_succeeded") {
    return {
      state: "handoff_succeeded",
      reviewState: "auto_approved",
      lineageIntegrity: "complete",
      reasons,
      latestVersionId: latestArtifactVersionId,
      latestRunId: latestRun.runId,
      latestPackageId: latestPackage.packageId,
      latestHandoffId: latestHandoff.eventId,
    };
  }

  reasons.push("The latest handoff has been attempted but not yet completed.");
  return {
    state: "packaged",
    reviewState: "auto_approved",
    lineageIntegrity: "complete",
    reasons,
    latestVersionId: latestArtifactVersionId,
    latestRunId: latestRun.runId,
    latestPackageId: latestPackage.packageId,
    latestHandoffId: latestHandoff.eventId,
  };
}

function mapArtifactRow(row: ArtifactRow): ArtifactLineageRecord {
  return {
    artifactId: row.artifact_id,
    sourceChannel: row.source_channel,
    sourceFilename: row.source_filename,
    sourceMimeType: row.source_mime_type,
    operatorOrServiceIdentity: row.operator_or_service_identity,
    documentTypeHint: row.document_type_hint,
    jurisdictionContext: row.jurisdiction_context,
    legalBasis: row.legal_basis,
    purposeOfProcessing: row.purpose_of_processing,
    retentionProfile: row.retention_profile,
    knownUnknowns: parseJsonArray(row.known_unknowns_json),
    sourceHash: row.source_hash,
    currentState: row.current_state,
    currentReviewState: row.current_review_state,
    latestVersionNo: row.latest_version_no,
    latestVersionId: row.latest_version_id,
    latestRunId: row.latest_run_id,
    latestPackageId: row.latest_package_id,
    latestHandoffId: row.latest_handoff_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapArtifactVersionRow(row: ArtifactVersionRow): ArtifactVersionRecord {
  return {
    versionId: row.version_id,
    artifactId: row.artifact_id,
    versionNo: row.version_no,
    sourceObjectKey: row.source_object_key,
    sourceHash: row.source_hash,
    sourceFilename: row.source_filename,
    sourceMimeType: row.source_mime_type,
    fileSizeBytes: row.file_size_bytes,
    createdAt: row.created_at,
  };
}

function mapProcessingRunRow(row: ProcessingRunRow): ProcessingRunRecord {
  return {
    runId: row.run_id,
    artifactId: row.artifact_id,
    artifactVersionId: row.artifact_version_id,
    parentRunId: row.parent_run_id,
    stage: row.stage,
    iterationIndex: row.iteration_index,
    triggeredBy: row.triggered_by,
    sourceHash: row.source_hash,
    documentType: row.document_type,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at,
  };
}

function mapControlCheckRow(row: ControlCheckRow): ControlCheckRecord {
  return {
    checkId: row.check_id,
    runId: row.run_id,
    controlId: row.control_id,
    status: row.status,
    findingCode: row.finding_code,
    findingDetail: parseJsonObject(row.finding_detail_json),
    triggeredHumanReview: row.triggered_human_review === 1,
    createdAt: row.created_at,
  };
}

function mapReviewDecisionRow(row: ReviewDecisionRow): ReviewDecisionLineageRecord {
  return {
    decisionId: row.decision_id,
    artifactId: row.artifact_id,
    runId: row.run_id,
    parentDecisionId: row.parent_decision_id,
    reviewRound: row.review_round,
    actorType: row.actor_type,
    actorId: row.actor_id,
    decisionType: row.decision_type,
    rationale: row.rationale,
    resultingState: row.resulting_state,
    createdAt: row.created_at,
  };
}

function mapEvidencePackageRow(row: EvidencePackageRow): EvidencePackageLineageRecord {
  return {
    packageId: row.package_id,
    artifactId: row.artifact_id,
    runId: row.run_id,
    useCaseId: row.use_case_id,
    sessionRef: row.session_ref,
    schemaVersion: row.schema_version,
    packageHash: row.package_hash,
    lineageRef: row.lineage_ref,
    targetSystem: row.target_system,
    supersedesPackageId: row.supersedes_package_id,
    payload: parseJsonObject(row.payload_json) ?? {},
    createdAt: row.created_at,
  };
}

function mapHandoffHistoryRow(row: HandoffHistoryRow): HandoffHistoryRecord {
  return {
    eventId: row.event_id,
    artifactId: row.artifact_id,
    runId: row.run_id,
    packageId: row.package_id,
    useCaseId: row.use_case_id,
    targetSystem: row.target_system,
    targetEndpoint: row.target_endpoint,
    eventType: row.event_type,
    httpStatus: row.http_status,
    errorCode: row.error_code,
    responseBody: parseJsonUnknown(row.response_body_json),
    createdAt: row.created_at,
  };
}

function mapAuditEventRow(row: AuditEventRow): AuditEventRecord {
  return {
    eventId: row.event_id,
    aggregateType: row.aggregate_type,
    aggregateId: row.aggregate_id,
    eventType: row.event_type,
    eventPayload: parseJsonObject(row.event_payload_json) ?? {},
    createdAt: row.created_at,
  };
}

function selectLatestProcessingRun(
  runs: ProcessingRunRecord[],
  preferredRunId: string | null,
): ProcessingRunRecord | null {
  if (preferredRunId) {
    const match = runs.find((run) => run.runId === preferredRunId);
    if (match) {
      return match;
    }
  }
  return runs.at(-1) ?? null;
}

function selectLatestReviewDecision(
  decisions: ReviewDecisionLineageRecord[],
): ReviewDecisionLineageRecord | null {
  return decisions.at(-1) ?? null;
}

function selectLatestEvidencePackage(
  packages: EvidencePackageLineageRecord[],
  preferredPackageId: string | null,
): EvidencePackageLineageRecord | null {
  if (preferredPackageId) {
    const match = packages.find((candidate) => candidate.packageId === preferredPackageId);
    if (match) {
      return match;
    }
  }
  return packages.at(-1) ?? null;
}

function selectLatestHandoff(
  handoffs: HandoffHistoryRecord[],
  preferredEventId: string | null,
): HandoffHistoryRecord | null {
  if (preferredEventId) {
    const match = handoffs.find((candidate) => candidate.eventId === preferredEventId);
    if (match) {
      return match;
    }
  }
  return handoffs.at(-1) ?? null;
}

async function buildArtifactVersionId(artifactId: string, versionNo: number): Promise<string> {
  return deterministicHash(`${artifactId}:artifact_version:${versionNo}`);
}

function buildInClause(count: number): string {
  return new Array(count).fill("?").join(", ");
}

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function parseJsonObject(value: string | null): Record<string, unknown> | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function parseJsonUnknown(value: string | null): unknown {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toStorageWriteError(operation: string, err: unknown): StorageWriteError {
  const message = err instanceof Error ? err.message : String(err);
  return new StorageWriteError("D1_WRITE_FAILED", operation, message);
}
