// Shared lineage types
// Source: Spec 08 — data-lineage-storage-and-recursion

export type AuroraLineageState =
  | "ingested"
  | "processing_incomplete"
  | "review_required"
  | "extracted_ready"
  | "packaged"
  | "handoff_failed"
  | "handoff_succeeded";

export type AuroraReviewState = "pending" | "auto_approved" | "hitl_required";

export type LineageIntegrity = "complete" | "degraded";

export interface ProvenanceRecord {
  recordId: string;
  sourceArtifactRef: string;
  derivedArtifactRef: string;
  transformType: string;
  operatorRef: string;
  timestampIso: string;
}

export interface ArtifactLineageRecord {
  artifactId: string;
  sourceChannel: string;
  sourceFilename: string;
  sourceMimeType: string;
  operatorOrServiceIdentity: string;
  documentTypeHint: string | null;
  jurisdictionContext: string | null;
  legalBasis: string | null;
  purposeOfProcessing: string | null;
  retentionProfile: string | null;
  knownUnknowns: string[];
  sourceHash: string;
  currentState: string;
  currentReviewState: AuroraReviewState;
  latestVersionNo: number;
  latestVersionId: string | null;
  latestRunId: string | null;
  latestPackageId: string | null;
  latestHandoffId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArtifactVersionRecord {
  versionId: string;
  artifactId: string;
  versionNo: number;
  sourceObjectKey: string;
  sourceHash: string;
  sourceFilename: string;
  sourceMimeType: string;
  fileSizeBytes: number;
  createdAt: string;
}

export interface ProcessingRunRecord {
  runId: string;
  artifactId: string;
  artifactVersionId: string;
  parentRunId: string | null;
  stage: string;
  iterationIndex: number;
  triggeredBy: string;
  sourceHash: string;
  documentType: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
}

export interface ControlCheckRecord {
  checkId: string;
  runId: string;
  controlId: string;
  status: "passed" | "failed";
  findingCode: string | null;
  findingDetail: Record<string, unknown> | null;
  triggeredHumanReview: boolean;
  createdAt: string;
}

export interface ReviewDecisionLineageRecord {
  decisionId: string;
  artifactId: string;
  runId: string | null;
  parentDecisionId: string | null;
  reviewRound: number;
  actorType: string;
  actorId: string | null;
  decisionType: string;
  rationale: string | null;
  resultingState: AuroraReviewState;
  createdAt: string;
}

export interface EvidencePackageLineageRecord {
  packageId: string;
  artifactId: string;
  runId: string;
  useCaseId: string;
  sessionRef: string;
  schemaVersion: string;
  packageHash: string;
  lineageRef: string;
  targetSystem: string;
  supersedesPackageId: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface HandoffHistoryRecord {
  eventId: string;
  artifactId: string;
  runId: string;
  packageId: string | null;
  useCaseId: string;
  targetSystem: string;
  targetEndpoint: string;
  eventType: "handoff_attempted" | "handoff_succeeded" | "handoff_failed";
  httpStatus: number | null;
  errorCode: string | null;
  responseBody: unknown;
  createdAt: string;
}

export interface AuditEventRecord {
  eventId: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  eventPayload: Record<string, unknown>;
  createdAt: string;
}

export interface LineageExposedStatus {
  state: AuroraLineageState;
  reviewState: AuroraReviewState;
  lineageIntegrity: LineageIntegrity;
  reasons: string[];
  latestVersionId: string | null;
  latestRunId: string | null;
  latestPackageId: string | null;
  latestHandoffId: string | null;
}

export interface DataLineage {
  lineageId: string;
  artifactId: string;
  artifact: ArtifactLineageRecord | null;
  versions: ArtifactVersionRecord[];
  processingRuns: ProcessingRunRecord[];
  controlChecks: ControlCheckRecord[];
  reviewDecisions: ReviewDecisionLineageRecord[];
  evidencePackages: EvidencePackageLineageRecord[];
  handoffHistory: HandoffHistoryRecord[];
  auditEvents: AuditEventRecord[];
  exposedStatus: LineageExposedStatus;
}

export interface UseCaseLineageRecord {
  useCaseId: string;
  clientId: string | null;
  aiSystemId: string | null;
  name: string;
  purpose: string;
  businessOwner: string;
  businessOwnerConfirmed: boolean;
  systemsInvolved: string[];
  dataCategories: string[];
  automationLevel: string;
  decisionImpact: string | null;
  regulatedDomain: boolean;
  regulatedDomainNotes: string | null;
  scale: string;
  knownUnknowns: string[];
  status: string;
  currentGate: string;
  gates: Record<string, string>;
  gateReasons: Record<string, string[]>;
  currentCycleId: string | null;
  cycleIndex: number;
  latestRiskTier: string | null;
  latestAssessmentId: string | null;
  evidenceCount: number;
  feedbackActionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceCycleLineageRecord {
  cycleId: string;
  useCaseId: string;
  parentCycleId: string | null;
  cycleIndex: number;
  openReason: string;
  status: string;
  openedAt: string;
  closedAt: string | null;
}

export interface GovernanceAssessmentLineageRecord {
  assessmentId: string;
  useCaseId: string;
  cycleId: string;
  parentAssessmentId: string | null;
  triggerType: string;
  riskTier: string;
  dimensionScores: Record<string, number>;
  dimensionRationale: Record<string, string>;
  uncertaintyFields: string[];
  requiredControls: string[];
  requiredDeliverables: string[];
  evidenceCount: number;
  gateStatus: Record<string, string>;
  gateReasons: Record<string, string[]>;
  createdAt: string;
}

export interface FeedbackActionLineageRecord {
  actionId: string;
  useCaseId: string;
  cycleId: string;
  sourceAssessmentId: string | null;
  actionType: string;
  requestedState: string;
  rationale: string;
  status: string;
  createdAt: string;
}

export interface DeliverableLineageRecord {
  deliverableId: string;
  useCaseId: string;
  assessmentId: string;
  cycleId: string;
  deliverableType: string;
  templateId: string;
  policyVersion: string;
  status: string;
  contentHash: string;
  evidenceCitationPayloadIds: string[];
  manualNoteCount: number;
  generatedFrom: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
}

export interface ApprovalRequestLineageRecord {
  requestId: string;
  useCaseId: string;
  assessmentId: string;
  cycleId: string;
  policyVersion: string;
  approvalRecordDeliverableId: string;
  requestedState: string;
  requestedBy: string;
  requestedByRole: string;
  status: string;
  requiredRoles: string[];
  approvalsReceived: string[];
  unmetConditions: string[];
  latestDecisionSummary: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface ApprovalDecisionLineageRecord {
  decisionId: string;
  requestId: string;
  useCaseId: string;
  assessmentId: string;
  actorRole: string;
  actorId: string;
  decision: string;
  notes: string | null;
  overrideReason: string | null;
  createdAt: string;
}

export interface AuroraEvidenceClosureRecord {
  payloadId: string;
  useCaseId: string;
  schemaVersion: string;
  packageHash: string;
  sourceSystem: string;
  targetSystem: string;
  sessionRef: string;
  processingRunId: string;
  lineageRef: string;
  artifactId: string;
  r2Key: string;
  sourceMimeType: string;
  sizeBytes: number;
  receivedAt: string;
  sourceFilename: string;
  sourceHash: string;
  documentType: string;
  evidenceTier: number;
  admissible: boolean;
  reviewStatus: string;
  reviewReason: string | null;
  acceptanceState: "accepted_for_governance" | "rejected_for_governance";
  rejectionReason: string | null;
  emittedAt: string;
  acceptedAt: string | null;
}

export interface CrossSystemEvidenceLinkRecord {
  linkId: string;
  useCaseId: string;
  payloadId: string;
  relationType: string;
  linkedAt: string;
}

export interface CrossSystemClosureExposedStatus {
  state: string;
  currentGate: string;
  lineageIntegrity: LineageIntegrity;
  reasons: string[];
  currentCycleId: string | null;
  latestAssessmentId: string | null;
  latestAcceptedPayloadId: string | null;
  latestAuroraRunId: string | null;
  latestApprovalRequestId: string | null;
}

export interface CrossSystemLineageClosure {
  closureId: string;
  sourceSystem: "AurorA";
  governanceSystem: "COMPASSai";
  aurora: {
    evidencePackages: AuroraEvidenceClosureRecord[];
  };
  compassai: {
    useCase: UseCaseLineageRecord;
    governanceCycles: GovernanceCycleLineageRecord[];
    assessments: GovernanceAssessmentLineageRecord[];
    feedbackActions: FeedbackActionLineageRecord[];
    deliverables: DeliverableLineageRecord[];
    approvalRequests: ApprovalRequestLineageRecord[];
    approvalDecisions: ApprovalDecisionLineageRecord[];
    auditEvents: AuditEventRecord[];
  };
  closure: {
    evidenceLinks: CrossSystemEvidenceLinkRecord[];
    exposedStatus: CrossSystemClosureExposedStatus;
  };
}

export interface AurorADocumentClosureFetchTransport {
  targetSystem: "COMPASSai";
  targetEndpoint: string | null;
  httpStatus: number | null;
  fetchedAt: string | null;
}

export interface AurorADocumentClosureExposedStatus {
  state: "local_only" | "governance_linked" | "governance_unavailable" | "governance_ambiguous";
  lineageIntegrity: LineageIntegrity;
  reasons: string[];
  resolvedUseCaseId: string | null;
  candidateUseCaseIds: string[];
  latestPackageId: string | null;
  latestHandoffId: string | null;
  auroraState: AuroraLineageState;
  governanceState: string | null;
}

export interface AurorADocumentClosureView {
  closureId: string;
  artifactId: string;
  aurora: DataLineage;
  compassai: CrossSystemLineageClosure | null;
  fetchThrough: {
    transport: AurorADocumentClosureFetchTransport;
    exposedStatus: AurorADocumentClosureExposedStatus;
  };
}
