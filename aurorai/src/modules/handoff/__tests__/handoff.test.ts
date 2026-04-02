import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { IntakeAcceptedResult } from "../../intake/types";
import type { IntakeRecord } from "../../../storage/d1";
import type { ExtractionJob } from "../../extraction/types";
import { runExtraction } from "../../extraction/index";
import { emitHandoff } from "../index";
import { receiveHandoff } from "../../../../../compassai/src/modules/handoff/index";
import { CompassHandoffError } from "../../../../../compassai/src/lib/errors";

type UseCaseRow = {
  use_case_id: string;
  client_id: string | null;
  ai_system_id: string | null;
  name: string;
  purpose: string;
  business_owner: string;
  business_owner_confirmed: number;
  systems_involved_json: string;
  data_categories_json: string;
  automation_level: string;
  decision_impact: string | null;
  regulated_domain: number;
  regulated_domain_notes: string | null;
  scale: string;
  known_unknowns_json: string;
  status: string;
  current_gate: string;
  gates_json: string;
  gate_reasons_json: string;
  current_cycle_id: string | null;
  cycle_index: number;
  latest_risk_tier: string | null;
  latest_assessment_id: string | null;
  evidence_count: number;
  feedback_action_count: number;
  created_at: string;
  updated_at: string;
};

type AuroraArtifactRow = {
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
};

type AuroraArtifactVersionRow = {
  version_id: string;
  artifact_id: string;
  version_no: number;
  source_object_key: string;
  source_hash: string;
  source_filename: string;
  source_mime_type: string;
  file_size_bytes: number;
  created_at: string;
};

type AuroraProcessingRunRow = {
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
};

type AuroraControlCheckRow = {
  check_id: string;
  run_id: string;
  control_id: string;
  status: "passed" | "failed";
  finding_code: string | null;
  finding_detail_json: string | null;
  triggered_human_review: number;
  created_at: string;
};

type AuroraReviewDecisionRow = {
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
};

type AuroraEvidencePackageRow = {
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
};

type AuroraHandoffHistoryRow = {
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
};

type AuroraAuditEventRow = {
  event_id: string;
  aggregate_type: string;
  aggregate_id: string;
  event_type: string;
  event_payload_json: string;
  created_at: string;
};

function buildIntakeRecord(overrides?: Partial<IntakeRecord>): IntakeRecord {
  return {
    artifact_id: "artifact-123",
    r2_key: "govern-artifacts/artifacts/artifact-123/v1/source.pdf",
    source_mime_type: "application/pdf",
    size_bytes: 4096,
    source_filename: "invoice.pdf",
    received_at: "2026-03-31T00:00:00Z",
    source_channel: "browser_upload",
    operator_or_service_identity: "case-operator",
    document_type_hint: "invoice",
    jurisdiction_context: "CA-QC",
    legal_basis: "contractual_review",
    purpose_of_processing: "governance_review",
    retention_profile: "standard_case_retention",
    intake_state: "ingested",
    known_unknowns: "[]",
    rejection_reason: null,
    source_hash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    ...overrides,
  };
}

function buildUseCaseRow(
  useCaseId = "usecase-7",
  overrides?: Partial<UseCaseRow>,
): UseCaseRow {
  return {
    use_case_id: useCaseId,
    client_id: null,
    ai_system_id: null,
    name: "Claims Review Assistant",
    purpose: "Support structured claim review",
    business_owner: "governance-owner",
    business_owner_confirmed: 1,
    systems_involved_json: JSON.stringify(["claims_portal"]),
    data_categories_json: JSON.stringify(["personal", "medical"]),
    automation_level: "human-in-the-loop",
    decision_impact: "assistive",
    regulated_domain: 1,
    regulated_domain_notes: "healthcare review",
    scale: "department",
    known_unknowns_json: JSON.stringify(["retention schedule under review"]),
    status: "intake_complete",
    current_gate: "intake_complete",
    gates_json: JSON.stringify({
      intake_complete: "complete",
      risk_assessed: "pending",
      controls_satisfied: "blocked",
      approved_for_deploy: "blocked",
    }),
    gate_reasons_json: JSON.stringify({
      intake_complete: [],
      risk_assessed: ["Risk assessment has not been run yet."],
      controls_satisfied: ["Accepted evidence and generated deliverables are required before controls can be satisfied."],
      approved_for_deploy: ["An approval request and role-based approval decisions are still required."],
    }),
    current_cycle_id: "cycle-1",
    cycle_index: 1,
    latest_risk_tier: null,
    latest_assessment_id: null,
    evidence_count: 0,
    feedback_action_count: 0,
    created_at: "2026-03-31T00:00:00Z",
    updated_at: "2026-03-31T00:00:00Z",
    ...overrides,
  };
}

function toAcceptedIntakeResult(record = buildIntakeRecord()): IntakeAcceptedResult {
  return {
    artifact_id: record.artifact_id,
    intake_state: "ingested",
    received_at: record.received_at,
    size_bytes: record.size_bytes,
    source_hash: record.source_hash,
    source_channel: record.source_channel,
    source_filename: record.source_filename,
    source_mime_type: record.source_mime_type,
    operator_or_service_identity: record.operator_or_service_identity,
    document_type_hint: record.document_type_hint ?? undefined,
    jurisdiction_context: record.jurisdiction_context ?? undefined,
    legal_basis: record.legal_basis ?? undefined,
    purpose_of_processing: record.purpose_of_processing ?? undefined,
    retention_profile: record.retention_profile ?? undefined,
    known_unknowns: [],
    storage: {
      r2_key: record.r2_key,
    },
  };
}

function validExtractionJob(overrides?: Partial<ExtractionJob>): ExtractionJob {
  return {
    intakeId: "artifact-123",
    r2Key: "govern-artifacts/artifacts/artifact-123/v1/source.pdf",
    mimeType: "application/pdf",
    sourceHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    sourceFilename: "invoice.pdf",
    operatorOrServiceIdentity: "case-operator",
    documentType: "invoice",
    fields: {
      invoice_number: { value: "INV-001", confidence: 0.97 },
      total_amount: { value: "1249.22", confidence: 0.93 },
      vendor_name: { value: "Acme Corp", confidence: 0.96 },
    },
    ...overrides,
  };
}

function mockR2Bucket(): R2Bucket {
  return {
    put: vi.fn(async () => undefined),
    get: vi.fn(),
    head: vi.fn(),
    delete: vi.fn(),
    list: vi.fn(),
    createMultipartUpload: vi.fn(),
    resumeMultipartUpload: vi.fn(),
  } as unknown as R2Bucket;
}

function createAuroraClosureHarness(options?: { intakeRecord?: IntakeRecord }) {
  const intakeRecord = options?.intakeRecord ?? buildIntakeRecord();
  const fileIntake = new Map([[intakeRecord.artifact_id, intakeRecord]]);
  const artifacts = new Map<string, AuroraArtifactRow>();
  const artifactVersions: AuroraArtifactVersionRow[] = [];
  const extractionLogs: Array<Record<string, unknown>> = [];
  const processingRuns: AuroraProcessingRunRow[] = [];
  const controlChecks: AuroraControlCheckRow[] = [];
  const reviewDecisions: AuroraReviewDecisionRow[] = [];
  const evidencePackages: AuroraEvidencePackageRow[] = [];
  const handoffHistory: AuroraHandoffHistoryRow[] = [];
  const handoffAuditLog: Array<Record<string, unknown>> = [];
  const auditEvents: AuroraAuditEventRow[] = [];

  const db = {
    prepare: vi.fn((sql: string) => {
      let boundArgs: unknown[] = [];
      const stmt = {
        bind: vi.fn((...args: unknown[]) => {
          boundArgs = args;
          return stmt;
        }),
        run: vi.fn(async () => {
          if (sql.includes("INTO artifacts")) {
            const artifactId = String(boundArgs[0]);
            if (!artifacts.has(artifactId)) {
              artifacts.set(artifactId, {
                artifact_id: artifactId,
                source_channel: String(boundArgs[1]),
                source_filename: String(boundArgs[2]),
                source_mime_type: String(boundArgs[3]),
                operator_or_service_identity: String(boundArgs[4]),
                document_type_hint: boundArgs[5] as string | null,
                jurisdiction_context: boundArgs[6] as string | null,
                legal_basis: boundArgs[7] as string | null,
                purpose_of_processing: boundArgs[8] as string | null,
                retention_profile: boundArgs[9] as string | null,
                known_unknowns_json: String(boundArgs[10]),
                source_hash: String(boundArgs[11]),
                current_state: "ingested",
                current_review_state: "pending",
                latest_version_no: 1,
                latest_version_id: String(boundArgs[12]),
                latest_run_id: null,
                latest_package_id: null,
                latest_handoff_id: null,
                created_at: String(boundArgs[13]),
                updated_at: String(boundArgs[14]),
              });
            }
          }

          if (sql.includes("INTO artifact_versions")) {
            const versionId = String(boundArgs[0]);
            if (!artifactVersions.some((row) => row.version_id === versionId)) {
              artifactVersions.push({
                version_id: versionId,
                artifact_id: String(boundArgs[1]),
                version_no: 1,
                source_object_key: String(boundArgs[2]),
                source_hash: String(boundArgs[3]),
                source_filename: String(boundArgs[4]),
                source_mime_type: String(boundArgs[5]),
                file_size_bytes: Number(boundArgs[6]),
                created_at: String(boundArgs[7]),
              });
            }
          }

          if (sql.includes("INSERT INTO extraction_log")) {
            extractionLogs.push({
              extraction_id: boundArgs[0],
              processing_run_id: boundArgs[1],
              artifact_id: boundArgs[2],
              parent_run_id: boundArgs[3],
              schema_version: boundArgs[4],
              source_hash: boundArgs[5],
              document_type: boundArgs[6],
              processing_timestamp: boundArgs[7],
              extraction_results_json: boundArgs[8],
              evidence_package_json: boundArgs[9],
              mandatory_fields_present: boundArgs[10],
              below_threshold_fields_json: boundArgs[11],
              quality_controls_json: boundArgs[12],
              audit_trail_json: boundArgs[13],
              evidence_items_json: boundArgs[14],
              controls_applied_json: boundArgs[15],
              review_decision_json: boundArgs[16],
              evidence_tier: boundArgs[17],
              package_hash: boundArgs[18],
              if_trace_receipt: boundArgs[19],
              created_at: boundArgs[20],
            });
          }

          if (sql.includes("INSERT INTO processing_runs")) {
            processingRuns.push({
              run_id: String(boundArgs[0]),
              artifact_id: String(boundArgs[1]),
              artifact_version_id: String(boundArgs[2]),
              parent_run_id: boundArgs[3] as string | null,
              stage: "extraction",
              iteration_index: Number(boundArgs[4]),
              triggered_by: "aurora-extraction-worker",
              source_hash: String(boundArgs[5]),
              document_type: String(boundArgs[6]),
              status: String(boundArgs[7]),
              started_at: String(boundArgs[8]),
              completed_at: String(boundArgs[9]),
            });
          }

          if (sql.includes("INSERT INTO control_checks")) {
            controlChecks.push({
              check_id: String(boundArgs[0]),
              run_id: String(boundArgs[1]),
              control_id: String(boundArgs[2]),
              status: String(boundArgs[3]) as "passed" | "failed",
              finding_code: boundArgs[4] as string | null,
              finding_detail_json: boundArgs[5] as string | null,
              triggered_human_review: Number(boundArgs[6]),
              created_at: String(boundArgs[7]),
            });
          }

          if (sql.includes("INSERT INTO review_decisions")) {
            reviewDecisions.push({
              decision_id: String(boundArgs[0]),
              artifact_id: String(boundArgs[1]),
              run_id: boundArgs[2] as string | null,
              parent_decision_id: null,
              review_round: Number(boundArgs[3]),
              actor_type: "system",
              actor_id: boundArgs[4] as string | null,
              decision_type: String(boundArgs[5]),
              rationale: boundArgs[6] as string | null,
              resulting_state: String(boundArgs[7]) as "pending" | "auto_approved" | "hitl_required",
              created_at: String(boundArgs[8]),
            });
          }

          if (sql.includes("UPDATE artifacts") && sql.includes("latest_run_id")) {
            const row = artifacts.get(String(boundArgs[5]));
            if (row) {
              row.document_type_hint = String(boundArgs[0]);
              row.current_state = String(boundArgs[1]);
              row.current_review_state = String(boundArgs[2]) as "pending" | "auto_approved" | "hitl_required";
              row.latest_run_id = String(boundArgs[3]);
              row.updated_at = String(boundArgs[4]);
            }
          }

          if (sql.includes("INSERT INTO evidence_packages")) {
            evidencePackages.push({
              package_id: String(boundArgs[0]),
              artifact_id: String(boundArgs[1]),
              run_id: String(boundArgs[2]),
              use_case_id: String(boundArgs[3]),
              session_ref: String(boundArgs[4]),
              schema_version: String(boundArgs[5]),
              package_hash: String(boundArgs[6]),
              lineage_ref: String(boundArgs[7]),
              target_system: String(boundArgs[8]),
              supersedes_package_id: boundArgs[9] as string | null,
              payload_json: String(boundArgs[10]),
              created_at: String(boundArgs[11]),
            });
          }

          if (sql.includes("UPDATE artifacts") && sql.includes("latest_package_id")) {
            const row = artifacts.get(String(boundArgs[2]));
            if (row) {
              row.current_state = "packaged";
              row.latest_package_id = String(boundArgs[0]);
              row.updated_at = String(boundArgs[1]);
            }
          }

          if (sql.includes("INSERT INTO handoff_audit_log")) {
            handoffAuditLog.push({
              event_id: boundArgs[0],
              artifact_id: boundArgs[1],
              extraction_id: boundArgs[2],
              payload_id: boundArgs[3],
              use_case_id: boundArgs[4],
              target_system: boundArgs[5],
              target_endpoint: boundArgs[6],
              event_type: boundArgs[7],
              http_status: boundArgs[8],
              error_code: boundArgs[9],
              response_body_json: boundArgs[10],
              created_at: boundArgs[11],
            });
          }

          if (sql.includes("INSERT INTO handoff_history")) {
            handoffHistory.push({
              event_id: String(boundArgs[0]),
              artifact_id: String(boundArgs[1]),
              run_id: String(boundArgs[2]),
              package_id: boundArgs[3] as string | null,
              use_case_id: String(boundArgs[4]),
              target_system: String(boundArgs[5]),
              target_endpoint: String(boundArgs[6]),
              event_type: String(boundArgs[7]) as AuroraHandoffHistoryRow["event_type"],
              http_status: boundArgs[8] as number | null,
              error_code: boundArgs[9] as string | null,
              response_body_json: boundArgs[10] as string | null,
              created_at: String(boundArgs[11]),
            });
          }

          if (sql.includes("UPDATE artifacts") && sql.includes("latest_handoff_id")) {
            const row = artifacts.get(String(boundArgs[3]));
            if (row) {
              row.current_state = String(boundArgs[0]);
              row.latest_handoff_id = String(boundArgs[1]);
              row.updated_at = String(boundArgs[2]);
            }
          }

          if (sql.includes("INSERT INTO audit_events")) {
            if (sql.includes("VALUES (?, 'artifact'")) {
              auditEvents.push({
                event_id: String(boundArgs[0]),
                aggregate_type: "artifact",
                aggregate_id: String(boundArgs[1]),
                event_type: String(boundArgs[2]),
                event_payload_json: String(boundArgs[3]),
                created_at: String(boundArgs[4]),
              });
            }
          }

          return { success: true, results: [], meta: {} };
        }),
        first: vi.fn(async () => {
          if (sql.includes("SELECT * FROM file_intake")) {
            return fileIntake.get(String(boundArgs[0])) ?? null;
          }
          if (sql.includes("SELECT * FROM extraction_log WHERE artifact_id")) {
            const matches = extractionLogs
              .filter((row) => row.artifact_id === boundArgs[0])
              .sort((left, right) => String(right.created_at).localeCompare(String(left.created_at)));
            return matches[0] ?? null;
          }
          if (sql.includes("SELECT * FROM artifacts WHERE artifact_id")) {
            return artifacts.get(String(boundArgs[0])) ?? null;
          }
          if (sql.includes("SELECT * FROM evidence_packages WHERE artifact_id = ? AND use_case_id = ?")) {
            const matches = evidencePackages
              .filter((row) => row.artifact_id === boundArgs[0] && row.use_case_id === boundArgs[1])
              .sort((left, right) => String(right.created_at).localeCompare(String(left.created_at)));
            return matches[0] ?? null;
          }
          return null;
        }),
        all: vi.fn(async () => {
          if (sql.includes("SELECT * FROM artifact_versions")) {
            return {
              results: artifactVersions
                .filter((row) => row.artifact_id === boundArgs[0])
                .sort((left, right) => left.version_no - right.version_no),
            };
          }
          if (sql.includes("SELECT * FROM processing_runs")) {
            return {
              results: processingRuns
                .filter((row) => row.artifact_id === boundArgs[0])
                .sort((left, right) => String(left.started_at).localeCompare(String(right.started_at))),
            };
          }
          if (sql.includes("SELECT * FROM control_checks")) {
            const runIds = new Set(boundArgs.map((value) => String(value)));
            return {
              results: controlChecks
                .filter((row) => runIds.has(row.run_id))
                .sort((left, right) => String(left.created_at).localeCompare(String(right.created_at))),
            };
          }
          if (sql.includes("SELECT * FROM review_decisions")) {
            return {
              results: reviewDecisions
                .filter((row) => row.artifact_id === boundArgs[0])
                .sort((left, right) => String(left.created_at).localeCompare(String(right.created_at))),
            };
          }
          if (sql.includes("SELECT * FROM evidence_packages WHERE artifact_id = ? ORDER BY created_at ASC")) {
            return {
              results: evidencePackages
                .filter((row) => row.artifact_id === boundArgs[0])
                .sort((left, right) => String(left.created_at).localeCompare(String(right.created_at))),
            };
          }
          if (sql.includes("SELECT * FROM handoff_history")) {
            return {
              results: handoffHistory
                .filter((row) => row.artifact_id === boundArgs[0])
                .sort((left, right) => String(left.created_at).localeCompare(String(right.created_at))),
            };
          }
          if (sql.includes("SELECT * FROM audit_events")) {
            return {
              results: auditEvents
                .filter((row) => row.aggregate_id === boundArgs[0])
                .sort((left, right) => String(left.created_at).localeCompare(String(right.created_at))),
            };
          }
          return { results: [] };
        }),
        raw: vi.fn(),
      };
      return stmt;
    }),
    batch: vi.fn(),
    exec: vi.fn(),
    dump: vi.fn(),
  } as unknown as D1Database;

  return {
    db,
    tables: {
      artifacts,
      artifactVersions,
      extractionLogs,
      processingRuns,
      controlChecks,
      reviewDecisions,
      evidencePackages,
      handoffHistory,
      handoffAuditLog,
      auditEvents,
    },
  };
}

function createD1Harness(options?: { intakeRecord?: IntakeRecord; seedUseCases?: UseCaseRow[] }) {
  const intakeRecord = options?.intakeRecord ?? buildIntakeRecord();
  const fileIntake = new Map([[intakeRecord.artifact_id, intakeRecord]]);
  const extractionLogs: Array<Record<string, unknown>> = [];
  const handoffAuditLog: Array<Record<string, unknown>> = [];
  const useCases: UseCaseRow[] = [...(options?.seedUseCases ?? [])];
  const governanceCycles: Array<Record<string, unknown>> = [];
  const evidencePackages: Array<Record<string, unknown>> = [];
  const useCaseEvidenceLinks: Array<Record<string, unknown>> = [];
  const auditEvents: Array<Record<string, unknown>> = [];
  const useCaseAssessments: Array<Record<string, unknown>> = [];
  const assessmentControls: Array<Record<string, unknown>> = [];
  const feedbackActions: Array<Record<string, unknown>> = [];
  const deliverables: Array<Record<string, unknown>> = [];
  const approvalRequests: Array<Record<string, unknown>> = [];
  const approvalDecisions: Array<Record<string, unknown>> = [];
  const writes: Array<{ sql: string; args: unknown[] }> = [];

  const db = {
    prepare: vi.fn((sql: string) => {
      let boundArgs: unknown[] = [];
      const stmt = {
        bind: vi.fn((...args: unknown[]) => {
          boundArgs = args;
          return stmt;
        }),
        run: vi.fn(async () => {
          writes.push({ sql, args: boundArgs });

          if (sql.includes("INSERT INTO extraction_log")) {
            extractionLogs.push({
              extraction_id: boundArgs[0],
              processing_run_id: boundArgs[1],
              artifact_id: boundArgs[2],
              parent_run_id: boundArgs[3],
              schema_version: boundArgs[4],
              source_hash: boundArgs[5],
              document_type: boundArgs[6],
              processing_timestamp: boundArgs[7],
              extraction_results_json: boundArgs[8],
              evidence_package_json: boundArgs[9],
              mandatory_fields_present: boundArgs[10],
              below_threshold_fields_json: boundArgs[11],
              quality_controls_json: boundArgs[12],
              audit_trail_json: boundArgs[13],
              evidence_items_json: boundArgs[14],
              controls_applied_json: boundArgs[15],
              review_decision_json: boundArgs[16],
              evidence_tier: boundArgs[17],
              package_hash: boundArgs[18],
              if_trace_receipt: boundArgs[19],
              created_at: boundArgs[20],
            });
          }

          if (sql.includes("INSERT INTO handoff_audit_log")) {
            handoffAuditLog.push({
              event_id: boundArgs[0],
              artifact_id: boundArgs[1],
              extraction_id: boundArgs[2],
              payload_id: boundArgs[3],
              use_case_id: boundArgs[4],
              target_system: boundArgs[5],
              target_endpoint: boundArgs[6],
              event_type: boundArgs[7],
              http_status: boundArgs[8],
              error_code: boundArgs[9],
              response_body_json: boundArgs[10],
              created_at: boundArgs[11],
            });
          }

          if (sql.includes("INSERT INTO use_cases")) {
            useCases.push({
              use_case_id: String(boundArgs[0]),
              client_id: boundArgs[1] as string | null,
              ai_system_id: boundArgs[2] as string | null,
              name: String(boundArgs[3]),
              purpose: String(boundArgs[4]),
              business_owner: String(boundArgs[5]),
              business_owner_confirmed: Number(boundArgs[6]),
              systems_involved_json: String(boundArgs[7]),
              data_categories_json: String(boundArgs[8]),
              automation_level: String(boundArgs[9]),
              decision_impact: boundArgs[10] as string | null,
              regulated_domain: Number(boundArgs[11]),
              regulated_domain_notes: boundArgs[12] as string | null,
              scale: String(boundArgs[13]),
              known_unknowns_json: String(boundArgs[14]),
              status: String(boundArgs[15]),
              current_gate: String(boundArgs[16]),
              gates_json: String(boundArgs[17]),
              gate_reasons_json: String(boundArgs[18]),
              current_cycle_id: boundArgs[19] as string | null,
              cycle_index: Number(boundArgs[20]),
              latest_risk_tier: boundArgs[21] as string | null,
              latest_assessment_id: boundArgs[22] as string | null,
              evidence_count: Number(boundArgs[23]),
              feedback_action_count: Number(boundArgs[24]),
              created_at: String(boundArgs[25]),
              updated_at: String(boundArgs[26]),
            });
          }

          if (sql.includes("INSERT INTO governance_cycles")) {
            governanceCycles.push({
              cycle_id: boundArgs[0],
              use_case_id: boundArgs[1],
              parent_cycle_id: boundArgs[2],
              cycle_index: boundArgs[3],
              open_reason: boundArgs[4],
              status: boundArgs[5],
              opened_at: boundArgs[6],
              closed_at: boundArgs[7],
            });
          }

          if (sql.includes("INSERT INTO evidence_packages")) {
            evidencePackages.push({
              payload_id: boundArgs[0],
              use_case_id: boundArgs[1],
              schema_version: boundArgs[2],
              package_hash: boundArgs[3],
              source_system: boundArgs[4],
              target_system: boundArgs[5],
              session_ref: boundArgs[6],
              processing_run_id: boundArgs[7],
              lineage_ref: boundArgs[8],
              artifact_id: boundArgs[9],
              r2_key: boundArgs[10],
              source_mime_type: boundArgs[11],
              size_bytes: boundArgs[12],
              received_at: boundArgs[13],
              source_filename: boundArgs[14],
              source_hash: boundArgs[15],
              document_type: boundArgs[16],
              evidence_tier: boundArgs[17],
              admissible: boundArgs[18],
              review_status: boundArgs[19],
              review_reason: boundArgs[20],
              acceptance_state: boundArgs[21],
              rejection_reason: boundArgs[22],
              payload_json: boundArgs[23],
              created_at: boundArgs[24],
              accepted_at: boundArgs[25],
            });
          }

          if (sql.includes("INSERT INTO use_case_evidence_links")) {
            useCaseEvidenceLinks.push({
              link_id: boundArgs[0],
              use_case_id: boundArgs[1],
              evidence_package_id: boundArgs[2],
              relation_type: boundArgs[3],
              linked_at: boundArgs[4],
            });
          }

          if (sql.includes("INSERT INTO audit_events")) {
            auditEvents.push({
              event_id: boundArgs[0],
              aggregate_type: boundArgs[1],
              aggregate_id: boundArgs[2],
              event_type: boundArgs[3],
              event_payload_json: boundArgs[4],
              created_at: boundArgs[5],
            });
          }

          if (sql.includes("INSERT INTO use_case_assessments")) {
            useCaseAssessments.push({
              assessment_id: boundArgs[0],
              use_case_id: boundArgs[1],
              cycle_id: boundArgs[2],
              parent_assessment_id: boundArgs[3],
              trigger_type: boundArgs[4],
              risk_tier: boundArgs[5],
              dimension_scores_json: boundArgs[6],
              dimension_rationale_json: boundArgs[7],
              uncertainty_fields_json: boundArgs[8],
              evidence_count: boundArgs[9],
              gate_status_json: boundArgs[10],
              gate_reasons_json: boundArgs[11],
              created_at: boundArgs[12],
            });
          }

          if (sql.includes("INSERT INTO assessment_controls")) {
            assessmentControls.push({
              row_id: boundArgs[0],
              assessment_id: boundArgs[1],
              control_type: boundArgs[2],
              control_ref: boundArgs[3],
              created_at: boundArgs[4],
            });
          }

          if (sql.includes("INSERT INTO feedback_actions")) {
            feedbackActions.push({
              action_id: boundArgs[0],
              use_case_id: boundArgs[1],
              cycle_id: boundArgs[2],
              source_assessment_id: boundArgs[3],
              action_type: boundArgs[4],
              requested_state: boundArgs[5],
              rationale: boundArgs[6],
              status: boundArgs[7],
              created_at: boundArgs[8],
            });
          }

          if (sql.includes("INSERT INTO deliverables")) {
            deliverables.push({
              deliverable_id: boundArgs[0],
              use_case_id: boundArgs[1],
              assessment_id: boundArgs[2],
              cycle_id: boundArgs[3],
              deliverable_type: boundArgs[4],
              template_id: boundArgs[5],
              policy_version: boundArgs[6],
              status: boundArgs[7],
              content_hash: boundArgs[8],
              content_json: boundArgs[9],
              evidence_citations_json: boundArgs[10],
              manual_notes_json: boundArgs[11],
              generated_from_json: boundArgs[12],
              created_at: boundArgs[13],
              updated_at: boundArgs[14],
              approved_at: boundArgs[15],
            });
          }

          if (sql.includes("INSERT INTO approval_requests")) {
            approvalRequests.push({
              request_id: boundArgs[0],
              use_case_id: boundArgs[1],
              assessment_id: boundArgs[2],
              cycle_id: boundArgs[3],
              policy_version: boundArgs[4],
              approval_record_deliverable_id: boundArgs[5],
              requested_state: boundArgs[6],
              requested_by: boundArgs[7],
              requested_by_role: boundArgs[8],
              status: boundArgs[9],
              required_roles_json: boundArgs[10],
              approvals_received_json: boundArgs[11],
              unmet_conditions_json: boundArgs[12],
              latest_decision_summary: boundArgs[13],
              created_at: boundArgs[14],
              updated_at: boundArgs[15],
              resolved_at: boundArgs[16],
            });
          }

          if (sql.includes("INSERT INTO approval_decisions")) {
            approvalDecisions.push({
              decision_id: boundArgs[0],
              request_id: boundArgs[1],
              use_case_id: boundArgs[2],
              assessment_id: boundArgs[3],
              actor_role: boundArgs[4],
              actor_id: boundArgs[5],
              decision: boundArgs[6],
              notes: boundArgs[7],
              override_reason: boundArgs[8],
              created_at: boundArgs[9],
            });
          }

          if (sql.includes("UPDATE use_cases") && sql.includes("evidence_count")) {
            const row = useCases.find((item) => item.use_case_id === boundArgs[3]);
            if (row) {
              row.evidence_count = Number(boundArgs[0]);
              row.feedback_action_count = Number(boundArgs[1]);
              row.updated_at = String(boundArgs[2]);
            }
          }

          if (sql.includes("UPDATE use_cases") && sql.includes("latest_risk_tier")) {
            const row = useCases.find((item) => item.use_case_id === boundArgs[9]);
            if (row) {
              row.latest_risk_tier = String(boundArgs[0]);
              row.latest_assessment_id = String(boundArgs[1]);
              row.current_cycle_id = String(boundArgs[2]);
              row.cycle_index = Number(boundArgs[3]);
              row.current_gate = String(boundArgs[4]);
              row.status = String(boundArgs[5]);
              row.gates_json = String(boundArgs[6]);
              row.gate_reasons_json = String(boundArgs[7]);
              row.updated_at = String(boundArgs[8]);
            }
          }

          if (sql.includes("UPDATE deliverables")) {
            const row = deliverables.find((item) => item.deliverable_id === boundArgs[8]);
            if (row) {
              row.status = boundArgs[0];
              row.content_hash = boundArgs[1];
              row.content_json = boundArgs[2];
              row.evidence_citations_json = boundArgs[3];
              row.manual_notes_json = boundArgs[4];
              row.generated_from_json = boundArgs[5];
              row.updated_at = boundArgs[6];
              row.approved_at = boundArgs[7];
            }
          }

          if (sql.includes("UPDATE approval_requests")) {
            const row = approvalRequests.find((item) => item.request_id === boundArgs[6]);
            if (row) {
              row.status = boundArgs[0];
              row.approvals_received_json = boundArgs[1];
              row.unmet_conditions_json = boundArgs[2];
              row.latest_decision_summary = boundArgs[3];
              row.updated_at = boundArgs[4];
              row.resolved_at = boundArgs[5];
            }
          }

          if (sql.includes("UPDATE governance_cycles")) {
            const row = governanceCycles.find((item) => item.cycle_id === boundArgs[2]);
            if (row) {
              row.status = boundArgs[0];
              row.closed_at = boundArgs[1];
            }
          }

          return { success: true, results: [], meta: {} };
        }),
        first: vi.fn(async () => {
          if (sql.includes("SELECT * FROM file_intake")) {
            return fileIntake.get(String(boundArgs[0])) ?? null;
          }
          if (sql.includes("SELECT * FROM extraction_log WHERE artifact_id")) {
            const matches = extractionLogs
              .filter((row) => row.artifact_id === boundArgs[0])
              .sort((left, right) => String(right.created_at).localeCompare(String(left.created_at)));
            return matches[0] ?? null;
          }
          if (sql.includes("SELECT * FROM evidence_packages WHERE payload_id")) {
            return evidencePackages.find((row) => row.payload_id === boundArgs[0]) ?? null;
          }
          if (sql.includes("SELECT * FROM use_cases WHERE use_case_id")) {
            return useCases.find((row) => row.use_case_id === boundArgs[0]) ?? null;
          }
          if (sql.includes("SELECT * FROM deliverables WHERE deliverable_id")) {
            return deliverables.find((row) => row.deliverable_id === boundArgs[0]) ?? null;
          }
          if (sql.includes("SELECT * FROM approval_requests WHERE request_id")) {
            return approvalRequests.find((row) => row.request_id === boundArgs[0]) ?? null;
          }
          if (sql.includes("SELECT * FROM approval_requests")) {
            const matches = approvalRequests
              .filter((row) => row.use_case_id === boundArgs[0])
              .sort((left, right) => String(right.updated_at).localeCompare(String(left.updated_at)));
            return matches[0] ?? null;
          }
          if (sql.includes("SELECT * FROM use_case_assessments")) {
            if (sql.includes("WHERE assessment_id = ?")) {
              return useCaseAssessments.find((row) => row.assessment_id === boundArgs[0]) ?? null;
            }
            const matches = useCaseAssessments
              .filter((row) => row.use_case_id === boundArgs[0])
              .sort((left, right) => String(right.created_at).localeCompare(String(left.created_at)));
            return matches[0] ?? null;
          }
          return null;
        }),
        all: vi.fn(async () => {
          if (sql.includes("FROM use_case_evidence_links") && sql.includes("INNER JOIN evidence_packages")) {
            const results = useCaseEvidenceLinks
              .filter((row) => row.use_case_id === boundArgs[0])
              .sort((left, right) => String(right.linked_at).localeCompare(String(left.linked_at)))
              .map((link) => evidencePackages.find((row) => row.payload_id === link.evidence_package_id))
              .filter((row): row is Record<string, unknown> => Boolean(row));
            return { results };
          }
          if (sql.includes("SELECT * FROM use_case_evidence_links")) {
            const results = useCaseEvidenceLinks
              .filter((row) => row.use_case_id === boundArgs[0])
              .sort((left, right) => String(left.linked_at).localeCompare(String(right.linked_at)));
            return { results };
          }
          if (sql.includes("SELECT * FROM use_cases")) {
            let results = [...useCases];
            if (sql.includes("client_id = ?")) {
              results = results.filter((row) => row.client_id === boundArgs[0]);
            }
            if (sql.includes("status = ?")) {
              const statusIndex = sql.includes("client_id = ?") ? 1 : 0;
              results = results.filter((row) => row.status === boundArgs[statusIndex]);
            }
            results.sort((left, right) => String(right.updated_at).localeCompare(String(left.updated_at)));
            return { results };
          }
          if (sql.includes("SELECT * FROM audit_events")) {
            const results = auditEvents
              .filter((row) => row.aggregate_id === boundArgs[0])
              .sort((left, right) => String(right.created_at).localeCompare(String(left.created_at)));
            return { results };
          }
          if (sql.includes("SELECT * FROM assessment_controls")) {
            const results = assessmentControls
              .filter((row) => row.assessment_id === boundArgs[0])
              .sort((left, right) => String(left.created_at).localeCompare(String(right.created_at)));
            return { results };
          }
          if (sql.includes("SELECT * FROM governance_cycles")) {
            const results = governanceCycles
              .filter((row) => row.use_case_id === boundArgs[0])
              .sort((left, right) => String(left.opened_at).localeCompare(String(right.opened_at)));
            return { results };
          }
          if (sql.includes("SELECT * FROM use_case_assessments")) {
            const results = useCaseAssessments
              .filter((row) => row.use_case_id === boundArgs[0])
              .sort((left, right) => String(left.created_at).localeCompare(String(right.created_at)));
            return { results };
          }
          if (sql.includes("SELECT * FROM feedback_actions")) {
            const results = feedbackActions
              .filter((row) => row.use_case_id === boundArgs[0])
              .sort((left, right) => String(left.created_at).localeCompare(String(right.created_at)));
            return { results };
          }
          if (sql.includes("SELECT * FROM deliverables")) {
            const results = deliverables
              .filter((row) => row.use_case_id === boundArgs[0])
              .sort((left, right) => String(right.created_at).localeCompare(String(left.created_at)));
            return { results };
          }
          if (sql.includes("SELECT * FROM approval_requests")) {
            const results = approvalRequests
              .filter((row) => row.use_case_id === boundArgs[0])
              .sort((left, right) => String(right.created_at).localeCompare(String(left.created_at)));
            return { results };
          }
          if (sql.includes("SELECT * FROM approval_decisions")) {
            const results = approvalDecisions
              .filter((row) => row.request_id === boundArgs[0])
              .sort((left, right) => String(left.created_at).localeCompare(String(right.created_at)));
            return { results };
          }
          return { results: [] };
        }),
        raw: vi.fn(),
      };
      return stmt;
    }),
    batch: vi.fn(),
    exec: vi.fn(),
    dump: vi.fn(),
  } as unknown as D1Database;

  return {
    db,
    writes,
    tables: {
      extractionLogs,
      handoffAuditLog,
      useCases,
      governanceCycles,
      evidencePackages,
      useCaseEvidenceLinks,
      auditEvents,
      useCaseAssessments,
      assessmentControls,
      feedbackActions,
      deliverables,
      approvalRequests,
      approvalDecisions,
    },
  };
}

describe("T13 — handoff payload emission", () => {
  it("builds a deterministic handoff payload from intake and extraction outputs", async () => {
    const extraction = await runExtraction(validExtractionJob());
    const payload = await emitHandoff(toAcceptedIntakeResult(), extraction, {
      useCaseId: "usecase-7",
      sessionRef: "session-abc",
    });

    expect(payload.payloadId).toHaveLength(64);
    expect(payload.packageHash).toBe(extraction.packageHash);
    expect(payload.useCaseId).toBe("usecase-7");
    expect(payload.reviewStatus).toBe("auto_approved");
    expect(payload.fileRef.artifactId).toBe("artifact-123");
    expect(payload.extractionControlsApplied).toContain("EC-06");
  });
});

describe("T14 — COMPASSai receiver boundaries", () => {
  it("rejects evidence for unknown use cases", async () => {
    const { db } = createD1Harness();
    const extraction = await runExtraction(validExtractionJob());
    const payload = await emitHandoff(toAcceptedIntakeResult(), extraction, {
      useCaseId: "missing-usecase",
    });

    await expect(receiveHandoff(payload, { COMPASS_DB: db })).rejects.toMatchObject({
      code: "USE_CASE_NOT_FOUND",
    } satisfies Partial<CompassHandoffError>);
  });

  it("accepts admissible payloads and makes duplicate delivery idempotent", async () => {
    const { db, tables } = createD1Harness({ seedUseCases: [buildUseCaseRow("usecase-7")] });
    const extraction = await runExtraction(validExtractionJob());
    const payload = await emitHandoff(toAcceptedIntakeResult(), extraction, {
      useCaseId: "usecase-7",
      sessionRef: "session-abc",
    });

    const first = await receiveHandoff(payload, { COMPASS_DB: db });
    const second = await receiveHandoff(payload, { COMPASS_DB: db });

    expect(first.acceptanceState).toBe("accepted_for_governance");
    expect(second.idempotent).toBe(true);
    expect(tables.evidencePackages).toHaveLength(1);
    expect(tables.useCaseEvidenceLinks).toHaveLength(1);
    expect(tables.auditEvents).toHaveLength(1);
    expect(tables.useCases[0]?.evidence_count).toBe(1);
  });

  it("preserves rejection reasons when the AurorA package is not admissible", async () => {
    const { db, tables } = createD1Harness({ seedUseCases: [buildUseCaseRow("usecase-9")] });
    const extraction = await runExtraction(
      validExtractionJob({
        fields: {
          invoice_number: { value: "INV-001", confidence: 0.97 },
          total_amount: { value: "15000", confidence: 0.6 },
          vendor_name: { value: "Acme Corp", confidence: 0.96 },
        },
        hitlRequiredWhen: ["total_amount > 10000"],
      }),
    );
    const payload = await emitHandoff(toAcceptedIntakeResult(), extraction, {
      useCaseId: "usecase-9",
    });

    const result = await receiveHandoff(payload, { COMPASS_DB: db });

    expect(result.acceptanceState).toBe("rejected_for_governance");
    expect(result.rejectionReason).toContain("Configured HITL rule matched");
    expect(tables.evidencePackages).toHaveLength(1);
    expect(tables.auditEvents[0]?.event_type).toBe("rejected_for_governance");
    expect(tables.useCases[0]?.evidence_count).toBe(0);
  });
});

describe("T15–T17 — Worker governance flow", () => {
  let auroraWorker: { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> };
  let compassWorker: { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> };
  const originalFetch = globalThis.fetch;

  beforeAll(async () => {
    auroraWorker = (await import("../../../index")).default;
    compassWorker = (await import("../../../../../compassai/src/index")).default;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("creates a use case, hands evidence to COMPASSai, and lists accepted evidence", async () => {
    const auroraHarness = createD1Harness();
    const compassHarness = createD1Harness();
    const auroraEnv = {
      AURORA_FILES: mockR2Bucket(),
      AURORA_DB: auroraHarness.db,
      COMPASSAI_BASE_URL: "http://compass.test",
    };
    const compassEnv = { COMPASS_DB: compassHarness.db };

    const createUseCaseResponse = await compassWorker.fetch(
      new Request("http://compass.test/api/v1/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Claims Review Assistant",
          purpose: "Support structured claim review",
          business_owner: "governance-owner",
          business_owner_confirmed: true,
          systems_involved: ["claims_portal"],
          data_categories: ["personal", "medical"],
          automation_level: "human-in-the-loop",
          regulated_domain: true,
          regulated_domain_notes: "healthcare review",
          scale: "department",
          known_unknowns: ["retention schedule under review"],
        }),
      }),
      compassEnv,
      {},
    );
    expect(createUseCaseResponse.status).toBe(201);
    const createdUseCase = await createUseCaseResponse.json() as { useCase: { id: string } };

    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      return compassWorker.fetch(request, compassEnv, {});
    }) as typeof fetch;

    const extractResponse = await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: "invoice",
          fields: {
            invoice_number: { value: "INV-001", confidence: 0.97 },
            total_amount: { value: "1249.22", confidence: 0.93 },
            vendor_name: { value: "Acme Corp", confidence: 0.96 },
          },
        }),
      }),
      auroraEnv,
      {},
    );
    expect(extractResponse.status).toBe(200);

    const handoffResponse = await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/handoff-to-compassai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_case_id: createdUseCase.useCase.id }),
      }),
      auroraEnv,
      {},
    );
    expect(handoffResponse.status).toBe(200);

    const evidenceListResponse = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/evidence/use-case/${createdUseCase.useCase.id}`, { method: "GET" }),
      compassEnv,
      {},
    );
    expect(evidenceListResponse.status).toBe(200);
    const evidenceList = await evidenceListResponse.json() as {
      evidence: Array<{ useCaseId: string; acceptanceState: string }>;
    };
    expect(evidenceList.evidence).toHaveLength(1);
    expect(evidenceList.evidence[0]?.useCaseId).toBe(createdUseCase.useCase.id);
    expect(evidenceList.evidence[0]?.acceptanceState).toBe("accepted_for_governance");
    expect(auroraHarness.tables.handoffAuditLog).toHaveLength(2);
  });

  it("assesses a high-risk use case and exposes an append-only audit trail", async () => {
    const auroraHarness = createD1Harness();
    const compassHarness = createD1Harness();
    const auroraEnv = {
      AURORA_FILES: mockR2Bucket(),
      AURORA_DB: auroraHarness.db,
      COMPASSAI_BASE_URL: "http://compass.test",
    };
    const compassEnv = { COMPASS_DB: compassHarness.db };

    const createUseCaseResponse = await compassWorker.fetch(
      new Request("http://compass.test/api/v1/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Public Medical Triage",
          purpose: "Support public triage decisions",
          business_owner: "clinical-owner",
          business_owner_confirmed: true,
          systems_involved: ["triage_portal", "ehr"],
          data_categories: ["medical", "biometric"],
          automation_level: "fully automated",
          decision_impact: "consequential",
          regulated_domain: true,
          regulated_domain_notes: "medical device high-risk",
          scale: "public",
          known_unknowns: ["monitoring thresholds under review"],
        }),
      }),
      compassEnv,
      {},
    );
    const createdUseCase = await createUseCaseResponse.json() as { useCase: { id: string } };

    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      return compassWorker.fetch(request, compassEnv, {});
    }) as typeof fetch;

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: "invoice",
          fields: {
            invoice_number: { value: "INV-001", confidence: 0.97 },
            total_amount: { value: "1249.22", confidence: 0.93 },
            vendor_name: { value: "Acme Corp", confidence: 0.96 },
          },
        }),
      }),
      auroraEnv,
      {},
    );

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/handoff-to-compassai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_case_id: createdUseCase.useCase.id }),
      }),
      auroraEnv,
      {},
    );

    const assessResponse = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/assess`, {
        method: "POST",
      }),
      compassEnv,
      {},
    );
    expect(assessResponse.status).toBe(200);
    const assessment = await assessResponse.json() as {
      assessment: { riskTier: string; requiredControls: string[]; requiredDeliverables: string[] };
      governanceStatus: string;
    };
    expect(assessment.assessment.riskTier).toBe("T3");
    expect(assessment.assessment.requiredControls).toContain("red_team_assessment");
    expect(assessment.assessment.requiredDeliverables).toContain("independent_review_report");
    expect(assessment.governanceStatus).toBe("blocked_not_ready");

    const auditResponse = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/audit-trail`, {
        method: "GET",
      }),
      compassEnv,
      {},
    );
    expect(auditResponse.status).toBe(200);
    const auditTrail = await auditResponse.json() as { auditTrail: Array<{ eventType: string }> };
    expect(auditTrail.auditTrail.map((entry) => entry.eventType)).toEqual(
      expect.arrayContaining(["intake_complete", "accepted_for_governance", "risk_assessed"]),
    );
  });

  it("records reopen pressure when new accepted evidence arrives after an assessment", async () => {
    const auroraHarness = createD1Harness();
    const compassHarness = createD1Harness();
    const auroraEnv = {
      AURORA_FILES: mockR2Bucket(),
      AURORA_DB: auroraHarness.db,
      COMPASSAI_BASE_URL: "http://compass.test",
    };
    const compassEnv = { COMPASS_DB: compassHarness.db };

    const createUseCaseResponse = await compassWorker.fetch(
      new Request("http://compass.test/api/v1/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Claims Review Assistant",
          purpose: "Support structured claim review",
          business_owner: "governance-owner",
          business_owner_confirmed: true,
          systems_involved: ["claims_portal"],
          data_categories: ["personal"],
          automation_level: "human-in-the-loop",
          regulated_domain: false,
          scale: "department",
          known_unknowns: ["retention schedule under review"],
        }),
      }),
      compassEnv,
      {},
    );
    const createdUseCase = await createUseCaseResponse.json() as { useCase: { id: string } };

    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      return compassWorker.fetch(request, compassEnv, {});
    }) as typeof fetch;

    const handoffOnce = async () => {
      await auroraWorker.fetch(
        new Request("http://aurora.test/api/documents/artifact-123/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            document_type: "invoice",
            fields: {
              invoice_number: { value: `INV-${crypto.randomUUID().slice(0, 6)}`, confidence: 0.97 },
              total_amount: { value: "1249.22", confidence: 0.93 },
              vendor_name: { value: "Acme Corp", confidence: 0.96 },
            },
          }),
        }),
        auroraEnv,
        {},
      );

      await auroraWorker.fetch(
        new Request("http://aurora.test/api/documents/artifact-123/handoff-to-compassai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ use_case_id: createdUseCase.useCase.id }),
        }),
        auroraEnv,
        {},
      );
    };

    await handoffOnce();
    await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/assess`, { method: "POST" }),
      compassEnv,
      {},
    );
    await handoffOnce();

    const listUseCasesResponse = await compassWorker.fetch(
      new Request("http://compass.test/api/v1/use-cases", { method: "GET" }),
      compassEnv,
      {},
    );
    const useCases = await listUseCasesResponse.json() as {
      useCases: Array<{ id: string; feedbackActionCount: number; evidenceCount: number }>;
    };
    const updated = useCases.useCases.find((row) => row.id === createdUseCase.useCase.id);

    expect(updated?.feedbackActionCount).toBe(1);
    expect(updated?.evidenceCount).toBe(2);
    expect(compassHarness.tables.feedbackActions).toHaveLength(1);
    expect(compassHarness.tables.feedbackActions[0]?.requested_state).toBe("risk_reassessment_required");
  });
});

describe("T18–T19 — Worker deliverables and approval flow", () => {
  let auroraWorker: { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> };
  let compassWorker: { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> };
  const originalFetch = globalThis.fetch;

  beforeAll(async () => {
    auroraWorker = (await import("../../../index")).default;
    compassWorker = (await import("../../../../../compassai/src/index")).default;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("generates traceable governance deliverables from the latest assessment", async () => {
    const auroraHarness = createD1Harness();
    const compassHarness = createD1Harness();
    const auroraEnv = {
      AURORA_FILES: mockR2Bucket(),
      AURORA_DB: auroraHarness.db,
      COMPASSAI_BASE_URL: "http://compass.test",
    };
    const compassEnv = { COMPASS_DB: compassHarness.db };

    const createUseCaseResponse = await compassWorker.fetch(
      new Request("http://compass.test/api/v1/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Claims Review Assistant",
          purpose: "Support structured claim review",
          business_owner: "governance-owner",
          business_owner_confirmed: true,
          systems_involved: ["claims_portal"],
          data_categories: ["personal"],
          automation_level: "human-in-the-loop",
          decision_impact: "assistive",
          regulated_domain: false,
          scale: "department",
          known_unknowns: ["retention schedule under review"],
        }),
      }),
      compassEnv,
      {},
    );
    const createdUseCase = await createUseCaseResponse.json() as { useCase: { id: string } };

    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      return compassWorker.fetch(request, compassEnv, {});
    }) as typeof fetch;

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: "invoice",
          fields: {
            invoice_number: { value: "INV-001", confidence: 0.97 },
            total_amount: { value: "1249.22", confidence: 0.93 },
            vendor_name: { value: "Acme Corp", confidence: 0.96 },
          },
        }),
      }),
      auroraEnv,
      {},
    );

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/handoff-to-compassai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_case_id: createdUseCase.useCase.id }),
      }),
      auroraEnv,
      {},
    );

    await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/assess`, { method: "POST" }),
      compassEnv,
      {},
    );

    const generateResponse = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/deliverables/generate`, {
        method: "POST",
      }),
      compassEnv,
      {},
    );
    expect(generateResponse.status).toBe(200);
    const generated = await generateResponse.json() as {
      deliverables: Array<{
        deliverableType: string;
        evidenceCitations: Array<{ payloadId: string }>;
      }>;
      gateStatus: Record<string, string>;
      gateReasons: Record<string, string[]>;
    };
    expect(generated.deliverables.map((item) => item.deliverableType)).toEqual(
      expect.arrayContaining(["approval_record", "model_card", "monitoring_plan"]),
    );
    expect(generated.deliverables[0]?.evidenceCitations.length).toBeGreaterThan(0);
    expect(generated.gateStatus.controls_satisfied).toBe("complete");
    expect(generated.gateStatus.approved_for_deploy).toBe("blocked");
    expect(generated.gateReasons.approved_for_deploy[0]).toContain("No approval request");

    const listResponse = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/deliverables`, {
        method: "GET",
      }),
      compassEnv,
      {},
    );
    expect(listResponse.status).toBe(200);
    const listed = await listResponse.json() as {
      deliverables: Array<{ deliverableType: string }>;
    };
    expect(listed.deliverables.length).toBe(generated.deliverables.length);
    expect(compassHarness.tables.deliverables.length).toBeGreaterThan(0);
  });

  it("submits an approval request and preserves override visibility in the audit trail", async () => {
    const auroraHarness = createD1Harness();
    const compassHarness = createD1Harness();
    const auroraEnv = {
      AURORA_FILES: mockR2Bucket(),
      AURORA_DB: auroraHarness.db,
      COMPASSAI_BASE_URL: "http://compass.test",
    };
    const compassEnv = { COMPASS_DB: compassHarness.db };

    const createUseCaseResponse = await compassWorker.fetch(
      new Request("http://compass.test/api/v1/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Public Medical Triage",
          purpose: "Support public triage decisions",
          business_owner: "clinical-owner",
          business_owner_confirmed: true,
          systems_involved: ["triage_portal", "ehr"],
          data_categories: ["medical", "biometric"],
          automation_level: "fully automated",
          decision_impact: "consequential",
          regulated_domain: true,
          regulated_domain_notes: "medical device high-risk",
          scale: "public",
          known_unknowns: ["monitoring thresholds under review"],
        }),
      }),
      compassEnv,
      {},
    );
    const createdUseCase = await createUseCaseResponse.json() as { useCase: { id: string } };

    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      return compassWorker.fetch(request, compassEnv, {});
    }) as typeof fetch;

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: "invoice",
          fields: {
            invoice_number: { value: "INV-001", confidence: 0.97 },
            total_amount: { value: "1249.22", confidence: 0.93 },
            vendor_name: { value: "Acme Corp", confidence: 0.96 },
          },
        }),
      }),
      auroraEnv,
      {},
    );

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/handoff-to-compassai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_case_id: createdUseCase.useCase.id }),
      }),
      auroraEnv,
      {},
    );

    await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/assess`, { method: "POST" }),
      compassEnv,
      {},
    );

    await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/deliverables/generate`, {
        method: "POST",
      }),
      compassEnv,
      {},
    );

    const deliverablesResponse = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/deliverables`, {
        method: "GET",
      }),
      compassEnv,
      {},
    );
    const deliverables = await deliverablesResponse.json() as {
      deliverables: Array<{ deliverableId: string; deliverableType: string }>;
    };
    for (const deliverableType of ["dpia", "independent_review_report", "red_team_findings"]) {
      const target = deliverables.deliverables.find((item) => item.deliverableType === deliverableType);
      expect(target?.deliverableId).toBeTruthy();
      const noteResponse = await compassWorker.fetch(
        new Request(`http://compass.test/api/v1/deliverables/${target?.deliverableId}/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            note: `${deliverableType} completed by operator review.`,
            added_by: "review-operator",
            marks_complete: true,
          }),
        }),
        compassEnv,
        {},
      );
      expect(noteResponse.status).toBe(200);
    }

    const submitApprovalResponse = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/approval-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requested_by: "govern-admin-1",
          requested_by_role: "governance_admin",
        }),
      }),
      compassEnv,
      {},
    );
    expect(submitApprovalResponse.status).toBe(201);
    const approvalRequest = await submitApprovalResponse.json() as {
      approvalRequest: { requestId: string; status: string; requiredRoles: string[] };
      gateStatus: Record<string, string>;
    };
    expect(approvalRequest.approvalRequest.status).toBe("pending");
    expect(approvalRequest.approvalRequest.requiredRoles).toEqual(
      expect.arrayContaining(["governance_admin", "risk_owner", "approver", "independent_reviewer"]),
    );
    expect(approvalRequest.gateStatus.approved_for_deploy).toBe("pending");
    const approvalRecordAfterRequest = compassHarness.tables.deliverables.find(
      (row) => row.deliverable_type === "approval_record",
    );
    const approvalRecordAfterRequestContent = JSON.parse(String(approvalRecordAfterRequest?.content_json ?? "{}")) as {
      approvalWorkflow?: { requestId?: string; latestDecisionSummary?: string };
    };
    expect(approvalRecordAfterRequestContent.approvalWorkflow?.requestId).toBe(approvalRequest.approvalRequest.requestId);
    expect(approvalRecordAfterRequestContent.approvalWorkflow?.latestDecisionSummary).toContain("submitted");

    const decisionResponse = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/approval-requests/${approvalRequest.approvalRequest.requestId}/decisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decided_by: "govern-admin-1",
          actor_role: "governance_admin",
          decision: "override_approved",
          override_reason: "Emergency bounded release for monitored pilot.",
          notes: "Temporary override logged for auditor review.",
        }),
      }),
      compassEnv,
      {},
    );
    expect(decisionResponse.status).toBe(200);
    const decision = await decisionResponse.json() as {
      approvalRequest: { status: string };
      approvalDecision: { decision: string; actorRole: string };
      gateStatus: Record<string, string>;
    };
    expect(decision.approvalRequest.status).toBe("overridden");
    expect(decision.approvalDecision.decision).toBe("override_approved");
    expect(decision.approvalDecision.actorRole).toBe("governance_admin");
    expect(decision.gateStatus.approved_for_deploy).toBe("complete");

    const useCaseResponse = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}`, { method: "GET" }),
      compassEnv,
      {},
    );
    const updatedUseCase = await useCaseResponse.json() as {
      status: string;
      gates: Record<string, string>;
    };
    expect(updatedUseCase.status).toBe("approved_for_deploy");
    expect(updatedUseCase.gates.approved_for_deploy).toBe("complete");

    const auditResponse = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/audit-trail`, {
        method: "GET",
      }),
      compassEnv,
      {},
    );
    const auditTrail = await auditResponse.json() as { auditTrail: Array<{ eventType: string }> };
    expect(auditTrail.auditTrail.map((entry) => entry.eventType)).toEqual(
      expect.arrayContaining(["approval_requested", "approval_override"]),
    );

    expect(compassHarness.tables.approvalRequests[0]?.status).toBe("overridden");
    expect(compassHarness.tables.approvalDecisions[0]?.decision).toBe("override_approved");
    const approvalRecordRow = compassHarness.tables.deliverables.find(
      (row) => row.deliverable_type === "approval_record",
    );
    const approvalRecordContent = JSON.parse(String(approvalRecordRow?.content_json ?? "{}")) as {
      approvalWorkflow?: { decisions?: Array<{ actorRole: string }> };
    };
    expect(approvalRecordRow?.status).toBe("approved");
    expect(approvalRecordContent.approvalWorkflow?.decisions?.[0]?.actorRole).toBe("governance_admin");
  });

  it("rejects malformed approval roles instead of coercing them", async () => {
    const auroraHarness = createD1Harness();
    const compassHarness = createD1Harness();
    const auroraEnv = {
      AURORA_FILES: mockR2Bucket(),
      AURORA_DB: auroraHarness.db,
      COMPASSAI_BASE_URL: "http://compass.test",
    };
    const compassEnv = { COMPASS_DB: compassHarness.db };

    const createUseCaseResponse = await compassWorker.fetch(
      new Request("http://compass.test/api/v1/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Claims Review Assistant",
          purpose: "Support structured claim review",
          business_owner: "governance-owner",
          business_owner_confirmed: true,
          systems_involved: ["claims_portal"],
          data_categories: ["personal"],
          automation_level: "human-in-the-loop",
          decision_impact: "assistive",
          regulated_domain: false,
          scale: "department",
          known_unknowns: ["retention schedule under review"],
        }),
      }),
      compassEnv,
      {},
    );
    const createdUseCase = await createUseCaseResponse.json() as { useCase: { id: string } };

    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      return compassWorker.fetch(request, compassEnv, {});
    }) as typeof fetch;

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: "invoice",
          fields: {
            invoice_number: { value: "INV-001", confidence: 0.97 },
            total_amount: { value: "1249.22", confidence: 0.93 },
            vendor_name: { value: "Acme Corp", confidence: 0.96 },
          },
        }),
      }),
      auroraEnv,
      {},
    );

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/handoff-to-compassai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_case_id: createdUseCase.useCase.id }),
      }),
      auroraEnv,
      {},
    );

    await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/assess`, { method: "POST" }),
      compassEnv,
      {},
    );

    await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/deliverables/generate`, {
        method: "POST",
      }),
      compassEnv,
      {},
    );

    const invalidRequestRole = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/approval-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requested_by: "operator-1",
          requested_by_role: "committee_chair",
        }),
      }),
      compassEnv,
      {},
    );
    expect(invalidRequestRole.status).toBe(422);
    expect(await invalidRequestRole.json()).toMatchObject({
      code: "INVALID_APPROVAL_ROLE",
    });
  });
});

describe("T20 — Cross-system closure surface", () => {
  let auroraWorker: { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> };
  let compassWorker: { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> };
  const originalFetch = globalThis.fetch;

  beforeAll(async () => {
    auroraWorker = (await import("../../../index")).default;
    compassWorker = (await import("../../../../../compassai/src/index")).default;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("surfaces AurorA evidence lineage and COMPASSai governance-cycle lineage without flattening the boundary", async () => {
    const auroraHarness = createD1Harness();
    const compassHarness = createD1Harness();
    const auroraEnv = {
      AURORA_FILES: mockR2Bucket(),
      AURORA_DB: auroraHarness.db,
      COMPASSAI_BASE_URL: "http://compass.test",
    };
    const compassEnv = { COMPASS_DB: compassHarness.db };

    const createUseCaseResponse = await compassWorker.fetch(
      new Request("http://compass.test/api/v1/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Claims Review Assistant",
          purpose: "Support structured claim review",
          business_owner: "governance-owner",
          business_owner_confirmed: true,
          systems_involved: ["claims_portal"],
          data_categories: ["personal"],
          automation_level: "human-in-the-loop",
          decision_impact: "assistive",
          regulated_domain: false,
          scale: "department",
          known_unknowns: ["retention schedule under review"],
        }),
      }),
      compassEnv,
      {},
    );
    const createdUseCase = await createUseCaseResponse.json() as { useCase: { id: string } };

    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      return compassWorker.fetch(request, compassEnv, {});
    }) as typeof fetch;

    const handoffOnce = async (invoiceNumber: string) => {
      await auroraWorker.fetch(
        new Request("http://aurora.test/api/documents/artifact-123/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            document_type: "invoice",
            fields: {
              invoice_number: { value: invoiceNumber, confidence: 0.97 },
              total_amount: { value: "1249.22", confidence: 0.93 },
              vendor_name: { value: "Acme Corp", confidence: 0.96 },
            },
          }),
        }),
        auroraEnv,
        {},
      );

      await auroraWorker.fetch(
        new Request("http://aurora.test/api/documents/artifact-123/handoff-to-compassai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ use_case_id: createdUseCase.useCase.id }),
        }),
        auroraEnv,
        {},
      );
    };

    await handoffOnce("INV-001");
    await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/assess`, { method: "POST" }),
      compassEnv,
      {},
    );
    await handoffOnce("INV-002");
    await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/assess`, { method: "POST" }),
      compassEnv,
      {},
    );

    const closureResponse = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/closure`, { method: "GET" }),
      compassEnv,
      {},
    );
    expect(closureResponse.status).toBe(200);
    const closure = await closureResponse.json() as {
      sourceSystem: string;
      governanceSystem: string;
      aurora: {
        evidencePackages: Array<{
          payloadId: string;
          artifactId: string;
          processingRunId: string;
          acceptanceState: string;
        }>;
      };
      compassai: {
        governanceCycles: Array<{ cycleId: string; parentCycleId: string | null }>;
        assessments: Array<{ assessmentId: string; parentAssessmentId: string | null; cycleId: string }>;
        feedbackActions: Array<{ requestedState: string }>;
      };
      closure: {
        evidenceLinks: Array<{ payloadId: string }>;
        exposedStatus: { state: string; lineageIntegrity: string };
      };
    };

    expect(closure.sourceSystem).toBe("AurorA");
    expect(closure.governanceSystem).toBe("COMPASSai");
    expect(closure.aurora.evidencePackages).toHaveLength(2);
    expect(closure.aurora.evidencePackages[0]?.artifactId).toBe("artifact-123");
    expect(closure.aurora.evidencePackages[0]?.acceptanceState).toBe("accepted_for_governance");
    expect(closure.aurora.evidencePackages[0]?.processingRunId).toBeTruthy();
    expect(closure.compassai.governanceCycles).toHaveLength(2);
    expect(closure.compassai.governanceCycles[1]?.parentCycleId).toBe(closure.compassai.governanceCycles[0]?.cycleId);
    expect(closure.compassai.assessments).toHaveLength(2);
    expect(closure.compassai.assessments[1]?.parentAssessmentId).toBe(closure.compassai.assessments[0]?.assessmentId);
    expect(closure.compassai.assessments[1]?.cycleId).toBe(closure.compassai.governanceCycles[1]?.cycleId);
    expect(closure.compassai.feedbackActions[0]?.requestedState).toBe("risk_reassessment_required");
    expect(closure.closure.evidenceLinks).toHaveLength(2);
    expect(closure.closure.exposedStatus.state).toBe("risk_assessed");
    expect(closure.closure.exposedStatus.lineageIntegrity).toBe("complete");
  });

  it("fails closed when closure-supporting governance lineage is missing", async () => {
    const auroraHarness = createD1Harness();
    const compassHarness = createD1Harness();
    const auroraEnv = {
      AURORA_FILES: mockR2Bucket(),
      AURORA_DB: auroraHarness.db,
      COMPASSAI_BASE_URL: "http://compass.test",
    };
    const compassEnv = { COMPASS_DB: compassHarness.db };

    const createUseCaseResponse = await compassWorker.fetch(
      new Request("http://compass.test/api/v1/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Claims Review Assistant",
          purpose: "Support structured claim review",
          business_owner: "governance-owner",
          business_owner_confirmed: true,
          systems_involved: ["claims_portal"],
          data_categories: ["personal"],
          automation_level: "human-in-the-loop",
          decision_impact: "assistive",
          regulated_domain: false,
          scale: "department",
          known_unknowns: ["retention schedule under review"],
        }),
      }),
      compassEnv,
      {},
    );
    const createdUseCase = await createUseCaseResponse.json() as { useCase: { id: string } };

    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      return compassWorker.fetch(request, compassEnv, {});
    }) as typeof fetch;

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: "invoice",
          fields: {
            invoice_number: { value: "INV-001", confidence: 0.97 },
            total_amount: { value: "1249.22", confidence: 0.93 },
            vendor_name: { value: "Acme Corp", confidence: 0.96 },
          },
        }),
      }),
      auroraEnv,
      {},
    );

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/handoff-to-compassai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_case_id: createdUseCase.useCase.id }),
      }),
      auroraEnv,
      {},
    );

    await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/assess`, { method: "POST" }),
      compassEnv,
      {},
    );

    const currentCycleId = String(compassHarness.tables.useCases[0]?.current_cycle_id ?? "");
    const cycleIndex = compassHarness.tables.governanceCycles.findIndex((row) => row.cycle_id === currentCycleId);
    expect(cycleIndex).toBeGreaterThanOrEqual(0);
    compassHarness.tables.governanceCycles.splice(cycleIndex, 1);

    const closureResponse = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/closure`, { method: "GET" }),
      compassEnv,
      {},
    );
    expect(closureResponse.status).toBe(200);
    const closure = await closureResponse.json() as {
      closure: {
        exposedStatus: {
          state: string;
          lineageIntegrity: string;
          reasons: string[];
        };
      };
    };

    expect(closure.closure.exposedStatus.state).toBe("evidence_linked");
    expect(closure.closure.exposedStatus.lineageIntegrity).toBe("degraded");
    expect(closure.closure.exposedStatus.reasons[0]).toContain("current governance cycle record is missing");
  });

  it("requires a dedicated closure read token when CompassAI is configured to enforce one", async () => {
    const auroraHarness = createAuroraClosureHarness();
    const compassHarness = createD1Harness();
    const compassEnv = {
      COMPASS_DB: compassHarness.db,
      COMPASSAI_CLOSURE_READ_TOKEN: "compass-closure-read-token",
    };

    const createUseCaseResponse = await compassWorker.fetch(
      new Request("http://compass.test/api/v1/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Claims Review Assistant",
          purpose: "Support structured claim review",
          business_owner: "governance-owner",
          business_owner_confirmed: true,
          systems_involved: ["claims_portal"],
          data_categories: ["personal"],
          automation_level: "human-in-the-loop",
          decision_impact: "assistive",
          regulated_domain: false,
          scale: "department",
          known_unknowns: ["retention schedule under review"],
        }),
      }),
      compassEnv,
      {},
    );
    const createdUseCase = await createUseCaseResponse.json() as { useCase: { id: string } };

    globalThis.fetch = vi.fn(async () => new Response(null, { status: 502 })) as typeof fetch;

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: "invoice",
          fields: {
            invoice_number: { value: "INV-001", confidence: 0.97 },
            total_amount: { value: "1249.22", confidence: 0.93 },
            vendor_name: { value: "Acme Corp", confidence: 0.96 },
          },
        }),
      }),
      {
        AURORA_FILES: mockR2Bucket(),
        AURORA_DB: auroraHarness.db,
      },
      {},
    );

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/evidence-package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_case_id: createdUseCase.useCase.id }),
      }),
      {
        AURORA_FILES: mockR2Bucket(),
        AURORA_DB: auroraHarness.db,
      },
      {},
    );

    const unauthorized = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/closure`, { method: "GET" }),
      compassEnv,
      {},
    );
    expect(unauthorized.status).toBe(401);
    expect(await unauthorized.json()).toMatchObject({ code: "AUTH_REQUIRED" });

    const forbidden = await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/closure`, {
        method: "GET",
        headers: { Authorization: "Bearer wrong-token" },
      }),
      compassEnv,
      {},
    );
    expect(forbidden.status).toBe(403);
    expect(await forbidden.json()).toMatchObject({ code: "AUTH_INVALID" });
  });
});

describe("T21 — AurorA closure fetch-through surface", () => {
  let auroraWorker: { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> };
  let compassWorker: { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> };
  const originalFetch = globalThis.fetch;

  beforeAll(async () => {
    auroraWorker = (await import("../../../index")).default;
    compassWorker = (await import("../../../../../compassai/src/index")).default;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns local AurorA lineage plus the fetched CompassAI closure when one linked use case can be resolved", async () => {
    const auroraHarness = createAuroraClosureHarness();
    const compassHarness = createD1Harness();
    const closureReadToken = "compass-closure-read-token";
    const auroraEnv = {
      AURORA_FILES: mockR2Bucket(),
      AURORA_DB: auroraHarness.db,
      COMPASSAI_BASE_URL: "http://compass.test",
      COMPASSAI_CLOSURE_READ_TOKEN: closureReadToken,
    };
    const compassEnv = {
      COMPASS_DB: compassHarness.db,
      COMPASSAI_CLOSURE_READ_TOKEN: closureReadToken,
    };

    const createUseCaseResponse = await compassWorker.fetch(
      new Request("http://compass.test/api/v1/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Claims Review Assistant",
          purpose: "Support structured claim review",
          business_owner: "governance-owner",
          business_owner_confirmed: true,
          systems_involved: ["claims_portal"],
          data_categories: ["personal"],
          automation_level: "human-in-the-loop",
          decision_impact: "assistive",
          regulated_domain: false,
          scale: "department",
          known_unknowns: ["retention schedule under review"],
        }),
      }),
      compassEnv,
      {},
    );
    const createdUseCase = await createUseCaseResponse.json() as { useCase: { id: string } };

    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      return compassWorker.fetch(request, compassEnv, {});
    }) as typeof fetch;

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: "invoice",
          fields: {
            invoice_number: { value: "INV-001", confidence: 0.97 },
            total_amount: { value: "1249.22", confidence: 0.93 },
            vendor_name: { value: "Acme Corp", confidence: 0.96 },
          },
        }),
      }),
      auroraEnv,
      {},
    );

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/handoff-to-compassai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_case_id: createdUseCase.useCase.id }),
      }),
      auroraEnv,
      {},
    );

    await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/assess`, { method: "POST" }),
      compassEnv,
      {},
    );

    const closureResponse = await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/closure", { method: "GET" }),
      auroraEnv,
      {},
    );
    expect(closureResponse.status).toBe(200);
    const closure = await closureResponse.json() as {
      artifactId: string;
      aurora: { artifactId: string; exposedStatus: { state: string } };
      compassai: { closureId: string; closure: { exposedStatus: { state: string } } } | null;
      fetchThrough: {
        transport: { targetEndpoint: string | null; httpStatus: number | null };
        exposedStatus: {
          state: string;
          lineageIntegrity: string;
          resolvedUseCaseId: string | null;
          candidateUseCaseIds: string[];
          governanceState: string | null;
        };
      };
    };

    expect(closure.artifactId).toBe("artifact-123");
    expect(closure.aurora.artifactId).toBe("artifact-123");
    expect(closure.aurora.exposedStatus.state).toBe("handoff_succeeded");
    expect(closure.compassai?.closureId).toBeTruthy();
    expect(closure.compassai?.closure.exposedStatus.state).toBe("risk_assessed");
    expect(closure.fetchThrough.transport.targetEndpoint).toContain(`/api/v1/use-cases/${createdUseCase.useCase.id}/closure`);
    expect(closure.fetchThrough.transport.httpStatus).toBe(200);
    expect(closure.fetchThrough.exposedStatus.state).toBe("governance_linked");
    expect(closure.fetchThrough.exposedStatus.lineageIntegrity).toBe("complete");
    expect(closure.fetchThrough.exposedStatus.resolvedUseCaseId).toBe(createdUseCase.useCase.id);
    expect(closure.fetchThrough.exposedStatus.candidateUseCaseIds).toEqual([createdUseCase.useCase.id]);
    expect(closure.fetchThrough.exposedStatus.governanceState).toBe("risk_assessed");
  });

  it("pins closure fetch-through to COMPASSAI_BASE_URL and ignores request-time base URL overrides", async () => {
    const auroraHarness = createAuroraClosureHarness();
    const compassHarness = createD1Harness();
    const closureReadToken = "compass-closure-read-token";
    const auroraEnv = {
      AURORA_FILES: mockR2Bucket(),
      AURORA_DB: auroraHarness.db,
      COMPASSAI_BASE_URL: "http://compass.test",
      COMPASSAI_CLOSURE_READ_TOKEN: closureReadToken,
    };
    const compassEnv = {
      COMPASS_DB: compassHarness.db,
      COMPASSAI_CLOSURE_READ_TOKEN: closureReadToken,
    };

    const createUseCaseResponse = await compassWorker.fetch(
      new Request("http://compass.test/api/v1/use-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Claims Review Assistant",
          purpose: "Support structured claim review",
          business_owner: "governance-owner",
          business_owner_confirmed: true,
          systems_involved: ["claims_portal"],
          data_categories: ["personal"],
          automation_level: "human-in-the-loop",
          decision_impact: "assistive",
          regulated_domain: false,
          scale: "department",
          known_unknowns: ["retention schedule under review"],
        }),
      }),
      compassEnv,
      {},
    );
    const createdUseCase = await createUseCaseResponse.json() as { useCase: { id: string } };

    const requestedUrls: string[] = [];
    const authorizationHeaders: string[] = [];
    globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(String(input), init);
      requestedUrls.push(request.url);
      authorizationHeaders.push(request.headers.get("authorization") ?? "");

      if (!request.url.startsWith("http://compass.test/")) {
        return new Response("unexpected host", { status: 502 });
      }

      return compassWorker.fetch(request, compassEnv, {});
    }) as typeof fetch;

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: "invoice",
          fields: {
            invoice_number: { value: "INV-001", confidence: 0.97 },
            total_amount: { value: "1249.22", confidence: 0.93 },
            vendor_name: { value: "Acme Corp", confidence: 0.96 },
          },
        }),
      }),
      auroraEnv,
      {},
    );

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/handoff-to-compassai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_case_id: createdUseCase.useCase.id }),
      }),
      auroraEnv,
      {},
    );

    await compassWorker.fetch(
      new Request(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/assess`, { method: "POST" }),
      compassEnv,
      {},
    );

    const closureResponse = await auroraWorker.fetch(
      new Request(
        `http://aurora.test/api/documents/artifact-123/closure?compassai_base_url=${encodeURIComponent("http://evil.test")}`,
        { method: "GET" },
      ),
      auroraEnv,
      {},
    );
    expect(closureResponse.status).toBe(200);
    const closure = await closureResponse.json() as {
      fetchThrough: {
        transport: { targetEndpoint: string | null; httpStatus: number | null };
        exposedStatus: { state: string };
      };
    };

    expect(requestedUrls).toHaveLength(2);
    expect(requestedUrls[0]).toBe(`http://compass.test/api/v1/evidence`);
    expect(requestedUrls[1]).toBe(`http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/closure`);
    expect(authorizationHeaders).toEqual([
      "",
      `Bearer ${closureReadToken}`,
    ]);
    expect(closure.fetchThrough.transport.targetEndpoint).toBe(
      `http://compass.test/api/v1/use-cases/${createdUseCase.useCase.id}/closure`,
    );
    expect(closure.fetchThrough.transport.httpStatus).toBe(200);
    expect(closure.fetchThrough.exposedStatus.state).toBe("governance_linked");
  });

  it("fails closed with governance_ambiguous when one document is linked to multiple use cases and no explicit use_case_id is supplied", async () => {
    const auroraHarness = createAuroraClosureHarness();
    const auroraEnv = {
      AURORA_FILES: mockR2Bucket(),
      AURORA_DB: auroraHarness.db,
    };

    await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: "invoice",
          fields: {
            invoice_number: { value: "INV-001", confidence: 0.97 },
            total_amount: { value: "1249.22", confidence: 0.93 },
            vendor_name: { value: "Acme Corp", confidence: 0.96 },
          },
        }),
      }),
      auroraEnv,
      {},
    );

    for (const useCaseId of ["usecase-a", "usecase-b"]) {
      const packageResponse = await auroraWorker.fetch(
        new Request("http://aurora.test/api/documents/artifact-123/evidence-package", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ use_case_id: useCaseId }),
        }),
        auroraEnv,
        {},
      );
      expect(packageResponse.status).toBe(200);
    }

    const closureResponse = await auroraWorker.fetch(
      new Request("http://aurora.test/api/documents/artifact-123/closure", { method: "GET" }),
      auroraEnv,
      {},
    );
    expect(closureResponse.status).toBe(200);
    const closure = await closureResponse.json() as {
      compassai: unknown;
      fetchThrough: {
        transport: { targetEndpoint: string | null; httpStatus: number | null };
        exposedStatus: {
          state: string;
          lineageIntegrity: string;
          resolvedUseCaseId: string | null;
          candidateUseCaseIds: string[];
          reasons: string[];
        };
      };
    };

    expect(closure.compassai).toBeNull();
    expect(closure.fetchThrough.transport.targetEndpoint).toBeNull();
    expect(closure.fetchThrough.transport.httpStatus).toBeNull();
    expect(closure.fetchThrough.exposedStatus.state).toBe("governance_ambiguous");
    expect(closure.fetchThrough.exposedStatus.lineageIntegrity).toBe("degraded");
    expect(closure.fetchThrough.exposedStatus.resolvedUseCaseId).toBeNull();
    expect(closure.fetchThrough.exposedStatus.candidateUseCaseIds).toEqual(["usecase-b", "usecase-a"]);
    expect(closure.fetchThrough.exposedStatus.reasons[0]).toContain("Multiple COMPASSai use_case_ids");
  });
});
