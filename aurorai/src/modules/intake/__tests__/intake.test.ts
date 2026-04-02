import { describe, it, expect, vi, beforeAll } from "vitest";
import { handleIntake } from "../index";
import { MIME_ALLOWLIST, SIZE_CEILING_BYTES } from "../validators";
import { deterministicHash } from "../../../../../shared/utils/hash";
import type { IntakeRequest } from "../types";
import { PRODUCT_NAMES, LEGACY_PRODUCT_NAME_ALIASES } from "../../../../../shared/constants/product-names";

// -- Mock factories --

function mockR2Bucket(putImpl?: () => Promise<void>): R2Bucket {
  return {
    put: vi.fn(putImpl ?? (async () => undefined)),
    get: vi.fn(),
    head: vi.fn(),
    delete: vi.fn(),
    list: vi.fn(),
    createMultipartUpload: vi.fn(),
    resumeMultipartUpload: vi.fn(),
  } as unknown as R2Bucket;
}

function mockD1Database(): D1Database {
  const stmt = {
    bind: vi.fn().mockReturnThis(),
    run: vi.fn(async () => ({ success: true, results: [], meta: {} })),
    first: vi.fn(async () => null),
    all: vi.fn(),
    raw: vi.fn(),
  };
  return {
    prepare: vi.fn(() => stmt),
    batch: vi.fn(),
    exec: vi.fn(),
    dump: vi.fn(),
  } as unknown as D1Database;
}

function validIntakeRequest(overrides?: Partial<IntakeRequest>): IntakeRequest {
  const content = new TextEncoder().encode("Hello, world!");
  return {
    file_buffer: content.buffer as ArrayBuffer,
    source_filename: "test-document.pdf",
    source_mime_type: "application/pdf",
    source_channel: "browser_upload",
    operator_or_service_identity: "test-operator",
    document_type_hint: "policy_document",
    jurisdiction_context: "CA-QC",
    legal_basis: "contractual_review",
    purpose_of_processing: "governance_review",
    retention_profile: "standard_case_retention",
    ...overrides,
  };
}

// -- Tests --

describe("T00 — canonical product names", () => {
  it("exports canonical product names and keeps drifted spellings secondary", () => {
    expect(PRODUCT_NAMES.PHAROS).toBe("PHAROS");
    expect(PRODUCT_NAMES.COMPASSAI).toBe("CompassAI");
    expect(PRODUCT_NAMES.AURORA).toBe("Aurora");
    expect(LEGACY_PRODUCT_NAME_ALIASES.drift_aurora).toBe("AurorA");
    expect(LEGACY_PRODUCT_NAME_ALIASES.drift_compassai).toBe("COMPASSai");
  });
});

describe("T01 — valid upload: ingested", () => {
  it("accepts a valid PDF upload", async () => {
    const bucket = mockR2Bucket();
    const db = mockD1Database();
    const req = validIntakeRequest();

    const result = await handleIntake(req, { AURORA_FILES: bucket, AURORA_DB: db });

    expect(result.intake_state).toBe("ingested");
    expect(result.artifact_id).toBeTruthy();
    expect(result.artifact_id.length).toBe(64);
    expect(result.storage.r2_key).toContain(result.artifact_id);
    expect(result.source_hash.length).toBe(64);
    expect(result.received_at).toBeTruthy();
    expect(result.known_unknowns).toEqual([]);
    expect(bucket.put).toHaveBeenCalledOnce();
    expect(db.prepare).toHaveBeenCalled();
  });
});

describe("T02 — rejected: MIME not in allowlist", () => {
  it("rejects disallowed MIME type without calling storage", async () => {
    const bucket = mockR2Bucket();
    const db = mockD1Database();
    const req = validIntakeRequest({ source_mime_type: "application/x-msdownload" });

    const result = await handleIntake(req, { AURORA_FILES: bucket, AURORA_DB: db });

    expect(result.intake_state).toBe("rejected");
    expect(result.rejection_reason).toBeTruthy();
    expect(result.artifact_id).toBeNull();
    expect(bucket.put).not.toHaveBeenCalled();
    expect(db.prepare).not.toHaveBeenCalled();
  });
});

describe("T03 — rejected: file too large", () => {
  it("rejects oversized file without calling R2", async () => {
    const bucket = mockR2Bucket();
    const db = mockD1Database();
    const oversized = new ArrayBuffer(SIZE_CEILING_BYTES + 1);
    const req = validIntakeRequest({ file_buffer: oversized });

    const result = await handleIntake(req, { AURORA_FILES: bucket, AURORA_DB: db });

    expect(result.intake_state).toBe("rejected");
    expect(bucket.put).not.toHaveBeenCalled();
  });
});

describe("T04 — storage failure propagates", () => {
  it("throws StorageWriteError when R2 fails", async () => {
    const bucket = mockR2Bucket(async () => {
      throw new Error("R2 network timeout");
    });
    const db = mockD1Database();
    const req = validIntakeRequest();

    await expect(handleIntake(req, { AURORA_FILES: bucket, AURORA_DB: db }))
      .rejects.toThrow("R2_WRITE_FAILED");
  });
});

describe("T05 — MIME_ALLOWLIST is valid", () => {
  it("is a non-empty array of type/subtype strings", () => {
    expect(MIME_ALLOWLIST.length).toBeGreaterThan(0);
    for (const mime of MIME_ALLOWLIST) {
      expect(mime).toBeTruthy();
      expect(mime).toMatch(/^[a-z]+\/[a-z0-9.+-]+$/);
    }
  });
});

describe("T06 — deterministicHash is deterministic", () => {
  it("returns same 64-char hex for same input", async () => {
    const a = await deterministicHash("test-input");
    const b = await deterministicHash("test-input");
    expect(a).toBe(b);
    expect(a.length).toBe(64);
  });
});

describe("T07 — Worker endpoint routing", () => {
  let worker: { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> };

  beforeAll(async () => {
    const mod = await import("../../../index");
    worker = mod.default;
  });

  it("GET /api/documents/upload returns 405", async () => {
    const env = { AURORA_FILES: mockR2Bucket(), AURORA_DB: mockD1Database() };
    const req = new Request("http://localhost/api/documents/upload", { method: "GET" });
    const res = await worker.fetch(req, env, {});
    expect(res.status).toBe(405);
  });

  it("POST /unknown returns 404", async () => {
    const env = { AURORA_FILES: mockR2Bucket(), AURORA_DB: mockD1Database() };
    const req = new Request("http://localhost/unknown", { method: "POST" });
    const res = await worker.fetch(req, env, {});
    expect(res.status).toBe(404);
  });

  it("POST /intake is no longer the primary contract", async () => {
    const env = { AURORA_FILES: mockR2Bucket(), AURORA_DB: mockD1Database() };
    const req = new Request("http://localhost/intake", { method: "POST" });
    const res = await worker.fetch(req, env, {});
    expect(res.status).toBe(404);
  });

  it("POST /api/documents/upload with missing file field returns 400", async () => {
    const env = { AURORA_FILES: mockR2Bucket(), AURORA_DB: mockD1Database() };
    const formData = new FormData();
    formData.append("source_channel", "browser_upload");
    formData.append("operator_or_service_identity", "test");
    const req = new Request("http://localhost/api/documents/upload", { method: "POST", body: formData });
    const res = await worker.fetch(req, env, {});
    expect(res.status).toBe(400);
    const body = await res.json() as { code: string };
    expect(body.code).toBe("MISSING_FIELD");
  });

  it("POST /api/documents/upload with valid multipart returns canonical intake fields", async () => {
    const env = { AURORA_FILES: mockR2Bucket(), AURORA_DB: mockD1Database() };
    const formData = new FormData();
    formData.append("file", new File(["test content"], "doc.pdf", { type: "application/pdf" }));
    formData.append("source_channel", "browser_upload");
    formData.append("operator_or_service_identity", "test-operator");
    formData.append("jurisdiction_context", "CA-QC");
    formData.append("legal_basis", "contractual_review");
    formData.append("purpose_of_processing", "governance_review");
    formData.append("retention_profile", "standard_case_retention");
    const req = new Request("http://localhost/api/documents/upload", { method: "POST", body: formData });
    const res = await worker.fetch(req, env, {});
    expect(res.status).toBe(200);
    const body = await res.json() as {
      artifact_id: string;
      intake_state: string;
      source_hash: string;
      storage: { r2_key: string };
    };
    expect(body.artifact_id).toBeTruthy();
    expect(body.intake_state).toBe("ingested");
    expect(body.source_hash.length).toBe(64);
    expect(body.storage.r2_key).toContain(body.artifact_id);
    expect((body as Record<string, unknown>).intakeId).toBeUndefined();
  });

  it("POST /api/documents/123/evidence-package is now a live Worker route", async () => {
    const intakeRecordDb = {
      prepare: vi.fn((sql: string) => {
        const stmt = {
          bind: vi.fn().mockReturnThis(),
          run: vi.fn(async () => ({ success: true, results: [], meta: {} })),
          first: vi.fn(async () => {
            if (sql.includes("SELECT * FROM file_intake")) {
              return {
                artifact_id: "123",
                r2_key: "govern-artifacts/artifacts/123/v1/source.pdf",
                source_mime_type: "application/pdf",
                size_bytes: 12,
                source_filename: "doc.pdf",
                received_at: "2026-03-31T00:00:00Z",
                source_channel: "browser_upload",
                operator_or_service_identity: "test-operator",
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
            return null;
          }),
          all: vi.fn(async () => ({ results: [] })),
          raw: vi.fn(),
        };
        return stmt;
      }),
      batch: vi.fn(),
      exec: vi.fn(),
      dump: vi.fn(),
    } as unknown as D1Database;
    const env = { AURORA_FILES: mockR2Bucket(), AURORA_DB: intakeRecordDb };
    const req = new Request("http://localhost/api/documents/123/evidence-package", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ use_case_id: "usecase-1" }),
    });
    const res = await worker.fetch(req, env, {});
    expect(res.status).toBe(422);
  });
});
