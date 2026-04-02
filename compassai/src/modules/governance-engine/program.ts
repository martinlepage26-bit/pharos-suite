// COMPASSai — GovernanceProgram runner
// Source: Spec 06 — compassai-governance-engine

import type {
  AssessmentRecord,
  GovernanceCycleRecord,
  ProgramInput,
  ProgramOutput,
  UseCaseCreateInput,
  UseCaseRecord,
} from "./types";

export function defaultUseCaseGates(): Record<string, string> {
  return {
    intake_complete: "complete",
    risk_assessed: "pending",
    controls_satisfied: "blocked",
    approved_for_deploy: "blocked",
  };
}

export function defaultUseCaseGateReasons(): Record<string, string[]> {
  return {
    intake_complete: [],
    risk_assessed: ["Risk assessment has not been run yet."],
    controls_satisfied: ["Accepted evidence and generated deliverables are required before controls can be satisfied."],
    approved_for_deploy: ["An approval request and role-based approval decisions are still required."],
  };
}

export function buildUseCaseRecord(input: UseCaseCreateInput, nowIso: string = new Date().toISOString()): UseCaseRecord {
  return {
    id: crypto.randomUUID(),
    ...input,
    scale: input.scale ?? "limited",
    status: "intake_complete",
    currentGate: "intake_complete",
    gates: defaultUseCaseGates(),
    gateReasons: defaultUseCaseGateReasons(),
    currentCycleId: undefined,
    cycleIndex: 0,
    latestRiskTier: undefined,
    latestAssessmentId: undefined,
    evidenceCount: 0,
    feedbackActionCount: 0,
    createdAtIso: nowIso,
    updatedAtIso: nowIso,
  };
}

export function buildGovernanceCycle(
  useCase: Pick<UseCaseRecord, "id" | "cycleIndex">,
  options: {
    openReason: string;
    parentCycleId?: string | undefined;
    nowIso?: string | undefined;
  },
): GovernanceCycleRecord {
  const nowIso = options.nowIso ?? new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    useCaseId: useCase.id,
    parentCycleId: options.parentCycleId,
    cycleIndex: useCase.cycleIndex + 1,
    openReason: options.openReason,
    status: "open",
    openedAtIso: nowIso,
    closedAtIso: undefined,
  };
}

export async function runGovernanceProgram(input: ProgramInput): Promise<ProgramOutput> {
  const riskResult = assessUseCaseRisk(input.useCase);
  const acceptedEvidence = input.evidenceRecords.filter((record) => record.acceptanceState === "accepted_for_governance");
  const requiredControls = deriveRequiredControls(riskResult.riskTier, input.useCase, acceptedEvidence);
  const requiredDeliverables = deriveRequiredDeliverables(riskResult.riskTier, input.useCase);

  const gateStatus = {
    ...input.useCase.gates,
    risk_assessed: "complete",
    controls_satisfied: acceptedEvidence.length > 0 ? "pending" : "blocked",
    approved_for_deploy: "blocked",
  };
  const gateReasons = {
    intake_complete: [],
    risk_assessed: [],
    controls_satisfied:
      acceptedEvidence.length > 0
        ? ["Generate current-policy deliverables for this assessment before moving to approval."]
        : ["No accepted evidence packages are linked to this use case."],
    approved_for_deploy: ["Submit an approval request after controls are satisfied."],
  };

  return {
    programId: input.programId,
    status:
      acceptedEvidence.length > 0 &&
      riskResult.uncertaintyFields.length === 0 &&
      (riskResult.riskTier === "T0" || riskResult.riskTier === "T1")
        ? "ready_with_bounded_gaps"
        : "blocked_not_ready",
    riskTier: riskResult.riskTier,
    dimensionScores: riskResult.dimensionScores,
    dimensionRationale: riskResult.dimensionRationale,
    uncertaintyFields: riskResult.uncertaintyFields,
    requiredControls,
    requiredDeliverables,
    evidenceCount: acceptedEvidence.length,
    gateStatus,
    gateReasons,
    auditTrailRef: `${input.useCase.id}:${input.programId}:risk_assessed`,
    completedAtIso: input.governanceContext.timestampIso,
  };
}

export function createAssessmentRecord(
  input: {
    useCaseId: string;
    cycleId: string;
    priorAssessmentId?: string | undefined;
    triggerType: AssessmentRecord["triggerType"];
    riskTier: AssessmentRecord["riskTier"];
    dimensionScores: Record<string, number>;
    dimensionRationale: Record<string, string>;
    uncertaintyFields: string[];
    requiredControls: string[];
    requiredDeliverables: string[];
    evidenceCount: number;
    gateStatus: Record<string, string>;
    gateReasons: Record<string, string[]>;
    createdAtIso: string;
  },
): AssessmentRecord {
  return {
    id: crypto.randomUUID(),
    useCaseId: input.useCaseId,
    cycleId: input.cycleId,
    parentAssessmentId: input.priorAssessmentId,
    triggerType: input.triggerType,
    riskTier: input.riskTier,
    dimensionScores: input.dimensionScores,
    dimensionRationale: input.dimensionRationale,
    uncertaintyFields: input.uncertaintyFields,
    requiredControls: input.requiredControls,
    requiredDeliverables: input.requiredDeliverables,
    evidenceCount: input.evidenceCount,
    gateStatus: input.gateStatus,
    gateReasons: input.gateReasons,
    createdAtIso: input.createdAtIso,
  };
}

function inferDataSensitivity(dataCategories: string[]): { score: number; rationale: string } {
  const lowered = dataCategories.map((item) => item.toLowerCase());
  if (lowered.some((item) => item.includes("biometric") || item.includes("genetic"))) {
    return { score: 3, rationale: "Biometric or similarly sensitive data is in scope." };
  }
  if (
    lowered.some((item) =>
      ["phi", "health", "medical", "financial", "bank", "ssn", "government id"].some((token) => item.includes(token)),
    )
  ) {
    return { score: 2, rationale: "Significant sensitive data is in scope." };
  }
  if (
    lowered.some((item) =>
      ["pii", "personal", "contact", "email", "phone", "employee"].some((token) => item.includes(token)),
    )
  ) {
    return { score: 1, rationale: "Limited personal data is in scope." };
  }
  return { score: 0, rationale: "No sensitive data categories were declared." };
}

function inferDecisionImpact(decisionImpact?: string | undefined, automationLevel?: string | undefined): {
  score: number;
  rationale: string;
} {
  const descriptor = `${decisionImpact ?? ""} ${automationLevel ?? ""}`.trim().toLowerCase();
  if (
    ["consequential", "termination", "credit", "benefits", "law enforcement", "fully automated"].some((token) =>
      descriptor.includes(token),
    )
  ) {
    return { score: 3, rationale: "Consequential or fully automated decision-making is in scope." };
  }
  if (["automated", "high impact", "decisioning", "production decision"].some((token) => descriptor.includes(token))) {
    return { score: 2, rationale: "Automated or high-impact decision logic is in scope." };
  }
  if (["assistive", "recommend", "human-in-the-loop", "advisory"].some((token) => descriptor.includes(token))) {
    return { score: 1, rationale: "Assistive or human-in-the-loop decision support is in scope." };
  }
  if (["informational", "informative", "reference only"].some((token) => descriptor.includes(token))) {
    return { score: 0, rationale: "Decision output is limited to informational support." };
  }
  return { score: 1, rationale: "Decision impact is underspecified, so the use case is treated conservatively." };
}

function inferRegulatedDomain(regulatedDomain: boolean, notes?: string | undefined): { score: number; rationale: string } {
  const noteText = (notes ?? "").toLowerCase();
  if (
    regulatedDomain &&
    ["high-risk", "medical device", "employment", "credit", "biometric", "law enforcement"].some((token) =>
      noteText.includes(token),
    )
  ) {
    return { score: 3, rationale: "The use case is declared in a strict or high-risk regulated domain." };
  }
  if (regulatedDomain) {
    return { score: 2, rationale: "The use case is declared in a regulated domain." };
  }
  return { score: 0, rationale: "No regulated domain flag was declared." };
}

function inferScale(scale?: string | undefined): { score: number; rationale: string } {
  const normalized = (scale ?? "").trim().toLowerCase();
  if (["limited", "pilot", "sandbox"].includes(normalized)) {
    return { score: 0, rationale: "Scale is limited." };
  }
  if (["team", "department", "internal"].includes(normalized)) {
    return { score: 1, rationale: "Scale is moderate." };
  }
  if (["business-unit", "business_unit", "enterprise", "regional"].includes(normalized)) {
    return { score: 2, rationale: "Scale is broad enough to increase governance exposure." };
  }
  if (["public", "consumer", "population", "mass"].includes(normalized)) {
    return { score: 3, rationale: "Scale is public or population-level." };
  }
  return { score: 1, rationale: "Scale is underspecified, so the use case is treated conservatively." };
}

function collectRiskUncertainties(useCase: UseCaseRecord): string[] {
  const uncertaintyFields: string[] = [];
  const dataCategories = useCase.dataCategories.map((item) => item.toLowerCase());
  const decisionDescriptor = `${useCase.decisionImpact ?? ""} ${useCase.automationLevel}`.trim().toLowerCase();
  const scale = (useCase.scale ?? "").trim().toLowerCase();

  if (
    dataCategories.length === 0 ||
    dataCategories.some((item) => ["unknown", "tbd", "undetermined"].some((token) => item.includes(token)))
  ) {
    uncertaintyFields.push("data_categories");
  }
  if (!decisionDescriptor || ["unknown", "tbd", "undetermined"].some((token) => decisionDescriptor.includes(token))) {
    uncertaintyFields.push("decision_impact");
  }
  if (!scale || ["unknown", "tbd", "undetermined"].includes(scale)) {
    uncertaintyFields.push("scale");
  }
  return uncertaintyFields;
}

export function deriveRequiredControls(
  riskTier: AssessmentRecord["riskTier"],
  useCase: UseCaseRecord,
  evidenceRecords: ProgramInput["evidenceRecords"],
): string[] {
  const controlsByTier: Record<AssessmentRecord["riskTier"], string[]> = {
    T0: ["use_case_registry_entry", "basic_logging", "named_business_owner", "periodic_review_schedule"],
    T1: [
      "use_case_registry_entry",
      "basic_logging",
      "named_business_owner",
      "periodic_review_schedule",
      "rbac",
      "audit_logging",
      "monthly_monitoring_review",
    ],
    T2: [
      "use_case_registry_entry",
      "basic_logging",
      "named_business_owner",
      "periodic_review_schedule",
      "rbac",
      "audit_logging",
      "risk_assessment",
      "hitl_for_low_confidence_outputs",
      "enhanced_monitoring_with_alerting",
      "approval_record",
    ],
    T3: [
      "use_case_registry_entry",
      "basic_logging",
      "named_business_owner",
      "periodic_review_schedule",
      "rbac",
      "audit_logging",
      "risk_assessment",
      "hitl_for_low_confidence_outputs",
      "enhanced_monitoring_with_alerting",
      "approval_record",
      "independent_review",
      "red_team_assessment",
      "named_approvers_by_role",
      "recertification_schedule",
    ],
  };

  const controls = [...controlsByTier[riskTier]];
  const categories = useCase.dataCategories.join(" ").toLowerCase();
  if (["pii", "personal", "health", "medical", "financial", "biometric"].some((token) => categories.includes(token))) {
    controls.push("retention_policy_documented");
  }
  if (["T2", "T3"].includes(riskTier) && evidenceRecords.some((record) => record.payload.reviewStatus === "hitl_required")) {
    controls.push("hitl_validation_workflow");
  }
  return Array.from(new Set(controls)).sort();
}

export function deriveRequiredDeliverables(
  riskTier: AssessmentRecord["riskTier"],
  useCase: UseCaseRecord,
): string[] {
  const deliverablesByTier: Record<AssessmentRecord["riskTier"], string[]> = {
    T0: ["use_case_record"],
    T1: ["use_case_record", "model_card", "monitoring_plan"],
    T2: [
      "use_case_record",
      "model_card",
      "risk_assessment",
      "dpia",
      "monitoring_plan_with_alert_thresholds",
      "approval_record",
    ],
    T3: [
      "use_case_record",
      "model_card",
      "risk_assessment",
      "dpia",
      "monitoring_plan_with_alert_thresholds",
      "approval_record",
      "independent_review_report",
      "red_team_findings",
      "recertification_schedule",
    ],
  };
  let deliverables = [...deliverablesByTier[riskTier]];
  const categories = useCase.dataCategories.join(" ").toLowerCase();
  if (
    ["T2", "T3"].includes(riskTier) &&
    !["pii", "personal", "health", "medical", "financial", "biometric"].some((token) => categories.includes(token))
  ) {
    deliverables = deliverables.filter((item) => item !== "dpia");
  }
  return deliverables;
}

export function assessUseCaseRisk(useCase: UseCaseRecord): {
  riskTier: AssessmentRecord["riskTier"];
  dimensionScores: Record<string, number>;
  dimensionRationale: Record<string, string>;
  uncertaintyFields: string[];
} {
  const data = inferDataSensitivity(useCase.dataCategories);
  const impact = inferDecisionImpact(useCase.decisionImpact, useCase.automationLevel);
  const regulated = inferRegulatedDomain(useCase.regulatedDomain, useCase.regulatedDomainNotes);
  const scale = inferScale(useCase.scale);

  const dimensionScores = {
    data_sensitivity: data.score,
    decision_impact: impact.score,
    regulated_domain: regulated.score,
    scale: scale.score,
  };
  const dimensionRationale = {
    data_sensitivity: data.rationale,
    decision_impact: impact.rationale,
    regulated_domain: regulated.rationale,
    scale: scale.rationale,
  };
  const uncertaintyFields = collectRiskUncertainties(useCase);
  const baseTier = Math.max(...Object.values(dimensionScores));
  const finalTierScore = uncertaintyFields.length > 0 ? Math.min(3, baseTier + 1) : baseTier;

  return {
    riskTier: `T${finalTierScore}` as AssessmentRecord["riskTier"],
    dimensionScores,
    dimensionRationale,
    uncertaintyFields,
  };
}
