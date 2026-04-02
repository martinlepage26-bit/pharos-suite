// COMPASSai — approval workflow helpers
// Source: Spec 07 — compassai-policy-deliverables-and-approval §approval

import { deterministicHashObject } from "../../../../shared/utils/hash";
import { CompassApprovalError } from "../../lib/errors";
import type { AssessmentRecord, UseCaseRecord } from "../governance-engine/types";
import type { ApprovalRole, DeliverableRecord, PolicyEvaluation } from "../policy-deliverables/types";
import type {
  ApprovalDecisionInput,
  ApprovalDecisionRecord,
  ApprovalRequestRecord,
  ApprovalTransitionResult,
} from "./types";

export function createApprovalRequest(input: {
  useCase: UseCaseRecord;
  assessment: AssessmentRecord;
  approvalRecord: DeliverableRecord;
  requestedBy: string;
  requestedByRole: ApprovalRole;
  evaluation: PolicyEvaluation;
  existingPendingRequest?: ApprovalRequestRecord | undefined;
  nowIso?: string | undefined;
}): ApprovalRequestRecord {
  if (input.evaluation.gateStatus.controls_satisfied !== "complete") {
    throw new CompassApprovalError("APPROVAL_GATES_NOT_SATISFIED", {
      useCaseId: input.useCase.id,
      unmetConditions: input.evaluation.gateReasons.controls_satisfied,
    });
  }

  if (
    input.existingPendingRequest &&
    input.existingPendingRequest.status === "pending" &&
    input.existingPendingRequest.assessmentId === input.assessment.id &&
    input.existingPendingRequest.policyVersion === input.evaluation.policyVersion
  ) {
    return input.existingPendingRequest;
  }

  const nowIso = input.nowIso ?? new Date().toISOString();
  return {
    requestId: crypto.randomUUID(),
    useCaseId: input.useCase.id,
    assessmentId: input.assessment.id,
    cycleId: input.assessment.cycleId,
    policyVersion: input.evaluation.policyVersion,
    approvalRecordDeliverableId: input.approvalRecord.deliverableId,
    requestedState: "approved_for_deploy",
    requestedBy: input.requestedBy,
    requestedByRole: input.requestedByRole,
    status: "pending",
    requiredRoles: input.evaluation.requiredApprovalRoles,
    approvalsReceived: [],
    unmetConditions: input.evaluation.requiredApprovalRoles.map((role) => `Awaiting approval from role: ${role}.`),
    latestDecisionSummary: `Approval request submitted by ${input.requestedByRole}.`,
    createdAtIso: nowIso,
    updatedAtIso: nowIso,
    resolvedAtIso: undefined,
  };
}

export async function applyApprovalDecision(input: {
  useCase: UseCaseRecord;
  assessment: AssessmentRecord;
  approvalRequest: ApprovalRequestRecord;
  approvalRecord: DeliverableRecord;
  existingDecisions: ApprovalDecisionRecord[];
  decisionInput: ApprovalDecisionInput;
}): Promise<ApprovalTransitionResult> {
  if (input.approvalRequest.status !== "pending") {
    throw new CompassApprovalError("APPROVAL_REQUEST_NOT_PENDING", {
      requestId: input.approvalRequest.requestId,
      status: input.approvalRequest.status,
    });
  }

  const decisionAtIso = input.decisionInput.decidedAtIso ?? new Date().toISOString();

  if (input.decisionInput.decision === "override_approved") {
    if (!input.decisionInput.overrideReason) {
      throw new CompassApprovalError("OVERRIDE_REASON_REQUIRED", {
        requestId: input.approvalRequest.requestId,
      });
    }
    if (input.decisionInput.actorRole !== "governance_admin") {
      throw new CompassApprovalError("OVERRIDE_REQUIRES_GOVERNANCE_ADMIN", {
        requestId: input.approvalRequest.requestId,
        actorRole: input.decisionInput.actorRole,
      });
    }
  } else if (!input.approvalRequest.requiredRoles.includes(input.decisionInput.actorRole)) {
    throw new CompassApprovalError("APPROVAL_ROLE_NOT_REQUIRED", {
      requestId: input.approvalRequest.requestId,
      actorRole: input.decisionInput.actorRole,
    });
  }

  if (input.existingDecisions.some((decision) => decision.actorRole === input.decisionInput.actorRole)) {
    throw new CompassApprovalError("APPROVAL_ROLE_ALREADY_DECIDED", {
      requestId: input.approvalRequest.requestId,
      actorRole: input.decisionInput.actorRole,
    });
  }

  const approvalDecision: ApprovalDecisionRecord = {
    decisionId: crypto.randomUUID(),
    requestId: input.approvalRequest.requestId,
    useCaseId: input.useCase.id,
    assessmentId: input.assessment.id,
    actorRole: input.decisionInput.actorRole,
    actorId: input.decisionInput.decidedBy,
    decision: input.decisionInput.decision,
    notes: input.decisionInput.notes,
    overrideReason: input.decisionInput.overrideReason,
    createdAtIso: decisionAtIso,
  };

  const approvalsReceived = new Set(input.approvalRequest.approvalsReceived);
  if (approvalDecision.decision === "approved") {
    approvalsReceived.add(approvalDecision.actorRole);
  }
  if (approvalDecision.decision === "override_approved") {
    input.approvalRequest.requiredRoles.forEach((role) => approvalsReceived.add(role));
  }

  let status: ApprovalRequestRecord["status"] = "pending";
  let unmetConditions: string[] = [];
  let latestDecisionSummary = `${approvalDecision.actorRole} recorded ${approvalDecision.decision}.`;

  if (approvalDecision.decision === "rejected") {
    status = "rejected";
    unmetConditions = [
      `Rejected by role ${approvalDecision.actorRole}: ${approvalDecision.notes ?? "No rejection rationale was provided."}`,
    ];
    latestDecisionSummary = unmetConditions[0] ?? latestDecisionSummary;
  } else if (approvalDecision.decision === "override_approved") {
    status = "overridden";
    latestDecisionSummary = `Governance admin override approved deployment: ${approvalDecision.overrideReason}.`;
  } else {
    const approvedRoles = Array.from(approvalsReceived);
    const remainingRoles = input.approvalRequest.requiredRoles.filter((role) => !approvedRoles.includes(role));
    if (remainingRoles.length === 0) {
      status = "approved";
      latestDecisionSummary = `All required roles approved deployment: ${approvedRoles.join(", ")}.`;
    } else {
      unmetConditions = remainingRoles.map((role) => `Awaiting approval from role: ${role}.`);
      latestDecisionSummary = `Approval received from ${approvalDecision.actorRole}; waiting on ${remainingRoles.join(", ")}.`;
    }
  }

  const nextRequest: ApprovalRequestRecord = {
    ...input.approvalRequest,
    status,
    approvalsReceived: Array.from(approvalsReceived).sort(),
    unmetConditions,
    latestDecisionSummary,
    updatedAtIso: decisionAtIso,
    resolvedAtIso: status === "pending" ? undefined : decisionAtIso,
  };

  const decisionHistory = [...input.existingDecisions, approvalDecision].map((decision) => ({
    actorRole: decision.actorRole,
    actorId: decision.actorId,
    decision: decision.decision,
    notes: decision.notes ?? null,
    overrideReason: decision.overrideReason ?? null,
    createdAtIso: decision.createdAtIso,
  }));

  const approvalRecordContent = {
    ...input.approvalRecord.content,
    approvalWorkflow: {
      requestId: nextRequest.requestId,
      status: nextRequest.status,
      requiredRoles: nextRequest.requiredRoles,
      approvalsReceived: nextRequest.approvalsReceived,
      latestDecisionSummary: nextRequest.latestDecisionSummary,
      decisions: decisionHistory,
    },
  };

  const approvalRecord: DeliverableRecord = {
    ...input.approvalRecord,
    status:
      nextRequest.status === "approved" || nextRequest.status === "overridden"
        ? "approved"
        : nextRequest.status === "rejected"
          ? "rejected"
          : "pending_approval",
    content: approvalRecordContent,
    contentHash: await deterministicHashObject(approvalRecordContent),
    updatedAtIso: decisionAtIso,
    approvedAtIso:
      nextRequest.status === "approved" || nextRequest.status === "overridden" ? decisionAtIso : undefined,
  };

  return {
    approvalRequest: nextRequest,
    approvalDecision,
    approvalRecord,
  };
}
