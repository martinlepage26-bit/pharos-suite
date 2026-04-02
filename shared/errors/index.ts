// Base error hierarchy for PHAROS Suite
// TODO: extend per Spec 10 release guardrails

export class PharosBaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "PharosBaseError";
  }
}

export class GovernanceViolationError extends PharosBaseError {
  // TODO: populate in Module 06 governance engine build
}

export class EvidenceAdmissibilityError extends PharosBaseError {
  // TODO: populate in Module 04 extraction controls build
}
