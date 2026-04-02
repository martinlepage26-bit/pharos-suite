// COMPASSai — error classes
// Source: Spec 10 — release-and-operations-guardrails
// TODO: populate per Spec 10 operations guardrails

import { PharosBaseError } from "../../../shared/errors/index";

export class CompassHandoffError extends PharosBaseError {
  constructor(
    code:
      | "INVALID_SOURCE_SYSTEM"
      | "INVALID_TARGET_SYSTEM"
      | "MISSING_USE_CASE_ID"
      | "USE_CASE_NOT_FOUND"
      | "HASH_MISMATCH"
      | "INVALID_PAYLOAD"
      | "D1_WRITE_FAILED",
    context?: Record<string, unknown>,
  ) {
    super(`Compass handoff failed: ${code}`, code, context);
    this.name = "CompassHandoffError";
  }
}

export class CompassGovernanceError extends PharosBaseError {
  constructor(
    code:
      | "USE_CASE_NOT_FOUND"
      | "LATEST_ASSESSMENT_REQUIRED"
      | "INVALID_USE_CASE"
      | "USE_CASE_REQUIRES_BUSINESS_OWNER_CONFIRMATION"
      | "USE_CASE_REQUIRES_SYSTEMS"
      | "USE_CASE_REQUIRES_DATA_CATEGORIES"
      | "USE_CASE_REQUIRES_KNOWN_UNKNOWNS"
      | "D1_WRITE_FAILED",
    context?: Record<string, unknown>,
  ) {
    super(`Compass governance failed: ${code}`, code, context);
    this.name = "CompassGovernanceError";
  }
}

export class CompassApprovalError extends PharosBaseError {
  constructor(
    code:
      | "LATEST_ASSESSMENT_REQUIRED"
      | "DELIVERABLES_NOT_FOUND"
      | "APPROVAL_RECORD_REQUIRED"
      | "APPROVAL_GATES_NOT_SATISFIED"
      | "APPROVAL_REQUEST_NOT_FOUND"
      | "APPROVAL_REQUEST_NOT_PENDING"
      | "INVALID_APPROVAL_ROLE"
      | "APPROVAL_ROLE_NOT_REQUIRED"
      | "APPROVAL_ROLE_ALREADY_DECIDED"
      | "OVERRIDE_REASON_REQUIRED"
      | "OVERRIDE_REQUIRES_GOVERNANCE_ADMIN"
      | "D1_WRITE_FAILED",
    context?: Record<string, unknown>,
  ) {
    super(`Compass approval failed: ${code}`, code, context);
    this.name = "CompassApprovalError";
  }
}
