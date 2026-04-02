// COMPASSai — approval workflow types
// Source: Spec 07 — compassai-policy-deliverables-and-approval §approval

import type { ApprovalRole, DeliverableRecord } from "../policy-deliverables/types";

export type ApprovalDecision = "approved" | "rejected" | "override_approved";
export type ApprovalRequestStatus = "pending" | "approved" | "rejected" | "overridden";

export interface ApprovalRequestRecord {
  requestId: string;
  useCaseId: string;
  assessmentId: string;
  cycleId: string;
  policyVersion: string;
  approvalRecordDeliverableId: string;
  requestedState: "approved_for_deploy";
  requestedBy: string;
  requestedByRole: ApprovalRole;
  status: ApprovalRequestStatus;
  requiredRoles: ApprovalRole[];
  approvalsReceived: ApprovalRole[];
  unmetConditions: string[];
  latestDecisionSummary: string;
  createdAtIso: string;
  updatedAtIso: string;
  resolvedAtIso?: string | undefined;
}

export interface ApprovalDecisionInput {
  decidedBy: string;
  actorRole: ApprovalRole;
  decision: ApprovalDecision;
  notes?: string | undefined;
  overrideReason?: string | undefined;
  decidedAtIso?: string | undefined;
}

export interface ApprovalDecisionRecord {
  decisionId: string;
  requestId: string;
  useCaseId: string;
  assessmentId: string;
  actorRole: ApprovalRole;
  actorId: string;
  decision: ApprovalDecision;
  notes?: string | undefined;
  overrideReason?: string | undefined;
  createdAtIso: string;
}

export interface ApprovalTransitionResult {
  approvalRequest: ApprovalRequestRecord;
  approvalDecision: ApprovalDecisionRecord;
  approvalRecord: DeliverableRecord;
}
