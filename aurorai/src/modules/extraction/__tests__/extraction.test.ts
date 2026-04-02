import { beforeAll, describe, expect, it, vi } from "vitest";
import { EXTRACTION_CONTROLS } from "../controls";
import { runExtraction } from "../index";
import type { ExtractionJob } from "../types";
import type { IntakeRecord } from "../../../storage/d1";

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

function mockD1Database(intakeRecord = buildIntakeRecord()) {
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
          return { success: true, results: [], meta: {} };
        }),
        first: vi.fn(async () => {
          if (sql.includes("SELECT * FROM file_intake")) {
            return boundArgs[0] === intakeRecord.artifact_id ? intakeRecord : null;
          }
          return null;
        }),
        all: vi.fn(),
        raw: vi.fn(),
      };
      return stmt;
    }),
    batch: vi.fn(),
    exec: vi.fn(),
    dump: vi.fn(),
  } as unknown as D1Database;

  return { db, writes };
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

describe("T08 — extraction control registry", () => {
  it("defines the expected Module 04 control set", () => {
    expect(Object.keys(EXTRACTION_CONTROLS)).toEqual(["EC-01", "EC-02", "EC-03", "EC-04", "EC-05", "EC-06"]);
    expect(EXTRACTION_CONTROLS["EC-04"].workflowInterface).toContain("hitl");
    expect(EXTRACTION_CONTROLS["EC-06"].evidenceArtifactRef).toBe("package_hash");
  });
});

describe("T09 — extraction happy path", () => {
  it("produces an auto-approved evidence package and persists an extraction log", async () => {
    const { db, writes } = mockD1Database();

    const result = await runExtraction(validExtractionJob(), { AURORA_DB: db });

    expect(result.overallAdmissible).toBe(true);
    expect(result.reviewDecision.status).toBe("auto_approved");
    expect(result.mandatoryFieldsPresent).toBe(true);
    expect(result.belowThresholdFields).toEqual([]);
    expect(result.packageHash).toHaveLength(64);
    expect(result.evidencePackage.extraction_results.mandatory_fields_present).toBe(true);
    expect(result.evidencePackage.quality_controls.hitl_triggered).toBe(false);
    expect(result.evidenceItems).toHaveLength(3);
    expect(writes.some((entry) => entry.sql.includes("INSERT INTO extraction_log"))).toBe(true);
  });
});

describe("T10 — extraction gates to HITL when threshold and rule checks fail", () => {
  it("flags below-threshold fields and explicit HITL rules", async () => {
    const result = await runExtraction(
      validExtractionJob({
        fields: {
          invoice_number: { value: "INV-001", confidence: 0.97 },
          total_amount: { value: "15000", confidence: 0.6 },
          vendor_name: { value: "Acme Corp", confidence: 0.96 },
        },
        hitlRequiredWhen: ["total_amount > 10000"],
      }),
    );

    expect(result.overallAdmissible).toBe(false);
    expect(result.reviewDecision.status).toBe("hitl_required");
    expect(result.belowThresholdFields).toEqual(["total_amount"]);
    expect(result.evidencePackage.quality_controls.hitl_triggered).toBe(true);
    expect(result.evidencePackage.quality_controls.confidence_check).toBe("failed");
    expect(result.reviewDecision.reason).toContain("Configured HITL rule matched");
  });
});

describe("T11 — bounded PII masking", () => {
  it("masks only configured patterns and leaves unmatched values visible", async () => {
    const result = await runExtraction(
      validExtractionJob({
        documentType: "generic_document",
        mandatoryFields: [],
        fields: {
          contact_email: "alice@example.com",
          mrn: "MRN-2847362",
        },
        piiPatterns: ["email"],
      }),
    );

    expect(result.evidencePackage.quality_controls.pii_detected).toEqual(["contact_email"]);
    expect(result.evidencePackage.extraction_results.fields.contact_email.value).toMatch(/^sha256:/);
    expect(result.evidencePackage.extraction_results.fields.mrn.value).toBe("MRN-2847362");
  });
});

describe("T12 — worker extraction route", () => {
  let worker: { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> };

  beforeAll(async () => {
    const mod = await import("../../../index");
    worker = mod.default;
  });

  it("serves POST /api/documents/:id/extract for known intake records", async () => {
    const { db } = mockD1Database();
    const env = { AURORA_FILES: {} as R2Bucket, AURORA_DB: db };
    const req = new Request("http://localhost/api/documents/artifact-123/extract", {
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
    });

    const res = await worker.fetch(req, env, {});
    expect(res.status).toBe(200);
    const body = await res.json() as { extractionId: string; evidencePackage: { package_hash: string } };
    expect(body.extractionId).toHaveLength(64);
    expect(body.evidencePackage.package_hash).toHaveLength(64);
  });

  it("returns 404 when the intake record does not exist", async () => {
    const { db } = mockD1Database();
    const env = { AURORA_FILES: {} as R2Bucket, AURORA_DB: db };
    const req = new Request("http://localhost/api/documents/missing-artifact/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        document_type: "invoice",
        fields: {
          invoice_number: { value: "INV-001", confidence: 0.97 },
        },
      }),
    });

    const res = await worker.fetch(req, env, {});
    expect(res.status).toBe(404);
  });
});
