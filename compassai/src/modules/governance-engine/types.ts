// COMPASSai — governance engine types
// Source: Spec 06 — compassai-governance-engine

import type { GovernanceContext, GovernanceStatus } from "../../../../shared/types/governance-foundation";
import type { HandoffPayload } from "../handoff/types";

export interface UseCaseCreateInput {
  name: string;
  purpose: string;
  businessOwner: string;
  businessOwnerConfirmed: boolean;
  systemsInvolved: string[];
  dataCategories: string[];
  automationLevel: string;
  decisionImpact?: string | undefined;
  regulatedDomain: boolean;
  regulatedDomainNotes?: string | undefined;
  scale?: string | undefined;
  knownUnknowns: string[];
  clientId?: string | undefined;
  aiSystemId?: string | undefined;
}

export interface UseCaseRecord extends UseCaseCreateInput {
  id: string;
  status: string;
  currentGate: string;
  gates: Record<string, string>;
  gateReasons: Record<string, string[]>;
  currentCycleId?: string | undefined;
  cycleIndex: number;
  latestRiskTier?: string | undefined;
  latestAssessmentId?: string | undefined;
  evidenceCount: number;
  feedbackActionCount: number;
  createdAtIso: string;
  updatedAtIso: string;
}

export interface GovernanceCycleRecord {
  id: string;
  useCaseId: string;
  parentCycleId?: string | undefined;
  cycleIndex: number;
  openReason: string;
  status: "open" | "superseded";
  openedAtIso: string;
  closedAtIso?: string | undefined;
}

export interface AssessmentRecord {
  id: string;
  useCaseId: string;
  cycleId: string;
  parentAssessmentId?: string | undefined;
  triggerType: "initial_assessment" | "reassessment";
  riskTier: "T0" | "T1" | "T2" | "T3";
  dimensionScores: Record<string, number>;
  dimensionRationale: Record<string, string>;
  uncertaintyFields: string[];
  requiredControls: string[];
  requiredDeliverables: string[];
  evidenceCount: number;
  gateStatus: Record<string, string>;
  gateReasons: Record<string, string[]>;
  createdAtIso: string;
}

export interface AuditTrailEntry {
  eventId: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  eventPayload: Record<string, unknown>;
  createdAt: string;
}

export interface FeedbackActionRecord {
  id: string;
  useCaseId: string;
  cycleId: string;
  sourceAssessmentId?: string | undefined;
  actionType: string;
  requestedState: string;
  rationale: string;
  status: "open";
  createdAtIso: string;
}

export interface ProgramInput {
  useCase: UseCaseRecord;
  evidenceRecords: Array<{
    payload: HandoffPayload;
    createdAt: string;
    acceptanceState: "accepted_for_governance" | "rejected_for_governance";
  }>;
  priorAssessment?: AssessmentRecord | undefined;
  governanceContext: GovernanceContext;
  programId: string;
}

export interface ProgramOutput {
  programId: string;
  status: GovernanceStatus;
  riskTier: AssessmentRecord["riskTier"];
  dimensionScores: Record<string, number>;
  dimensionRationale: Record<string, string>;
  uncertaintyFields: string[];
  requiredControls: string[];
  requiredDeliverables: string[];
  evidenceCount: number;
  gateStatus: Record<string, string>;
  gateReasons: Record<string, string[]>;
  auditTrailRef: string;
  completedAtIso: string;
}
