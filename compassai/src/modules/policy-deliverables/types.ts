// COMPASSai — policy deliverable types
// Source: Spec 07 — compassai-policy-deliverables-and-approval

export type DeliverableType =
  | "use_case_record"
  | "model_card"
  | "risk_assessment"
  | "dpia"
  | "monitoring_plan"
  | "monitoring_plan_with_alert_thresholds"
  | "approval_record"
  | "independent_review_report"
  | "red_team_findings"
  | "recertification_schedule";

export type DeliverableStatus = "draft" | "pending_approval" | "approved" | "rejected" | "superseded";

export type ApprovalRole = "governance_admin" | "risk_owner" | "approver" | "independent_reviewer";

export interface EvidenceCitation {
  payloadId: string;
  artifactId: string;
  packageHash: string;
  sourceFilename: string;
  reviewStatus: string;
  evidenceTier: number;
  receivedAtIso: string;
}

export interface DeliverableManualNote {
  noteId: string;
  noteType: "operator_note" | "completion_marker";
  note: string;
  addedBy: string;
  addedAtIso: string;
}

export interface DeliverableRecord {
  deliverableId: string;
  useCaseId: string;
  assessmentId: string;
  cycleId: string;
  deliverableType: DeliverableType;
  templateId: string;
  policyVersion: string;
  status: DeliverableStatus;
  contentHash: string;
  content: Record<string, unknown>;
  evidenceCitations: EvidenceCitation[];
  manualNotes: DeliverableManualNote[];
  generatedFrom: {
    assessmentId: string;
    cycleId: string;
    riskTier: string;
    evidenceCount: number;
  };
  createdAtIso: string;
  updatedAtIso: string;
  approvedAtIso?: string | undefined;
}

export interface PolicyEvaluation {
  policyVersion: string;
  requiredDeliverables: DeliverableType[];
  generatedDeliverables: DeliverableType[];
  unmetConditions: string[];
  gateStatus: Record<string, string>;
  gateReasons: Record<string, string[]>;
  requiredApprovalRoles: ApprovalRole[];
}
