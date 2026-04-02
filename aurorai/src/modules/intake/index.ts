// Aurora — file intake pipeline
// Source: Spec 03 — aurora-file-intake-module

import type { IntakeRequest, IntakeResult } from "./types";
import { validateMimeType, validateFileSize, validateContentTypeHeader } from "./validators";
import { writeIntakeFile, sanitizeFileName } from "../../storage/r2";
import { recordIntake } from "../../storage/d1";
import { deterministicHash } from "../../../../shared/utils/hash";
import { log } from "../../lib/logger";

export async function handleIntake(
  request: IntakeRequest,
  env: { AURORA_FILES: R2Bucket; AURORA_DB: D1Database },
): Promise<IntakeResult> {
  const receivedAt = new Date().toISOString();

  // 1. Validate MIME type
  const mimeCheck = validateMimeType(request.source_mime_type);
  if (!mimeCheck.valid) {
    log("warn", "intake_rejected", {
      event: "intake_rejected",
      reason: mimeCheck.reason,
      sourceFilename: request.source_filename,
      sourceMimeType: request.source_mime_type,
    });
    return {
      artifact_id: null,
      intake_state: "rejected",
      received_at: receivedAt,
      size_bytes: request.file_buffer.byteLength,
      source_channel: request.source_channel,
      source_filename: request.source_filename,
      source_mime_type: request.source_mime_type,
      operator_or_service_identity: request.operator_or_service_identity,
      document_type_hint: request.document_type_hint,
      jurisdiction_context: request.jurisdiction_context,
      legal_basis: request.legal_basis,
      purpose_of_processing: request.purpose_of_processing,
      retention_profile: request.retention_profile,
      known_unknowns: [],
      rejection_reason: mimeCheck.reason,
    };
  }

  // 2. Validate file size
  const sizeCheck = validateFileSize(request.file_buffer.byteLength);
  if (!sizeCheck.valid) {
    log("warn", "intake_rejected", {
      event: "intake_rejected",
      reason: sizeCheck.reason,
      sourceFilename: request.source_filename,
      sizeBytes: request.file_buffer.byteLength,
    });
    return {
      artifact_id: null,
      intake_state: "rejected",
      received_at: receivedAt,
      size_bytes: request.file_buffer.byteLength,
      source_channel: request.source_channel,
      source_filename: request.source_filename,
      source_mime_type: request.source_mime_type,
      operator_or_service_identity: request.operator_or_service_identity,
      document_type_hint: request.document_type_hint,
      jurisdiction_context: request.jurisdiction_context,
      legal_basis: request.legal_basis,
      purpose_of_processing: request.purpose_of_processing,
      retention_profile: request.retention_profile,
      known_unknowns: [],
      rejection_reason: sizeCheck.reason,
    };
  }

  // 3. Content-type header check (pass-through per Spec 03)
  const headerCheck = await validateContentTypeHeader(request.source_mime_type, request.file_buffer);
  if (!headerCheck.valid) {
    log("warn", "intake_rejected", {
      event: "intake_rejected",
      reason: headerCheck.reason,
      sourceFilename: request.source_filename,
    });
    return {
      artifact_id: null,
      intake_state: "rejected",
      received_at: receivedAt,
      size_bytes: request.file_buffer.byteLength,
      source_channel: request.source_channel,
      source_filename: request.source_filename,
      source_mime_type: request.source_mime_type,
      operator_or_service_identity: request.operator_or_service_identity,
      document_type_hint: request.document_type_hint,
      jurisdiction_context: request.jurisdiction_context,
      legal_basis: request.legal_basis,
      purpose_of_processing: request.purpose_of_processing,
      retention_profile: request.retention_profile,
      known_unknowns: [],
      rejection_reason: headerCheck.reason,
    };
  }

  // Compute source hash from file content
  const contentBytes = new Uint8Array(request.file_buffer);
  const hashBuffer = await crypto.subtle.digest("SHA-256", contentBytes);
  const sourceHash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Stable artifact identity derived from source bytes plus intake context.
  const artifactId = await deterministicHash(
    `${sourceHash}:${request.source_channel}:${sanitizeFileName(request.source_filename)}`,
  );

  const knownUnknowns: string[] = [];
  if (!request.jurisdiction_context) {
    knownUnknowns.push("jurisdiction_context");
  }
  if (!request.legal_basis) {
    knownUnknowns.push("legal_basis");
  }
  if (!request.purpose_of_processing) {
    knownUnknowns.push("purpose_of_processing");
  }
  if (!request.retention_profile) {
    knownUnknowns.push("retention_profile");
  }

  // 5. Write to R2
  const { r2Key } = await writeIntakeFile(
    env.AURORA_FILES,
    artifactId,
    request.source_filename,
    request.source_mime_type,
    request.file_buffer,
  );

  // 6. Record to D1
  await recordIntake(env.AURORA_DB, {
    artifactId,
    r2Key,
    sourceMimeType: request.source_mime_type,
    sizeBytes: request.file_buffer.byteLength,
    sourceFilename: sanitizeFileName(request.source_filename),
    receivedAt,
    sourceChannel: request.source_channel,
    operatorOrServiceIdentity: request.operator_or_service_identity,
    documentTypeHint: request.document_type_hint,
    jurisdictionContext: request.jurisdiction_context,
    legalBasis: request.legal_basis,
    purposeOfProcessing: request.purpose_of_processing,
    retentionProfile: request.retention_profile,
    intakeState: "ingested",
    knownUnknowns,
    sourceHash,
  });

  // 7. Log ingestion
  log("info", "intake_ingested", {
    event: "intake_ingested",
    artifactId,
    r2Key,
    sourceMimeType: request.source_mime_type,
    sizeBytes: request.file_buffer.byteLength,
    knownUnknowns,
  });

  // 8. Return result
  return {
    artifact_id: artifactId,
    intake_state: "ingested",
    received_at: receivedAt,
    size_bytes: request.file_buffer.byteLength,
    source_hash: sourceHash,
    source_channel: request.source_channel,
    source_filename: request.source_filename,
    source_mime_type: request.source_mime_type,
    operator_or_service_identity: request.operator_or_service_identity,
    document_type_hint: request.document_type_hint,
    jurisdiction_context: request.jurisdiction_context,
    legal_basis: request.legal_basis,
    purpose_of_processing: request.purpose_of_processing,
    retention_profile: request.retention_profile,
    known_unknowns: knownUnknowns,
    storage: {
      r2_key: r2Key,
    },
  };
}
