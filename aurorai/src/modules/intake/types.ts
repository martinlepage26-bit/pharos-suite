// AurorA — Intake Module Types
// Source: Spec 03 — aurora-file-intake-module

export interface IntakeRequest {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  fileContent: ArrayBuffer;
  metadata?: Record<string, string>;
}

export interface IntakeResult {
  accepted: boolean;
  intakeId: string;
  errors: string[];
  // TODO: expand per Spec 03 validation requirements
}
