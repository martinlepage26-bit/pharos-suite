// AurorA — error classes
// Source: Spec 10 — release-and-operations-guardrails

import { PharosBaseError } from "../../../shared/errors/index";

export class IntakeValidationError extends PharosBaseError {
  constructor(
    code: "MIME_NOT_ALLOWED" | "FILE_TOO_LARGE" | "MALFORMED_HEADER" | "MISSING_FIELD",
    public readonly actualValue: string,
    public readonly constraint: string,
  ) {
    super(`Intake validation failed: ${code}`, code, { actualValue, constraint });
    this.name = "IntakeValidationError";
  }
}

export class StorageWriteError extends PharosBaseError {
  constructor(
    code: "R2_WRITE_FAILED" | "D1_WRITE_FAILED",
    public readonly operation: string,
    public readonly underlyingMessage: string,
  ) {
    super(`Storage write failed: ${code} during ${operation}`, code, { operation, underlyingMessage });
    this.name = "StorageWriteError";
  }
}

export class AuroraExtractionError extends PharosBaseError {
  constructor(
    code:
      | "MISSING_DOCUMENT_TYPE"
      | "MISSING_FIELDS"
      | "INVALID_FIELD_VALUE"
      | "INVALID_FIELD_CONFIDENCE",
    context?: Record<string, unknown>,
  ) {
    super(`Aurora extraction failed: ${code}`, code, context);
    this.name = "AuroraExtractionError";
  }
}

export class AuroraHandoffError extends PharosBaseError {
  constructor(
    code:
      | "HANDOFF_REQUIRES_ACCEPTED_INTAKE"
      | "HANDOFF_REQUIRES_USE_CASE_ID"
      | "HANDOFF_REQUIRES_EXTRACTED_EVIDENCE"
      | "HANDOFF_REQUIRES_COMPASS_ENDPOINT"
      | "HANDOFF_INVALID_EXTRACTION_LOG"
      | "HANDOFF_TRANSPORT_FAILED",
    context?: Record<string, unknown>,
  ) {
    super(`Aurora handoff failed: ${code}`, code, context);
    this.name = "AuroraHandoffError";
  }
}
