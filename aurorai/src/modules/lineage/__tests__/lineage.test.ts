import { beforeAll, describe, expect, it, vi } from "vitest";
import { handleIntake } from "../../intake/index";
import type { IntakeRecord, ExtractionLogRecord } from "../../../storage/d1";
import type { IntakeRequest } from "../../intake/types";

type ArtifactRow = {
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

type ArtifactVersionRow = {
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

type ProcessingRunRow = {
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

type ControlCheckRow = {
  check_id: string;
  run_id: string;
  control_id: string;
  status: "passed" | "failed";
  finding_code: string | null;
  finding_detail_json: string | null;
  triggered_human_review: number;
  created_at: string;
};

type ReviewDecisionRow = {
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

type EvidencePackageRow = {
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

type AuditEventRow = {
  event_id: string;
  aggregate_type: string;
  aggregate_id: string;
  event_type: string;
  event_payload_json: string;
  created_at: string;
};

function validIntakeRequest(overrides?: Partial<IntakeRequest>): IntakeRequest {
  const content = new TextEncoder().encode("Aurora lineage test payload");
  return {
    file_buffer: content.buffer as ArrayBuffer,
    source_filename: "lineage-test.pdf",
    source_mime_type: "application/pdf",
    source_channel: "browser_upload",
    operator_or_service_identity: "test-operator",
    document_type_hint: "invoice",
    jurisdiction_context: "CA-QC",
    legal_basis: "contractual_review",
    purpose_of_processing: "governance_review",
    retention_profile: "standard_case_retention",
    ...overrides,
  };
}

function buildLegacyIntakeRecord(): IntakeRecord {
  return {
    artifact_id: "legacy-artifact-123",
    r2_key: "govern-artifacts/artifacts/legacy-artifact-123/v1/source.pdf",
    source_mime_type: "application/pdf",
    size_bytes: 512,
    source_filename: "legacy.pdf",
    received_at: "2026-03-31T00:00:00.000Z",
    source_channel: "browser_upload",
    operator_or_service_identity: "legacy-operator",
    document_type_hint: "invoice",
    jurisdiction_context: "CA-QC",
    legal_basis: "contractual_review",
    purpose_of_processing: "governance_review",
    retention_profile: "standard_case_retention",
    intake_state: "ingested",
    known_unknowns: "[]",
    rejection_reason: null,
    source_hash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
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

function createAuroraLineageHarness(options?: { legacyIntakeOnly?: IntakeRecord[] }) {
  const fileIntake = new Map<string, IntakeRecord>();
  for (const record of options?.legacyIntakeOnly ?? []) {
    fileIntake.set(record.artifact_id, record);
  }

  const artifacts = new Map<string, ArtifactRow>();
  const artifactVersions: ArtifactVersionRow[] = [];
  const extractionLogs: ExtractionLogRecord[] = [];
  const processingRuns: ProcessingRunRow[] = [];
  const controlChecks: ControlCheckRow[] = [];
  const reviewDecisions: ReviewDecisionRow[] = [];
  const evidencePackages: EvidencePackageRow[] = [];
  const auditEvents: AuditEventRow[] = [];

  const db = {
    prepare: vi.fn((sql: string) => {
      let boundArgs: unknown[] = [];
      const stmt = {
        bind: vi.fn((...args: unknown[]) => {
          boundArgs = args;
          return stmt;
        }),
        run: vi.fn(async () => {
          if (sql.includes("INSERT INTO file_intake")) {
            const row: IntakeRecord = {
              artifact_id: String(boundArgs[0]),
              r2_key: String(boundArgs[1]),
              source_mime_type: String(boundArgs[2]),
              size_bytes: Number(boundArgs[3]),
              source_filename: String(boundArgs[4]),
              received_at: String(boundArgs[5]),
              source_channel: String(boundArgs[6]),
              operator_or_service_identity: String(boundArgs[7]),
              document_type_hint: boundArgs[8] as string | null,
              jurisdiction_context: boundArgs[9] as string | null,
              legal_basis: boundArgs[10] as string | null,
              purpose_of_processing: boundArgs[11] as string | null,
              retention_profile: boundArgs[12] as string | null,
              intake_state: String(boundArgs[13]),
              known_unknowns: String(boundArgs[14]),
              rejection_reason: null,
              source_hash: String(boundArgs[15]),
            };
            fileIntake.set(row.artifact_id, row);
          }

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

          if (sql.includes("INSERT INTO audit_events")) {
            auditEvents.push({
              event_id: String(boundArgs[0]),
              aggregate_type: "artifact",
              aggregate_id: String(boundArgs[1]),
              event_type: String(boundArgs[2]),
              event_payload_json: String(boundArgs[3]),
              created_at: String(boundArgs[4]),
            });
          }

          if (sql.includes("INSERT INTO extraction_log")) {
            extractionLogs.push({
              extraction_id: String(boundArgs[0]),
              processing_run_id: String(boundArgs[1]),
              artifact_id: String(boundArgs[2]),
              parent_run_id: boundArgs[3] as string | null,
              schema_version: String(boundArgs[4]),
              source_hash: String(boundArgs[5]),
              document_type: String(boundArgs[6]),
              processing_timestamp: String(boundArgs[7]),
              extraction_results_json: String(boundArgs[8]),
              evidence_package_json: String(boundArgs[9]),
              mandatory_fields_present: Number(boundArgs[10]),
              below_threshold_fields_json: String(boundArgs[11]),
              quality_controls_json: String(boundArgs[12]),
              audit_trail_json: String(boundArgs[13]),
              evidence_items_json: String(boundArgs[14]),
              controls_applied_json: String(boundArgs[15]),
              review_decision_json: String(boundArgs[16]),
              evidence_tier: Number(boundArgs[17]),
              package_hash: String(boundArgs[18]),
              if_trace_receipt: boundArgs[19] as string | null,
              created_at: String(boundArgs[20]),
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
            return { results: [] };
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
      fileIntake,
      artifacts,
      artifactVersions,
      extractionLogs,
      processingRuns,
      controlChecks,
      reviewDecisions,
      evidencePackages,
      auditEvents,
    },
  };
}

describe("T20 — Module 08 lineage and fail-closed status exposure", () => {
  let worker: { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> };

  beforeAll(async () => {
    const mod = await import("../../../index");
    worker = mod.default;
  });

  it("keeps append-only runs and narrows status when a newer run is not yet packaged", async () => {
    const harness = createAuroraLineageHarness();
    const env = { AURORA_FILES: mockR2Bucket(), AURORA_DB: harness.db };

    const intake = await handleIntake(validIntakeRequest(), env);
    expect(intake.intake_state).toBe("ingested");

    const firstExtractResponse = await worker.fetch(
      new Request(`http://aurora.test/api/documents/${intake.artifact_id}/extract`, {
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
      env,
      {},
    );
    expect(firstExtractResponse.status).toBe(200);

    const packageResponse = await worker.fetch(
      new Request(`http://aurora.test/api/documents/${intake.artifact_id}/evidence-package`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_case_id: "usecase-88", session_ref: "session-1" }),
      }),
      env,
      {},
    );
    expect(packageResponse.status).toBe(200);

    const packagedStatus = await worker.fetch(
      new Request(`http://aurora.test/api/documents/${intake.artifact_id}/status`, { method: "GET" }),
      env,
      {},
    );
    expect(packagedStatus.status).toBe(200);
    expect((await packagedStatus.json() as { state: string }).state).toBe("packaged");

    const secondExtractResponse = await worker.fetch(
      new Request(`http://aurora.test/api/documents/${intake.artifact_id}/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_type: "invoice",
          fields: {
            invoice_number: { value: "INV-002", confidence: 0.98 },
            total_amount: { value: "1549.22", confidence: 0.95 },
            vendor_name: { value: "Acme Corp", confidence: 0.97 },
          },
        }),
      }),
      env,
      {},
    );
    expect(secondExtractResponse.status).toBe(200);

    const lineageResponse = await worker.fetch(
      new Request(`http://aurora.test/api/documents/${intake.artifact_id}/lineage`, { method: "GET" }),
      env,
      {},
    );
    expect(lineageResponse.status).toBe(200);
    const lineage = await lineageResponse.json() as {
      processingRuns: Array<{ runId: string; parentRunId: string | null }>;
      controlChecks: Array<unknown>;
      reviewDecisions: Array<unknown>;
      evidencePackages: Array<unknown>;
      exposedStatus: { state: string; reasons: string[] };
    };

    expect(lineage.processingRuns).toHaveLength(2);
    expect(lineage.processingRuns[1]?.parentRunId).toBe(lineage.processingRuns[0]?.runId);
    expect(lineage.controlChecks).toHaveLength(12);
    expect(lineage.reviewDecisions).toHaveLength(2);
    expect(lineage.evidencePackages).toHaveLength(1);
    expect(lineage.exposedStatus.state).toBe("extracted_ready");
    expect(lineage.exposedStatus.reasons[0]).toContain("newer extraction run exists");
  });

  it("fails closed to ingested when only the legacy intake record exists", async () => {
    const harness = createAuroraLineageHarness({ legacyIntakeOnly: [buildLegacyIntakeRecord()] });
    const env = { AURORA_FILES: mockR2Bucket(), AURORA_DB: harness.db };

    const response = await worker.fetch(
      new Request("http://aurora.test/api/documents/legacy-artifact-123/status", { method: "GET" }),
      env,
      {},
    );

    expect(response.status).toBe(200);
    const body = await response.json() as {
      state: string;
      lineageIntegrity: string;
      reasons: string[];
    };
    expect(body.state).toBe("ingested");
    expect(body.lineageIntegrity).toBe("degraded");
    expect(body.reasons[0]).toContain("Normalized artifact lineage root is missing");
  });
});
