// COMPASSai — deliverable generator and policy gate evaluator
// Source: Spec 07 — compassai-policy-deliverables-and-approval

import { deterministicHashObject } from "../../../../shared/utils/hash";
import type { AssessmentRecord, UseCaseRecord } from "../governance-engine/types";
import { CURRENT_POLICY_VERSION, POLICY_TEMPLATES } from "./templates";
import type {
  ApprovalRole,
  DeliverableRecord,
  DeliverableType,
  EvidenceCitation,
  PolicyEvaluation,
} from "./types";

interface EvidenceRecordInput {
  payloadId: string;
  packageHash: string;
  artifactId: string;
  sourceFilename: string;
  reviewStatus: string;
  evidenceTier: number;
  receivedAtIso: string;
}

export async function buildGovernanceDeliverables(input: {
  useCase: UseCaseRecord;
  assessment: AssessmentRecord;
  evidenceRecords: EvidenceRecordInput[];
  existingDeliverables: DeliverableRecord[];
  policyVersion?: string | undefined;
  nowIso?: string | undefined;
}): Promise<{
  deliverables: DeliverableRecord[];
  newDeliverables: DeliverableRecord[];
  evaluation: PolicyEvaluation;
}> {
  const policyVersion = input.policyVersion ?? CURRENT_POLICY_VERSION;
  const nowIso = input.nowIso ?? new Date().toISOString();
  const requiredDeliverables = expandRequiredDeliverables(input.assessment.requiredDeliverables);
  const currentDeliverables = input.existingDeliverables.filter(
    (record) =>
      record.assessmentId === input.assessment.id &&
      record.policyVersion === policyVersion &&
      record.status !== "superseded",
  );
  const existingTypes = new Set(currentDeliverables.map((record) => record.deliverableType));
  const evidenceCitations = input.evidenceRecords.map(toEvidenceCitation);
  const newDeliverables: DeliverableRecord[] = [];

  for (const deliverableType of requiredDeliverables) {
    if (!existingTypes.has(deliverableType)) {
      newDeliverables.push(
        await generateDeliverableRecord({
          useCase: input.useCase,
          assessment: input.assessment,
          evidenceCitations,
          deliverableType,
          policyVersion,
          nowIso,
        }),
      );
    }
  }

  const deliverables = [...currentDeliverables, ...newDeliverables].sort((left, right) =>
    left.deliverableType.localeCompare(right.deliverableType),
  );
  const evaluation = evaluatePolicyState({
    useCase: input.useCase,
    assessment: input.assessment,
    evidenceCitations,
    deliverables,
    policyVersion,
  });

  return { deliverables, newDeliverables, evaluation };
}

export async function appendDeliverableManualNote(input: {
  deliverable: DeliverableRecord;
  note: string;
  addedBy: string;
  noteType?: "operator_note" | "completion_marker" | undefined;
  addedAtIso?: string | undefined;
}): Promise<DeliverableRecord> {
  const addedAtIso = input.addedAtIso ?? new Date().toISOString();
  const manualNote = {
    noteId: crypto.randomUUID(),
    noteType: input.noteType ?? "operator_note",
    note: input.note,
    addedBy: input.addedBy,
    addedAtIso,
  } satisfies DeliverableRecord["manualNotes"][number];
  const existingOperatorNotes = Array.isArray(input.deliverable.content.operatorNotes)
    ? [...(input.deliverable.content.operatorNotes as unknown[])]
    : [];
  const content = {
    ...input.deliverable.content,
    operatorNotes: [
      ...existingOperatorNotes,
      {
        noteId: manualNote.noteId,
        noteType: manualNote.noteType,
        note: manualNote.note,
        addedBy: manualNote.addedBy,
        addedAtIso: manualNote.addedAtIso,
      },
    ],
  };

  return {
    ...input.deliverable,
    content,
    contentHash: await deterministicHashObject(content),
    manualNotes: [...input.deliverable.manualNotes, manualNote],
    updatedAtIso: addedAtIso,
  };
}

export function evaluatePolicyState(input: {
  useCase: UseCaseRecord;
  assessment?: AssessmentRecord | undefined;
  evidenceCitations: EvidenceCitation[];
  deliverables: DeliverableRecord[];
  approvalRequest?:
    | {
        status: "pending" | "approved" | "rejected" | "overridden";
        unmetConditions: string[];
      }
    | undefined;
  policyVersion?: string | undefined;
}): PolicyEvaluation {
  const policyVersion = input.policyVersion ?? CURRENT_POLICY_VERSION;
  const requiredDeliverables = input.assessment
    ? expandRequiredDeliverables(input.assessment.requiredDeliverables)
    : [];
  const generatedDeliverables = input.deliverables
    .filter((record) => record.policyVersion === policyVersion && record.status !== "superseded")
    .map((record) => record.deliverableType);
  const deliverableSet = new Set(generatedDeliverables);
  const missingDeliverables = requiredDeliverables.filter((item) => !deliverableSet.has(item));
  const rejectedDeliverables = input.deliverables
    .filter((record) => record.policyVersion === policyVersion && record.status === "rejected")
    .map((record) => record.deliverableType);
  const requiredApprovalRoles = input.assessment ? deriveRequiredApprovalRoles(input.assessment.riskTier) : [];

  const gateStatus: Record<string, string> = {
    intake_complete: "complete",
    risk_assessed: input.assessment ? "complete" : "blocked",
    controls_satisfied: "blocked",
    approved_for_deploy: "blocked",
  };
  const gateReasons: Record<string, string[]> = {
    intake_complete: [],
    risk_assessed: input.assessment ? [] : ["No governance assessment is recorded for this use case."],
    controls_satisfied: [],
    approved_for_deploy: [],
  };

  if (!input.assessment) {
    gateReasons.controls_satisfied = ["Controls cannot be satisfied until a governance assessment exists."];
    gateReasons.approved_for_deploy = ["Approval cannot proceed until a governance assessment exists."];
    return {
      policyVersion,
      requiredDeliverables,
      generatedDeliverables,
      unmetConditions: [...gateReasons.risk_assessed, ...gateReasons.controls_satisfied, ...gateReasons.approved_for_deploy],
      gateStatus,
      gateReasons,
      requiredApprovalRoles,
    };
  }

  if (input.evidenceCitations.length === 0) {
    gateReasons.controls_satisfied.push("No accepted evidence packages are linked to this use case.");
  }
  for (const deliverableType of missingDeliverables) {
    gateReasons.controls_satisfied.push(`Missing required deliverable for current policy version: ${deliverableType}.`);
  }
  for (const deliverableType of rejectedDeliverables) {
    gateReasons.controls_satisfied.push(`Required deliverable is in rejected state: ${deliverableType}.`);
  }
  const incompleteOperatorDeliverables = input.deliverables.filter(
    (record) =>
      record.policyVersion === policyVersion &&
      requiredDeliverables.includes(record.deliverableType) &&
      deliverableRequiresOperatorCompletion(record) &&
      !deliverableHasCompletionMarker(record),
  );
  for (const deliverable of incompleteOperatorDeliverables) {
    gateReasons.controls_satisfied.push(
      `Required deliverable still awaits operator completion marker: ${deliverable.deliverableType}.`,
    );
  }

  gateStatus.controls_satisfied = gateReasons.controls_satisfied.length === 0 ? "complete" : "blocked";

  if (!input.approvalRequest) {
    gateReasons.approved_for_deploy = ["No approval request has been submitted."];
  } else if (input.approvalRequest.status === "approved" || input.approvalRequest.status === "overridden") {
    gateStatus.approved_for_deploy = "complete";
    gateReasons.approved_for_deploy = [];
  } else if (input.approvalRequest.status === "pending") {
    gateStatus.approved_for_deploy = "pending";
    gateReasons.approved_for_deploy =
      input.approvalRequest.unmetConditions.length > 0
        ? [...input.approvalRequest.unmetConditions]
        : ["Required approver decisions are still pending."];
  } else {
    gateReasons.approved_for_deploy =
      input.approvalRequest.unmetConditions.length > 0
        ? [...input.approvalRequest.unmetConditions]
        : ["A required approval decision rejected this deployment state."];
  }

  return {
    policyVersion,
    requiredDeliverables,
    generatedDeliverables,
    unmetConditions: [...gateReasons.controls_satisfied, ...gateReasons.approved_for_deploy],
    gateStatus,
    gateReasons,
    requiredApprovalRoles,
  };
}

export function deriveRequiredApprovalRoles(riskTier: AssessmentRecord["riskTier"]): ApprovalRole[] {
  if (riskTier === "T3") {
    return ["governance_admin", "risk_owner", "approver", "independent_reviewer"];
  }
  if (riskTier === "T2") {
    return ["governance_admin", "risk_owner", "approver"];
  }
  return ["governance_admin", "approver"];
}

export function expandRequiredDeliverables(requiredDeliverables: string[]): DeliverableType[] {
  const expanded = new Set<DeliverableType>(["approval_record"]);
  for (const item of requiredDeliverables) {
    expanded.add(item as DeliverableType);
  }
  return Array.from(expanded).sort();
}

export function deliverableRequiresOperatorCompletion(deliverable: Pick<DeliverableRecord, "content">): boolean {
  return deliverable.content.operatorInputRequired === true;
}

export function deliverableHasCompletionMarker(
  deliverable: Pick<DeliverableRecord, "manualNotes">,
): boolean {
  return deliverable.manualNotes.some((note) => note.noteType === "completion_marker");
}

async function generateDeliverableRecord(input: {
  useCase: UseCaseRecord;
  assessment: AssessmentRecord;
  evidenceCitations: EvidenceCitation[];
  deliverableType: DeliverableType;
  policyVersion: string;
  nowIso: string;
}): Promise<DeliverableRecord> {
  const template = POLICY_TEMPLATES[input.deliverableType];
  const content = buildDeliverableContent(input);
  const contentHash = await deterministicHashObject(content);

  return {
    deliverableId: crypto.randomUUID(),
    useCaseId: input.useCase.id,
    assessmentId: input.assessment.id,
    cycleId: input.assessment.cycleId,
    deliverableType: input.deliverableType,
    templateId: template.templateId,
    policyVersion: input.policyVersion,
    status: "draft",
    contentHash,
    content,
    evidenceCitations: input.evidenceCitations,
    manualNotes: [],
    generatedFrom: {
      assessmentId: input.assessment.id,
      cycleId: input.assessment.cycleId,
      riskTier: input.assessment.riskTier,
      evidenceCount: input.assessment.evidenceCount,
    },
    createdAtIso: input.nowIso,
    updatedAtIso: input.nowIso,
    approvedAtIso: undefined,
  };
}

function buildDeliverableContent(input: {
  useCase: UseCaseRecord;
  assessment: AssessmentRecord;
  evidenceCitations: EvidenceCitation[];
  deliverableType: DeliverableType;
  policyVersion: string;
}): Record<string, unknown> {
  const template = POLICY_TEMPLATES[input.deliverableType];
  const baseContent = {
    title: template.title,
    templateId: template.templateId,
    policyVersion: input.policyVersion,
    useCaseId: input.useCase.id,
    assessmentId: input.assessment.id,
    cycleId: input.assessment.cycleId,
    evidenceTrace: input.evidenceCitations,
    evidenceDerivedFacts: {
      riskTier: input.assessment.riskTier,
      evidenceCount: input.assessment.evidenceCount,
      systemsInvolved: input.useCase.systemsInvolved,
      dataCategories: input.useCase.dataCategories,
      knownUnknowns: input.useCase.knownUnknowns,
    },
    operatorNotes: [] as unknown[],
  };

  switch (input.deliverableType) {
    case "use_case_record":
      return {
        ...baseContent,
        summary: `Canonical record for ${input.useCase.name}.`,
        purpose: input.useCase.purpose,
        businessOwner: input.useCase.businessOwner,
        automationLevel: input.useCase.automationLevel,
      };
    case "model_card":
      return {
        ...baseContent,
        summary: "Bounded model card scaffold generated from use-case intake and latest assessment.",
        decisionImpact: input.useCase.decisionImpact ?? "unspecified",
        regulatedDomain: input.useCase.regulatedDomain,
        regulatedDomainNotes: input.useCase.regulatedDomainNotes ?? null,
        uncertaintyFields: input.assessment.uncertaintyFields,
      };
    case "risk_assessment":
      return {
        ...baseContent,
        summary: "Risk posture derived from the latest governance assessment.",
        dimensionScores: input.assessment.dimensionScores,
        dimensionRationale: input.assessment.dimensionRationale,
        requiredControls: input.assessment.requiredControls,
      };
    case "dpia":
      return {
        ...baseContent,
        summary: "DPIA scaffold required because sensitive data handling is in scope.",
        rationale: "Generated from declared data categories and latest governance tiering.",
        operatorInputRequired: true,
      };
    case "monitoring_plan":
      return {
        ...baseContent,
        summary: "Baseline monitoring plan for lower-tier governance review.",
        reviewCadence: "monthly",
        alertThresholds: null,
      };
    case "monitoring_plan_with_alert_thresholds":
      return {
        ...baseContent,
        summary: "Enhanced monitoring plan with alert thresholds for elevated-risk use cases.",
        reviewCadence: "weekly",
        alertThresholds: ["quality_regression", "safety_incident", "distribution_shift"],
      };
    case "approval_record":
      return {
        ...baseContent,
        summary: "Approval workflow record for deployability decisions.",
        requestedState: "approved_for_deploy",
        approvalWorkflow: {
          status: "draft",
          requiredRoles: deriveRequiredApprovalRoles(input.assessment.riskTier),
          approvalsReceived: [],
          latestDecisionSummary: "No approval request has been submitted yet.",
        },
      };
    case "independent_review_report":
      return {
        ...baseContent,
        summary: "Independent review report scaffold required for T3 use cases.",
        operatorInputRequired: true,
      };
    case "red_team_findings":
      return {
        ...baseContent,
        summary: "Red-team findings placeholder required for T3 use cases.",
        operatorInputRequired: true,
      };
    case "recertification_schedule":
      return {
        ...baseContent,
        summary: "Recertification schedule required for elevated governance tiers.",
        nextReviewIntervalDays: input.assessment.riskTier === "T3" ? 90 : 180,
      };
  }
}

function toEvidenceCitation(record: EvidenceRecordInput): EvidenceCitation {
  return {
    payloadId: record.payloadId,
    artifactId: record.artifactId,
    packageHash: record.packageHash,
    sourceFilename: record.sourceFilename,
    reviewStatus: record.reviewStatus,
    evidenceTier: record.evidenceTier,
    receivedAtIso: record.receivedAtIso,
  };
}
