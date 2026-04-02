// Aurora — file intake types
// Source: Spec 03 and freeze doc 00a

export interface IntakeRequest {
  file_buffer: ArrayBuffer;
  source_filename: string;
  source_mime_type: string;
  source_channel: string;
  operator_or_service_identity: string;
  document_type_hint?: string | undefined;
  jurisdiction_context?: string | undefined;
  legal_basis?: string | undefined;
  purpose_of_processing?: string | undefined;
  retention_profile?: string | undefined;
}

export type IntakeState =
  | "received"
  | "ingested"
  | "quarantined"
  | "classified_ready"
  | "rejected";

interface IntakeResultBase {
  artifact_id: string | null;
  intake_state: IntakeState;
  received_at: string;
  size_bytes: number;
  source_channel: string;
  source_filename: string;
  source_mime_type: string;
  operator_or_service_identity: string;
  document_type_hint?: string | undefined;
  jurisdiction_context?: string | undefined;
  legal_basis?: string | undefined;
  purpose_of_processing?: string | undefined;
  retention_profile?: string | undefined;
  known_unknowns: string[];
}

export interface IntakeAcceptedResult extends IntakeResultBase {
  artifact_id: string;
  intake_state: "ingested";
  source_hash: string;
  storage: {
    r2_key: string;
  };
}

export interface IntakeRejectedResult extends IntakeResultBase {
  artifact_id: null;
  intake_state: "rejected";
  rejection_reason: string;
}

export type IntakeResult = IntakeAcceptedResult | IntakeRejectedResult;
