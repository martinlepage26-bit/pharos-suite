// COMPASSai — bounded D1 governance bindings
// Source: Spec 05 — cross-system-evidence-handoff, Spec 06 — governance engine, Spec 07 — policy deliverables

import { deterministicHashObject } from "../../../shared/utils/hash";
import type {
  ApprovalDecisionLineageRecord,
  ApprovalRequestLineageRecord,
  AuroraEvidenceClosureRecord,
  CrossSystemClosureExposedStatus,
  CrossSystemEvidenceLinkRecord,
  CrossSystemLineageClosure,
  DeliverableLineageRecord,
  FeedbackActionLineageRecord,
  GovernanceAssessmentLineageRecord,
  GovernanceCycleLineageRecord,
  LineageIntegrity,
  UseCaseLineageRecord,
} from "../../../shared/types/lineage";
import { CompassApprovalError, CompassGovernanceError, CompassHandoffError } from "../lib/errors";
import type {
  ApprovalDecisionRecord,
  ApprovalRequestRecord,
} from "../modules/approval/types";
import type {
  AssessmentRecord,
  AuditTrailEntry,
  FeedbackActionRecord,
  GovernanceCycleRecord,
  UseCaseRecord,
} from "../modules/governance-engine/types";
import type { HandoffPayload } from "../modules/handoff/types";
import type { DeliverableRecord } from "../modules/policy-deliverables/types";

export interface CompassEvidencePackageRecord {
  payload_id: string;
  use_case_id: string;
  schema_version: string;
  package_hash: string;
  source_system: string;
  target_system: string;
  session_ref: string;
  processing_run_id: string;
  lineage_ref: string;
  artifact_id: string;
  r2_key: string;
  source_mime_type: string;
  size_bytes: number;
  received_at: string;
  source_filename: string;
  source_hash: string;
  document_type: string;
  evidence_tier: number;
  admissible: number;
  review_status: string;
  review_reason: string | null;
  acceptance_state: "accepted_for_governance" | "rejected_for_governance";
  rejection_reason: string | null;
  payload_json: string;
  created_at: string;
  accepted_at: string | null;
}

interface UseCaseRow {
  use_case_id: string;
  client_id: string | null;
  ai_system_id: string | null;
  name: string;
  purpose: string;
  business_owner: string;
  business_owner_confirmed: number;
  systems_involved_json: string;
  data_categories_json: string;
  automation_level: string;
  decision_impact: string | null;
  regulated_domain: number;
  regulated_domain_notes: string | null;
  scale: string;
  known_unknowns_json: string;
  status: string;
  current_gate: string;
  gates_json: string;
  gate_reasons_json: string;
  current_cycle_id: string | null;
  cycle_index: number;
  latest_risk_tier: string | null;
  latest_assessment_id: string | null;
  evidence_count: number;
  feedback_action_count: number;
  created_at: string;
  updated_at: string;
}

interface GovernanceCycleRow {
  cycle_id: string;
  use_case_id: string;
  parent_cycle_id: string | null;
  cycle_index: number;
  open_reason: string;
  status: string;
  opened_at: string;
  closed_at: string | null;
}

interface AssessmentRow {
  assessment_id: string;
  use_case_id: string;
  cycle_id: string;
  parent_assessment_id: string | null;
  trigger_type: string;
  risk_tier: string;
  dimension_scores_json: string;
  dimension_rationale_json: string;
  uncertainty_fields_json: string;
  evidence_count: number;
  gate_status_json: string;
  gate_reasons_json: string;
  created_at: string;
}

interface AssessmentControlRow {
  row_id: string;
  assessment_id: string;
  control_type: "required_control" | "required_deliverable";
  control_ref: string;
  created_at: string;
}

interface FeedbackActionRow {
  action_id: string;
  use_case_id: string;
  cycle_id: string;
  source_assessment_id: string | null;
  action_type: string;
  requested_state: string;
  rationale: string;
  status: string;
  created_at: string;
}

interface DeliverableRow {
  deliverable_id: string;
  use_case_id: string;
  assessment_id: string;
  cycle_id: string;
  deliverable_type: string;
  template_id: string;
  policy_version: string;
  status: string;
  content_hash: string;
  content_json: string;
  evidence_citations_json: string;
  manual_notes_json: string;
  generated_from_json: string;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
}

interface ApprovalRequestRow {
  request_id: string;
  use_case_id: string;
  assessment_id: string;
  cycle_id: string;
  policy_version: string;
  approval_record_deliverable_id: string;
  requested_state: string;
  requested_by: string;
  requested_by_role: string;
  status: string;
  required_roles_json: string;
  approvals_received_json: string;
  unmet_conditions_json: string;
  latest_decision_summary: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

interface ApprovalDecisionRow {
  decision_id: string;
  request_id: string;
  use_case_id: string;
  assessment_id: string;
  actor_role: string;
  actor_id: string;
  decision: string;
  notes: string | null;
  override_reason: string | null;
  created_at: string;
}

interface UseCaseEvidenceLinkRow {
  link_id: string;
  use_case_id: string;
  evidence_package_id: string;
  relation_type: string;
  linked_at: string;
}

export async function getUseCaseById(db: D1Database, useCaseId: string): Promise<UseCaseRecord | null> {
  const result = await db
    .prepare("SELECT * FROM use_cases WHERE use_case_id = ?")
    .bind(useCaseId)
    .first<UseCaseRow>();
  return result ? mapUseCaseRow(result) : null;
}

export async function listUseCases(
  db: D1Database,
  filters?: { clientId?: string | undefined; status?: string | undefined },
): Promise<UseCaseRecord[]> {
  const clauses: string[] = [];
  const args: unknown[] = [];

  if (filters?.clientId) {
    clauses.push("client_id = ?");
    args.push(filters.clientId);
  }
  if (filters?.status) {
    clauses.push("status = ?");
    args.push(filters.status);
  }

  const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const result = await db
    .prepare(`SELECT * FROM use_cases ${whereClause} ORDER BY updated_at DESC`)
    .bind(...args)
    .all<UseCaseRow>();

  return (result.results ?? []).map(mapUseCaseRow);
}

export async function recordUseCase(
  db: D1Database,
  params: {
    useCase: UseCaseRecord;
    initialCycle: GovernanceCycleRecord;
    createdAt: string;
  },
): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO use_cases (
          use_case_id,
          client_id,
          ai_system_id,
          name,
          purpose,
          business_owner,
          business_owner_confirmed,
          systems_involved_json,
          data_categories_json,
          automation_level,
          decision_impact,
          regulated_domain,
          regulated_domain_notes,
          scale,
          known_unknowns_json,
          status,
          current_gate,
          gates_json,
          gate_reasons_json,
          current_cycle_id,
          cycle_index,
          latest_risk_tier,
          latest_assessment_id,
          evidence_count,
          feedback_action_count,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        params.useCase.id,
        params.useCase.clientId ?? null,
        params.useCase.aiSystemId ?? null,
        params.useCase.name,
        params.useCase.purpose,
        params.useCase.businessOwner,
        params.useCase.businessOwnerConfirmed ? 1 : 0,
        JSON.stringify(params.useCase.systemsInvolved),
        JSON.stringify(params.useCase.dataCategories),
        params.useCase.automationLevel,
        params.useCase.decisionImpact ?? null,
        params.useCase.regulatedDomain ? 1 : 0,
        params.useCase.regulatedDomainNotes ?? null,
        params.useCase.scale ?? "limited",
        JSON.stringify(params.useCase.knownUnknowns),
        params.useCase.status,
        params.useCase.currentGate,
        JSON.stringify(params.useCase.gates),
        JSON.stringify(params.useCase.gateReasons),
        params.initialCycle.id,
        params.initialCycle.cycleIndex,
        params.useCase.latestRiskTier ?? null,
        params.useCase.latestAssessmentId ?? null,
        params.useCase.evidenceCount,
        params.useCase.feedbackActionCount,
        params.createdAt,
        params.createdAt,
      )
      .run();

    await insertCycle(db, params.initialCycle);
    await recordAuditEvent(db, {
      eventId: `${params.useCase.id}:intake_complete`,
      aggregateType: "use_case",
      aggregateId: params.useCase.id,
      eventType: "intake_complete",
      eventPayload: {
        cycleId: params.initialCycle.id,
        cycleIndex: params.initialCycle.cycleIndex,
      },
      createdAt: params.createdAt,
    });
  } catch (error) {
    throw toGovernanceStorageError(error, { useCaseId: params.useCase.id, operation: "recordUseCase" });
  }
}

export async function getEvidenceByPayloadId(
  db: D1Database,
  payloadId: string,
): Promise<CompassEvidencePackageRecord | null> {
  const result = await db
    .prepare("SELECT * FROM evidence_packages WHERE payload_id = ?")
    .bind(payloadId)
    .first<CompassEvidencePackageRecord>();
  return result ?? null;
}

export async function recordEvidencePackage(
  db: D1Database,
  params: {
    payload: HandoffPayload;
    acceptanceState: CompassEvidencePackageRecord["acceptance_state"];
    rejectionReason: string | null;
    createdAt: string;
  },
): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO evidence_packages (
          payload_id,
          use_case_id,
          schema_version,
          package_hash,
          source_system,
          target_system,
          session_ref,
          processing_run_id,
          lineage_ref,
          artifact_id,
          r2_key,
          source_mime_type,
          size_bytes,
          received_at,
          source_filename,
          source_hash,
          document_type,
          evidence_tier,
          admissible,
          review_status,
          review_reason,
          acceptance_state,
          rejection_reason,
          payload_json,
          created_at,
          accepted_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        params.payload.payloadId,
        params.payload.useCaseId,
        params.payload.schemaVersion,
        params.payload.packageHash,
        params.payload.sourceSystem,
        params.payload.targetSystem,
        params.payload.sessionRef,
        params.payload.processingRunId,
        params.payload.lineageRef,
        params.payload.fileRef.artifactId,
        params.payload.fileRef.r2Key,
        params.payload.fileRef.mimeType,
        params.payload.fileRef.sizeBytes,
        params.payload.fileRef.receivedAtIso,
        params.payload.fileRef.sourceFilename,
        params.payload.fileRef.sourceHash,
        params.payload.documentType,
        params.payload.evidenceTier,
        params.payload.admissible ? 1 : 0,
        params.payload.reviewStatus,
        params.payload.reviewReason,
        params.acceptanceState,
        params.rejectionReason,
        JSON.stringify(params.payload),
        params.createdAt,
        params.acceptanceState === "accepted_for_governance" ? params.createdAt : null,
      )
      .run();

    await db
      .prepare(
        `INSERT INTO use_case_evidence_links (
          link_id,
          use_case_id,
          evidence_package_id,
          relation_type,
          linked_at
        )
        VALUES (?, ?, ?, ?, ?)`,
      )
      .bind(
        `${params.payload.useCaseId}:${params.payload.payloadId}`,
        params.payload.useCaseId,
        params.payload.payloadId,
        params.acceptanceState === "accepted_for_governance" ? "primary" : "rejected",
        params.createdAt,
      )
      .run();
  } catch (error) {
    throw toHandoffStorageError(error, {
      payloadId: params.payload.payloadId,
      useCaseId: params.payload.useCaseId,
      operation: "recordEvidencePackage",
    });
  }
}

export async function updateUseCaseEvidenceState(
  db: D1Database,
  params: {
    useCase: UseCaseRecord;
    updatedAt: string;
    evidenceCount: number;
    feedbackActionCountDelta: number;
  },
): Promise<void> {
  try {
    await db
      .prepare(
        `UPDATE use_cases
         SET evidence_count = ?, feedback_action_count = ?, updated_at = ?
         WHERE use_case_id = ?`,
      )
      .bind(
        params.evidenceCount,
        params.useCase.feedbackActionCount + params.feedbackActionCountDelta,
        params.updatedAt,
        params.useCase.id,
      )
      .run();
  } catch (error) {
    throw toGovernanceStorageError(error, { useCaseId: params.useCase.id, operation: "updateUseCaseEvidenceState" });
  }
}

export async function recordFeedbackAction(db: D1Database, action: FeedbackActionRecord): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO feedback_actions (
          action_id,
          use_case_id,
          cycle_id,
          source_assessment_id,
          action_type,
          requested_state,
          rationale,
          status,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        action.id,
        action.useCaseId,
        action.cycleId,
        action.sourceAssessmentId ?? null,
        action.actionType,
        action.requestedState,
        action.rationale,
        action.status,
        action.createdAtIso,
      )
      .run();
  } catch (error) {
    throw toGovernanceStorageError(error, { useCaseId: action.useCaseId, operation: "recordFeedbackAction" });
  }
}

export async function listEvidenceByUseCase(
  db: D1Database,
  useCaseId: string,
): Promise<
  Array<{
    payloadId: string;
    useCaseId: string;
    schemaVersion: string;
    packageHash: string;
    acceptanceState: CompassEvidencePackageRecord["acceptance_state"];
    rejectionReason: string | null;
    createdAt: string;
    acceptedAt: string | null;
    payload: HandoffPayload;
  }>
> {
  const result = await db
    .prepare(
      `SELECT p.*
       FROM use_case_evidence_links l
       INNER JOIN evidence_packages p
         ON p.payload_id = l.evidence_package_id
       WHERE l.use_case_id = ?
       ORDER BY l.linked_at DESC`,
    )
    .bind(useCaseId)
    .all<CompassEvidencePackageRecord>();

  return (result.results ?? []).map((row) => ({
    payloadId: row.payload_id,
    useCaseId: row.use_case_id,
    schemaVersion: row.schema_version,
    packageHash: row.package_hash,
    acceptanceState: row.acceptance_state,
    rejectionReason: row.rejection_reason,
    createdAt: row.created_at,
    acceptedAt: row.accepted_at,
    payload: JSON.parse(row.payload_json) as HandoffPayload,
  }));
}

export async function getCrossSystemClosureSnapshot(
  db: D1Database,
  useCaseId: string,
): Promise<CrossSystemLineageClosure | null> {
  const useCase = await getUseCaseById(db, useCaseId);
  if (!useCase) {
    return null;
  }

  const [
    evidenceLinks,
    evidencePackages,
    governanceCycles,
    assessments,
    feedbackActions,
    deliverables,
    approvalRequests,
    auditEvents,
  ] = await Promise.all([
    listUseCaseEvidenceLinksByUseCase(db, useCaseId),
    listEvidenceByUseCase(db, useCaseId),
    listGovernanceCyclesByUseCase(db, useCaseId),
    listAssessmentsByUseCase(db, useCaseId),
    listFeedbackActionsByUseCase(db, useCaseId),
    listDeliverablesByUseCase(db, useCaseId),
    listApprovalRequestsByUseCase(db, useCaseId),
    listAuditEventsByUseCase(db, useCaseId),
  ]);

  const approvalDecisions = (
    await Promise.all(approvalRequests.map((request) => listApprovalDecisionsByRequest(db, request.requestId)))
  )
    .flat()
    .sort((left, right) => left.createdAtIso.localeCompare(right.createdAtIso));

  const auroraEvidence = evidencePackages.map(mapAuroraEvidenceClosureRecord);
  const deliverableLineage = deliverables.map(mapDeliverableLineageRecord);
  const approvalRequestLineage = approvalRequests.map(mapApprovalRequestLineageRecord);
  const approvalDecisionLineage = approvalDecisions.map(mapApprovalDecisionLineageRecord);
  const exposedStatus = deriveCrossSystemClosureStatus({
    useCase,
    governanceCycles,
    assessments,
    auroraEvidence,
    feedbackActions,
    deliverables: deliverableLineage,
    approvalRequests: approvalRequestLineage,
    approvalDecisions: approvalDecisionLineage,
  });

  const closureId = await deterministicHashObject({
    useCaseId,
    state: exposedStatus.state,
    currentCycleId: exposedStatus.currentCycleId,
    latestAssessmentId: exposedStatus.latestAssessmentId,
    latestAcceptedPayloadId: exposedStatus.latestAcceptedPayloadId,
    counts: {
      evidenceLinks: evidenceLinks.length,
      evidencePackages: auroraEvidence.length,
      governanceCycles: governanceCycles.length,
      assessments: assessments.length,
      feedbackActions: feedbackActions.length,
      deliverables: deliverableLineage.length,
      approvalRequests: approvalRequestLineage.length,
      approvalDecisions: approvalDecisionLineage.length,
      auditEvents: auditEvents.length,
    },
  });

  return {
    closureId,
    sourceSystem: "AurorA",
    governanceSystem: "COMPASSai",
    aurora: {
      evidencePackages: auroraEvidence,
    },
    compassai: {
      useCase: mapUseCaseLineageRecord(useCase),
      governanceCycles,
      assessments,
      feedbackActions,
      deliverables: deliverableLineage,
      approvalRequests: approvalRequestLineage,
      approvalDecisions: approvalDecisionLineage,
      auditEvents,
    },
    closure: {
      evidenceLinks,
      exposedStatus,
    },
  };
}

async function listUseCaseEvidenceLinksByUseCase(
  db: D1Database,
  useCaseId: string,
): Promise<CrossSystemEvidenceLinkRecord[]> {
  const result = await db
    .prepare(
      `SELECT * FROM use_case_evidence_links
       WHERE use_case_id = ?
       ORDER BY linked_at ASC`,
    )
    .bind(useCaseId)
    .all<UseCaseEvidenceLinkRow>();

  return (result.results ?? []).map((row) => ({
    linkId: row.link_id,
    useCaseId: row.use_case_id,
    payloadId: row.evidence_package_id,
    relationType: row.relation_type,
    linkedAt: row.linked_at,
  }));
}

async function listGovernanceCyclesByUseCase(
  db: D1Database,
  useCaseId: string,
): Promise<GovernanceCycleLineageRecord[]> {
  const result = await db
    .prepare(
      `SELECT * FROM governance_cycles
       WHERE use_case_id = ?
       ORDER BY opened_at ASC`,
    )
    .bind(useCaseId)
    .all<GovernanceCycleRow>();

  return (result.results ?? []).map((row) => ({
    cycleId: row.cycle_id,
    useCaseId: row.use_case_id,
    parentCycleId: row.parent_cycle_id,
    cycleIndex: row.cycle_index,
    openReason: row.open_reason,
    status: row.status,
    openedAt: row.opened_at,
    closedAt: row.closed_at,
  }));
}

async function listAssessmentsByUseCase(
  db: D1Database,
  useCaseId: string,
): Promise<GovernanceAssessmentLineageRecord[]> {
  const result = await db
    .prepare(
      `SELECT * FROM use_case_assessments
       WHERE use_case_id = ?
       ORDER BY created_at ASC`,
    )
    .bind(useCaseId)
    .all<AssessmentRow>();

  const assessments = await Promise.all((result.results ?? []).map((row) => hydrateAssessment(db, row)));
  return assessments.map(mapAssessmentLineageRecord);
}

async function listFeedbackActionsByUseCase(
  db: D1Database,
  useCaseId: string,
): Promise<FeedbackActionLineageRecord[]> {
  const result = await db
    .prepare(
      `SELECT * FROM feedback_actions
       WHERE use_case_id = ?
       ORDER BY created_at ASC`,
    )
    .bind(useCaseId)
    .all<FeedbackActionRow>();

  return (result.results ?? []).map((row) => ({
    actionId: row.action_id,
    useCaseId: row.use_case_id,
    cycleId: row.cycle_id,
    sourceAssessmentId: row.source_assessment_id,
    actionType: row.action_type,
    requestedState: row.requested_state,
    rationale: row.rationale,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function recordAssessment(
  db: D1Database,
  params: {
    useCase: UseCaseRecord;
    assessment: AssessmentRecord;
    priorRiskTier?: string | undefined;
    currentCycleId?: string | undefined;
    nextCycle?: GovernanceCycleRecord | undefined;
    requiredControls: string[];
    requiredDeliverables: string[];
    updatedAt: string;
  },
): Promise<void> {
  try {
    if (params.nextCycle) {
      await insertCycle(db, params.nextCycle);
      if (params.currentCycleId) {
        await db
          .prepare(
            `UPDATE governance_cycles
             SET status = ?, closed_at = ?
             WHERE cycle_id = ?`,
          )
          .bind("superseded", params.updatedAt, params.currentCycleId)
          .run();
      }
    }

    await db
      .prepare(
        `INSERT INTO use_case_assessments (
          assessment_id,
          use_case_id,
          cycle_id,
          parent_assessment_id,
          trigger_type,
          risk_tier,
          dimension_scores_json,
          dimension_rationale_json,
          uncertainty_fields_json,
          evidence_count,
          gate_status_json,
          gate_reasons_json,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        params.assessment.id,
        params.assessment.useCaseId,
        params.assessment.cycleId,
        params.assessment.parentAssessmentId ?? null,
        params.assessment.triggerType,
        params.assessment.riskTier,
        JSON.stringify(params.assessment.dimensionScores),
        JSON.stringify(params.assessment.dimensionRationale),
        JSON.stringify(params.assessment.uncertaintyFields),
        params.assessment.evidenceCount,
        JSON.stringify(params.assessment.gateStatus),
        JSON.stringify(params.assessment.gateReasons),
        params.assessment.createdAtIso,
      )
      .run();

    for (const controlRef of params.requiredControls) {
      await insertAssessmentControl(db, {
        row_id: crypto.randomUUID(),
        assessment_id: params.assessment.id,
        control_type: "required_control",
        control_ref: controlRef,
        created_at: params.updatedAt,
      });
    }

    for (const deliverableRef of params.requiredDeliverables) {
      await insertAssessmentControl(db, {
        row_id: crypto.randomUUID(),
        assessment_id: params.assessment.id,
        control_type: "required_deliverable",
        control_ref: deliverableRef,
        created_at: params.updatedAt,
      });
    }

    await updateUseCaseGateState(db, {
      useCaseId: params.useCase.id,
      latestRiskTier: params.assessment.riskTier,
      latestAssessmentId: params.assessment.id,
      currentCycleId: params.assessment.cycleId,
      cycleIndex: params.nextCycle?.cycleIndex ?? params.useCase.cycleIndex,
      currentGate: "risk_assessed",
      status: "risk_assessed",
      gates: params.assessment.gateStatus,
      gateReasons: params.assessment.gateReasons,
      updatedAt: params.updatedAt,
    });

    await recordAuditEvent(db, {
      eventId: `${params.useCase.id}:${params.assessment.id}:${
        params.priorRiskTier && params.priorRiskTier !== params.assessment.riskTier ? "risk_reassessed" : "risk_assessed"
      }`,
      aggregateType: "use_case",
      aggregateId: params.useCase.id,
      eventType:
        params.priorRiskTier && params.priorRiskTier !== params.assessment.riskTier ? "risk_reassessed" : "risk_assessed",
      eventPayload: {
        priorTier: params.priorRiskTier ?? null,
        newTier: params.assessment.riskTier,
        cycleId: params.assessment.cycleId,
        parentAssessmentId: params.assessment.parentAssessmentId ?? null,
        triggerType: params.assessment.triggerType,
        uncertaintyFields: params.assessment.uncertaintyFields,
      },
      createdAt: params.updatedAt,
    });
  } catch (error) {
    throw toGovernanceStorageError(error, { useCaseId: params.useCase.id, operation: "recordAssessment" });
  }
}

export async function getLatestAssessmentByUseCase(
  db: D1Database,
  useCaseId: string,
): Promise<AssessmentRecord | null> {
  const row = await db
    .prepare(
      `SELECT * FROM use_case_assessments
       WHERE use_case_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
    )
    .bind(useCaseId)
    .first<AssessmentRow>();

  return row ? hydrateAssessment(db, row) : null;
}

export async function getAssessmentById(db: D1Database, assessmentId: string): Promise<AssessmentRecord | null> {
  const row = await db
    .prepare("SELECT * FROM use_case_assessments WHERE assessment_id = ?")
    .bind(assessmentId)
    .first<AssessmentRow>();
  return row ? hydrateAssessment(db, row) : null;
}

export async function listDeliverablesByUseCase(db: D1Database, useCaseId: string): Promise<DeliverableRecord[]> {
  const result = await db
    .prepare(
      `SELECT * FROM deliverables
       WHERE use_case_id = ?
       ORDER BY created_at DESC`,
    )
    .bind(useCaseId)
    .all<DeliverableRow>();

  return (result.results ?? []).map(mapDeliverableRow);
}

export async function getDeliverableById(db: D1Database, deliverableId: string): Promise<DeliverableRecord | null> {
  const row = await db
    .prepare("SELECT * FROM deliverables WHERE deliverable_id = ?")
    .bind(deliverableId)
    .first<DeliverableRow>();
  return row ? mapDeliverableRow(row) : null;
}

export async function recordGeneratedDeliverables(
  db: D1Database,
  params: {
    useCaseId: string;
    newDeliverables: DeliverableRecord[];
    gateStatus: Record<string, string>;
    gateReasons: Record<string, string[]>;
    policyVersion: string;
    updatedAt: string;
  },
): Promise<void> {
  try {
    for (const deliverable of params.newDeliverables) {
      await insertDeliverable(db, deliverable);
    }

    await updateUseCaseGateState(db, {
      useCaseId: params.useCaseId,
      currentGate: params.gateStatus.controls_satisfied === "complete" ? "controls_satisfied" : "risk_assessed",
      status: params.gateStatus.controls_satisfied === "complete" ? "controls_satisfied" : "risk_assessed",
      gates: params.gateStatus,
      gateReasons: params.gateReasons,
      updatedAt: params.updatedAt,
    });

    await recordAuditEvent(db, {
      eventId: `${params.useCaseId}:${params.updatedAt}:deliverables_generated`,
      aggregateType: "use_case",
      aggregateId: params.useCaseId,
      eventType: "deliverables_generated",
      eventPayload: {
        deliverableTypes: params.newDeliverables.map((item) => item.deliverableType),
        policyVersion: params.policyVersion,
        controlsSatisfied: params.gateStatus.controls_satisfied,
      },
      createdAt: params.updatedAt,
    });
  } catch (error) {
    throw toApprovalStorageError(error, { useCaseId: params.useCaseId, operation: "recordGeneratedDeliverables" });
  }
}

export async function recordDeliverableUpdate(
  db: D1Database,
  params: {
    useCaseId: string;
    deliverable: DeliverableRecord;
    gateStatus: Record<string, string>;
    gateReasons: Record<string, string[]>;
    currentGate: string;
    status: string;
    updatedAt: string;
    eventType: string;
    eventPayload: Record<string, unknown>;
  },
): Promise<void> {
  try {
    await updateDeliverable(db, params.deliverable);
    await updateUseCaseGateState(db, {
      useCaseId: params.useCaseId,
      currentGate: params.currentGate,
      status: params.status,
      gates: params.gateStatus,
      gateReasons: params.gateReasons,
      updatedAt: params.updatedAt,
    });
    await recordAuditEvent(db, {
      eventId: `${params.useCaseId}:${params.deliverable.deliverableId}:${params.eventType}:${params.updatedAt}`,
      aggregateType: "use_case",
      aggregateId: params.useCaseId,
      eventType: params.eventType,
      eventPayload: params.eventPayload,
      createdAt: params.updatedAt,
    });
  } catch (error) {
    throw toApprovalStorageError(error, { useCaseId: params.useCaseId, operation: "recordDeliverableUpdate" });
  }
}

export async function getLatestApprovalRequestByUseCase(
  db: D1Database,
  useCaseId: string,
): Promise<ApprovalRequestRecord | null> {
  const row = await db
    .prepare(
      `SELECT * FROM approval_requests
       WHERE use_case_id = ?
       ORDER BY updated_at DESC
       LIMIT 1`,
    )
    .bind(useCaseId)
    .first<ApprovalRequestRow>();
  return row ? mapApprovalRequestRow(row) : null;
}

export async function getApprovalRequestById(
  db: D1Database,
  requestId: string,
): Promise<ApprovalRequestRecord | null> {
  const row = await db
    .prepare("SELECT * FROM approval_requests WHERE request_id = ?")
    .bind(requestId)
    .first<ApprovalRequestRow>();
  return row ? mapApprovalRequestRow(row) : null;
}

export async function listApprovalRequestsByUseCase(
  db: D1Database,
  useCaseId: string,
): Promise<ApprovalRequestRecord[]> {
  const result = await db
    .prepare(
      `SELECT * FROM approval_requests
       WHERE use_case_id = ?
       ORDER BY created_at DESC`,
    )
    .bind(useCaseId)
    .all<ApprovalRequestRow>();
  return (result.results ?? []).map(mapApprovalRequestRow);
}

export async function listApprovalDecisionsByRequest(
  db: D1Database,
  requestId: string,
): Promise<ApprovalDecisionRecord[]> {
  const result = await db
    .prepare(
      `SELECT * FROM approval_decisions
       WHERE request_id = ?
       ORDER BY created_at ASC`,
    )
    .bind(requestId)
    .all<ApprovalDecisionRow>();
  return (result.results ?? []).map(mapApprovalDecisionRow);
}

export async function recordApprovalRequest(
  db: D1Database,
  params: {
    useCaseId: string;
    approvalRequest: ApprovalRequestRecord;
    deliverablesToUpdate: DeliverableRecord[];
    gateStatus: Record<string, string>;
    gateReasons: Record<string, string[]>;
    updatedAt: string;
  },
): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO approval_requests (
          request_id,
          use_case_id,
          assessment_id,
          cycle_id,
          policy_version,
          approval_record_deliverable_id,
          requested_state,
          requested_by,
          requested_by_role,
          status,
          required_roles_json,
          approvals_received_json,
          unmet_conditions_json,
          latest_decision_summary,
          created_at,
          updated_at,
          resolved_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        params.approvalRequest.requestId,
        params.approvalRequest.useCaseId,
        params.approvalRequest.assessmentId,
        params.approvalRequest.cycleId,
        params.approvalRequest.policyVersion,
        params.approvalRequest.approvalRecordDeliverableId,
        params.approvalRequest.requestedState,
        params.approvalRequest.requestedBy,
        params.approvalRequest.requestedByRole,
        params.approvalRequest.status,
        JSON.stringify(params.approvalRequest.requiredRoles),
        JSON.stringify(params.approvalRequest.approvalsReceived),
        JSON.stringify(params.approvalRequest.unmetConditions),
        params.approvalRequest.latestDecisionSummary,
        params.approvalRequest.createdAtIso,
        params.approvalRequest.updatedAtIso,
        params.approvalRequest.resolvedAtIso ?? null,
      )
      .run();

    for (const deliverable of params.deliverablesToUpdate) {
      await updateDeliverable(db, deliverable);
    }

    await updateUseCaseGateState(db, {
      useCaseId: params.useCaseId,
      currentGate: params.gateStatus.controls_satisfied === "complete" ? "controls_satisfied" : "risk_assessed",
      status: params.gateStatus.approved_for_deploy === "pending" ? "approval_pending" : "controls_satisfied",
      gates: params.gateStatus,
      gateReasons: params.gateReasons,
      updatedAt: params.updatedAt,
    });

    await recordAuditEvent(db, {
      eventId: `${params.useCaseId}:${params.approvalRequest.requestId}:approval_requested`,
      aggregateType: "use_case",
      aggregateId: params.useCaseId,
      eventType: "approval_requested",
      eventPayload: {
        requestId: params.approvalRequest.requestId,
        requiredRoles: params.approvalRequest.requiredRoles,
        requestedByRole: params.approvalRequest.requestedByRole,
      },
      createdAt: params.updatedAt,
    });
  } catch (error) {
    throw toApprovalStorageError(error, { useCaseId: params.useCaseId, operation: "recordApprovalRequest" });
  }
}

export async function recordApprovalDecision(
  db: D1Database,
  params: {
    useCaseId: string;
    approvalRequest: ApprovalRequestRecord;
    approvalDecision: ApprovalDecisionRecord;
    deliverablesToUpdate: DeliverableRecord[];
    gateStatus: Record<string, string>;
    gateReasons: Record<string, string[]>;
    updatedAt: string;
  },
): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO approval_decisions (
          decision_id,
          request_id,
          use_case_id,
          assessment_id,
          actor_role,
          actor_id,
          decision,
          notes,
          override_reason,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        params.approvalDecision.decisionId,
        params.approvalDecision.requestId,
        params.approvalDecision.useCaseId,
        params.approvalDecision.assessmentId,
        params.approvalDecision.actorRole,
        params.approvalDecision.actorId,
        params.approvalDecision.decision,
        params.approvalDecision.notes ?? null,
        params.approvalDecision.overrideReason ?? null,
        params.approvalDecision.createdAtIso,
      )
      .run();

    await db
      .prepare(
        `UPDATE approval_requests
         SET status = ?, approvals_received_json = ?, unmet_conditions_json = ?, latest_decision_summary = ?, updated_at = ?, resolved_at = ?
         WHERE request_id = ?`,
      )
      .bind(
        params.approvalRequest.status,
        JSON.stringify(params.approvalRequest.approvalsReceived),
        JSON.stringify(params.approvalRequest.unmetConditions),
        params.approvalRequest.latestDecisionSummary,
        params.approvalRequest.updatedAtIso,
        params.approvalRequest.resolvedAtIso ?? null,
        params.approvalRequest.requestId,
      )
      .run();

    for (const deliverable of params.deliverablesToUpdate) {
      await updateDeliverable(db, deliverable);
    }

    await updateUseCaseGateState(db, {
      useCaseId: params.useCaseId,
      currentGate:
        params.gateStatus.approved_for_deploy === "complete"
          ? "approved_for_deploy"
          : params.gateStatus.controls_satisfied === "complete"
            ? "controls_satisfied"
            : "risk_assessed",
      status:
        params.gateStatus.approved_for_deploy === "complete"
          ? "approved_for_deploy"
          : params.approvalRequest.status === "rejected"
            ? "approval_rejected"
            : "approval_pending",
      gates: params.gateStatus,
      gateReasons: params.gateReasons,
      updatedAt: params.updatedAt,
    });

    await recordAuditEvent(db, {
      eventId: `${params.useCaseId}:${params.approvalDecision.decisionId}:approval_decision`,
      aggregateType: "use_case",
      aggregateId: params.useCaseId,
      eventType:
        params.approvalDecision.decision === "override_approved"
          ? "approval_override"
          : params.approvalDecision.decision === "approved"
            ? "approval_granted"
            : "approval_rejected",
      eventPayload: {
        requestId: params.approvalDecision.requestId,
        actorRole: params.approvalDecision.actorRole,
        actorId: params.approvalDecision.actorId,
        decision: params.approvalDecision.decision,
        notes: params.approvalDecision.notes ?? null,
        overrideReason: params.approvalDecision.overrideReason ?? null,
      },
      createdAt: params.updatedAt,
    });
  } catch (error) {
    throw toApprovalStorageError(error, { useCaseId: params.useCaseId, operation: "recordApprovalDecision" });
  }
}

export async function listAuditEventsByUseCase(db: D1Database, useCaseId: string): Promise<AuditTrailEntry[]> {
  const result = await db
    .prepare(
      `SELECT * FROM audit_events
       WHERE aggregate_id = ?
       ORDER BY created_at DESC`,
    )
    .bind(useCaseId)
    .all<{
      event_id: string;
      aggregate_type: string;
      aggregate_id: string;
      event_type: string;
      event_payload_json: string;
      created_at: string;
    }>();

  return (result.results ?? []).map((row) => ({
    eventId: row.event_id,
    aggregateType: row.aggregate_type,
    aggregateId: row.aggregate_id,
    eventType: row.event_type,
    eventPayload: JSON.parse(row.event_payload_json) as Record<string, unknown>,
    createdAt: row.created_at,
  }));
}

export async function recordAuditEvent(
  db: D1Database,
  params: {
    eventId: string;
    aggregateType: string;
    aggregateId: string;
    eventType: string;
    eventPayload: Record<string, unknown>;
    createdAt: string;
  },
): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO audit_events (
          event_id,
          aggregate_type,
          aggregate_id,
          event_type,
          event_payload_json,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        params.eventId,
        params.aggregateType,
        params.aggregateId,
        params.eventType,
        JSON.stringify(params.eventPayload),
        params.createdAt,
      )
      .run();
  } catch (error) {
    throw toGovernanceStorageError(error, { aggregateId: params.aggregateId, operation: "recordAuditEvent" });
  }
}

function mapUseCaseRow(row: UseCaseRow): UseCaseRecord {
  return {
    id: row.use_case_id,
    clientId: row.client_id ?? undefined,
    aiSystemId: row.ai_system_id ?? undefined,
    name: row.name,
    purpose: row.purpose,
    businessOwner: row.business_owner,
    businessOwnerConfirmed: row.business_owner_confirmed === 1,
    systemsInvolved: parseJson(row.systems_involved_json, [] as string[]),
    dataCategories: parseJson(row.data_categories_json, [] as string[]),
    automationLevel: row.automation_level,
    decisionImpact: row.decision_impact ?? undefined,
    regulatedDomain: row.regulated_domain === 1,
    regulatedDomainNotes: row.regulated_domain_notes ?? undefined,
    scale: row.scale,
    knownUnknowns: parseJson(row.known_unknowns_json, [] as string[]),
    status: row.status,
    currentGate: row.current_gate,
    gates: parseJson(row.gates_json, {} as Record<string, string>),
    gateReasons: parseJson(row.gate_reasons_json, {} as Record<string, string[]>),
    currentCycleId: row.current_cycle_id ?? undefined,
    cycleIndex: row.cycle_index,
    latestRiskTier: row.latest_risk_tier ?? undefined,
    latestAssessmentId: row.latest_assessment_id ?? undefined,
    evidenceCount: row.evidence_count,
    feedbackActionCount: row.feedback_action_count,
    createdAtIso: row.created_at,
    updatedAtIso: row.updated_at,
  };
}

async function hydrateAssessment(db: D1Database, row: AssessmentRow): Promise<AssessmentRecord> {
  const result = await db
    .prepare(
      `SELECT * FROM assessment_controls
       WHERE assessment_id = ?
       ORDER BY created_at ASC`,
    )
    .bind(row.assessment_id)
    .all<AssessmentControlRow>();
  const controls = result.results ?? [];

  return {
    id: row.assessment_id,
    useCaseId: row.use_case_id,
    cycleId: row.cycle_id,
    parentAssessmentId: row.parent_assessment_id ?? undefined,
    triggerType: row.trigger_type as AssessmentRecord["triggerType"],
    riskTier: row.risk_tier as AssessmentRecord["riskTier"],
    dimensionScores: parseJson(row.dimension_scores_json, {} as Record<string, number>),
    dimensionRationale: parseJson(row.dimension_rationale_json, {} as Record<string, string>),
    uncertaintyFields: parseJson(row.uncertainty_fields_json, [] as string[]),
    requiredControls: controls
      .filter((control) => control.control_type === "required_control")
      .map((control) => control.control_ref),
    requiredDeliverables: controls
      .filter((control) => control.control_type === "required_deliverable")
      .map((control) => control.control_ref),
    evidenceCount: row.evidence_count,
    gateStatus: parseJson(row.gate_status_json, {} as Record<string, string>),
    gateReasons: parseJson(row.gate_reasons_json, {} as Record<string, string[]>),
    createdAtIso: row.created_at,
  };
}

function mapDeliverableRow(row: DeliverableRow): DeliverableRecord {
  const manualNotes = parseJson(row.manual_notes_json, [] as DeliverableRecord["manualNotes"]).map((note) => ({
    ...note,
    noteType: note.noteType ?? "operator_note",
  }));
  return {
    deliverableId: row.deliverable_id,
    useCaseId: row.use_case_id,
    assessmentId: row.assessment_id,
    cycleId: row.cycle_id,
    deliverableType: row.deliverable_type as DeliverableRecord["deliverableType"],
    templateId: row.template_id,
    policyVersion: row.policy_version,
    status: row.status as DeliverableRecord["status"],
    contentHash: row.content_hash,
    content: parseJson(row.content_json, {} as Record<string, unknown>),
    evidenceCitations: parseJson(row.evidence_citations_json, [] as DeliverableRecord["evidenceCitations"]),
    manualNotes,
    generatedFrom: parseJson(
      row.generated_from_json,
      {
        assessmentId: row.assessment_id,
        cycleId: row.cycle_id,
        riskTier: "T0",
        evidenceCount: 0,
      } as DeliverableRecord["generatedFrom"],
    ),
    createdAtIso: row.created_at,
    updatedAtIso: row.updated_at,
    approvedAtIso: row.approved_at ?? undefined,
  };
}

function mapApprovalRequestRow(row: ApprovalRequestRow): ApprovalRequestRecord {
  return {
    requestId: row.request_id,
    useCaseId: row.use_case_id,
    assessmentId: row.assessment_id,
    cycleId: row.cycle_id,
    policyVersion: row.policy_version,
    approvalRecordDeliverableId: row.approval_record_deliverable_id,
    requestedState: row.requested_state as ApprovalRequestRecord["requestedState"],
    requestedBy: row.requested_by,
    requestedByRole: row.requested_by_role as ApprovalRequestRecord["requestedByRole"],
    status: row.status as ApprovalRequestRecord["status"],
    requiredRoles: parseJson(row.required_roles_json, [] as ApprovalRequestRecord["requiredRoles"]),
    approvalsReceived: parseJson(row.approvals_received_json, [] as ApprovalRequestRecord["approvalsReceived"]),
    unmetConditions: parseJson(row.unmet_conditions_json, [] as string[]),
    latestDecisionSummary: row.latest_decision_summary,
    createdAtIso: row.created_at,
    updatedAtIso: row.updated_at,
    resolvedAtIso: row.resolved_at ?? undefined,
  };
}

function mapApprovalDecisionRow(row: ApprovalDecisionRow): ApprovalDecisionRecord {
  return {
    decisionId: row.decision_id,
    requestId: row.request_id,
    useCaseId: row.use_case_id,
    assessmentId: row.assessment_id,
    actorRole: row.actor_role as ApprovalDecisionRecord["actorRole"],
    actorId: row.actor_id,
    decision: row.decision as ApprovalDecisionRecord["decision"],
    notes: row.notes ?? undefined,
    overrideReason: row.override_reason ?? undefined,
    createdAtIso: row.created_at,
  };
}

function mapUseCaseLineageRecord(useCase: UseCaseRecord): UseCaseLineageRecord {
  return {
    useCaseId: useCase.id,
    clientId: useCase.clientId ?? null,
    aiSystemId: useCase.aiSystemId ?? null,
    name: useCase.name,
    purpose: useCase.purpose,
    businessOwner: useCase.businessOwner,
    businessOwnerConfirmed: useCase.businessOwnerConfirmed,
    systemsInvolved: useCase.systemsInvolved,
    dataCategories: useCase.dataCategories,
    automationLevel: useCase.automationLevel,
    decisionImpact: useCase.decisionImpact ?? null,
    regulatedDomain: useCase.regulatedDomain,
    regulatedDomainNotes: useCase.regulatedDomainNotes ?? null,
    scale: useCase.scale ?? "limited",
    knownUnknowns: useCase.knownUnknowns,
    status: useCase.status,
    currentGate: useCase.currentGate,
    gates: useCase.gates,
    gateReasons: useCase.gateReasons,
    currentCycleId: useCase.currentCycleId ?? null,
    cycleIndex: useCase.cycleIndex,
    latestRiskTier: useCase.latestRiskTier ?? null,
    latestAssessmentId: useCase.latestAssessmentId ?? null,
    evidenceCount: useCase.evidenceCount,
    feedbackActionCount: useCase.feedbackActionCount,
    createdAt: useCase.createdAtIso,
    updatedAt: useCase.updatedAtIso,
  };
}

function mapAssessmentLineageRecord(assessment: AssessmentRecord): GovernanceAssessmentLineageRecord {
  return {
    assessmentId: assessment.id,
    useCaseId: assessment.useCaseId,
    cycleId: assessment.cycleId,
    parentAssessmentId: assessment.parentAssessmentId ?? null,
    triggerType: assessment.triggerType,
    riskTier: assessment.riskTier,
    dimensionScores: assessment.dimensionScores,
    dimensionRationale: assessment.dimensionRationale,
    uncertaintyFields: assessment.uncertaintyFields,
    requiredControls: assessment.requiredControls,
    requiredDeliverables: assessment.requiredDeliverables,
    evidenceCount: assessment.evidenceCount,
    gateStatus: assessment.gateStatus,
    gateReasons: assessment.gateReasons,
    createdAt: assessment.createdAtIso,
  };
}

function mapDeliverableLineageRecord(deliverable: DeliverableRecord): DeliverableLineageRecord {
  return {
    deliverableId: deliverable.deliverableId,
    useCaseId: deliverable.useCaseId,
    assessmentId: deliverable.assessmentId,
    cycleId: deliverable.cycleId,
    deliverableType: deliverable.deliverableType,
    templateId: deliverable.templateId,
    policyVersion: deliverable.policyVersion,
    status: deliverable.status,
    contentHash: deliverable.contentHash,
    evidenceCitationPayloadIds: deliverable.evidenceCitations.map((citation) => citation.payloadId),
    manualNoteCount: deliverable.manualNotes.length,
    generatedFrom: deliverable.generatedFrom as Record<string, unknown>,
    createdAt: deliverable.createdAtIso,
    updatedAt: deliverable.updatedAtIso,
    approvedAt: deliverable.approvedAtIso ?? null,
  };
}

function mapApprovalRequestLineageRecord(request: ApprovalRequestRecord): ApprovalRequestLineageRecord {
  return {
    requestId: request.requestId,
    useCaseId: request.useCaseId,
    assessmentId: request.assessmentId,
    cycleId: request.cycleId,
    policyVersion: request.policyVersion,
    approvalRecordDeliverableId: request.approvalRecordDeliverableId,
    requestedState: request.requestedState,
    requestedBy: request.requestedBy,
    requestedByRole: request.requestedByRole,
    status: request.status,
    requiredRoles: [...request.requiredRoles],
    approvalsReceived: [...request.approvalsReceived],
    unmetConditions: [...request.unmetConditions],
    latestDecisionSummary: request.latestDecisionSummary,
    createdAt: request.createdAtIso,
    updatedAt: request.updatedAtIso,
    resolvedAt: request.resolvedAtIso ?? null,
  };
}

function mapApprovalDecisionLineageRecord(decision: ApprovalDecisionRecord): ApprovalDecisionLineageRecord {
  return {
    decisionId: decision.decisionId,
    requestId: decision.requestId,
    useCaseId: decision.useCaseId,
    assessmentId: decision.assessmentId,
    actorRole: decision.actorRole,
    actorId: decision.actorId,
    decision: decision.decision,
    notes: decision.notes ?? null,
    overrideReason: decision.overrideReason ?? null,
    createdAt: decision.createdAtIso,
  };
}

function mapAuroraEvidenceClosureRecord(record: Awaited<ReturnType<typeof listEvidenceByUseCase>>[number]): AuroraEvidenceClosureRecord {
  return {
    payloadId: record.payloadId,
    useCaseId: record.useCaseId,
    schemaVersion: record.schemaVersion,
    packageHash: record.packageHash,
    sourceSystem: record.payload.sourceSystem,
    targetSystem: record.payload.targetSystem,
    sessionRef: record.payload.sessionRef,
    processingRunId: record.payload.processingRunId,
    lineageRef: record.payload.lineageRef,
    artifactId: record.payload.fileRef.artifactId,
    r2Key: record.payload.fileRef.r2Key,
    sourceMimeType: record.payload.fileRef.mimeType,
    sizeBytes: record.payload.fileRef.sizeBytes,
    receivedAt: record.payload.fileRef.receivedAtIso,
    sourceFilename: record.payload.fileRef.sourceFilename,
    sourceHash: record.payload.fileRef.sourceHash,
    documentType: record.payload.documentType,
    evidenceTier: record.payload.evidenceTier,
    admissible: record.payload.admissible,
    reviewStatus: record.payload.reviewStatus,
    reviewReason: record.payload.reviewReason,
    acceptanceState: record.acceptanceState,
    rejectionReason: record.rejectionReason,
    emittedAt: record.createdAt,
    acceptedAt: record.acceptedAt,
  };
}

function deriveCrossSystemClosureStatus(params: {
  useCase: UseCaseRecord;
  governanceCycles: GovernanceCycleLineageRecord[];
  assessments: GovernanceAssessmentLineageRecord[];
  auroraEvidence: AuroraEvidenceClosureRecord[];
  feedbackActions: FeedbackActionLineageRecord[];
  deliverables: DeliverableLineageRecord[];
  approvalRequests: ApprovalRequestLineageRecord[];
  approvalDecisions: ApprovalDecisionLineageRecord[];
}): CrossSystemClosureExposedStatus {
  const reasons: string[] = [];
  const acceptedEvidence = params.auroraEvidence.filter((record) => record.acceptanceState === "accepted_for_governance");
  const latestAcceptedEvidence = acceptedEvidence[0] ?? null;
  const currentCyclePointer = params.useCase.currentCycleId ?? null;
  const currentCycle = currentCyclePointer
    ? params.governanceCycles.find((cycle) => cycle.cycleId === currentCyclePointer) ?? null
    : params.governanceCycles.at(-1) ?? null;
  const latestAssessmentPointer = params.useCase.latestAssessmentId ?? null;
  const latestAssessment = latestAssessmentPointer
    ? params.assessments.find((assessment) => assessment.assessmentId === latestAssessmentPointer) ?? null
    : params.assessments.at(-1) ?? null;
  const currentDeliverables = latestAssessment
    ? params.deliverables.filter(
        (deliverable) => deliverable.assessmentId === latestAssessment.assessmentId && deliverable.status !== "superseded",
      )
    : [];
  const currentApprovalRequest = latestAssessment
    ? params.approvalRequests.find((request) => request.assessmentId === latestAssessment.assessmentId)
    : undefined;
  const currentApprovalDecisions = currentApprovalRequest
    ? params.approvalDecisions.filter((decision) => decision.requestId === currentApprovalRequest.requestId)
    : [];
  const grantedDecision = currentApprovalDecisions.find(
    (decision) => decision.decision === "approved" || decision.decision === "override_approved",
  );
  const latestOpenReassessment = selectLatestOpenReassessment(params.feedbackActions);

  if (acceptedEvidence.length === 0) {
    reasons.push("No accepted AurorA evidence package is linked to this use case.");
    return {
      state: "intake_complete",
      currentGate: params.useCase.currentGate,
      lineageIntegrity: "complete",
      reasons,
      currentCycleId: currentCycle?.cycleId ?? currentCyclePointer,
      latestAssessmentId: latestAssessment?.assessmentId ?? latestAssessmentPointer,
      latestAcceptedPayloadId: null,
      latestAuroraRunId: null,
      latestApprovalRequestId: currentApprovalRequest?.requestId ?? null,
    };
  }

  if (!currentCycle) {
    reasons.push("The current governance cycle record is missing, so closure stays at linked evidence.");
    return buildCrossSystemClosureStatus({
      state: "evidence_linked",
      currentGate: params.useCase.currentGate,
      lineageIntegrity: "degraded",
      reasons,
      currentCycleId: currentCyclePointer,
      latestAssessmentId: latestAssessment?.assessmentId ?? latestAssessmentPointer,
      latestAcceptedPayloadId: latestAcceptedEvidence?.payloadId ?? null,
      latestAuroraRunId: latestAcceptedEvidence?.processingRunId ?? null,
      latestApprovalRequestId: currentApprovalRequest?.requestId ?? null,
    });
  }

  if (!latestAssessment) {
    if (expectsAssessmentLineage(params.useCase.status)) {
      reasons.push("The latest assessment record is missing for the current governance state.");
      return buildCrossSystemClosureStatus({
        state: "evidence_linked",
        currentGate: params.useCase.currentGate,
        lineageIntegrity: "degraded",
        reasons,
        currentCycleId: currentCycle.cycleId,
        latestAssessmentId: latestAssessmentPointer,
        latestAcceptedPayloadId: latestAcceptedEvidence?.payloadId ?? null,
        latestAuroraRunId: latestAcceptedEvidence?.processingRunId ?? null,
        latestApprovalRequestId: currentApprovalRequest?.requestId ?? null,
      });
    }

    return buildCrossSystemClosureStatus({
      state: "evidence_linked",
      currentGate: params.useCase.currentGate,
      lineageIntegrity: "complete",
      reasons,
      currentCycleId: currentCycle.cycleId,
      latestAssessmentId: null,
      latestAcceptedPayloadId: latestAcceptedEvidence?.payloadId ?? null,
      latestAuroraRunId: latestAcceptedEvidence?.processingRunId ?? null,
      latestApprovalRequestId: null,
    });
  }

  if (latestAssessment.cycleId !== currentCycle.cycleId) {
    reasons.push("The latest assessment is not anchored to the current governance cycle.");
    return buildCrossSystemClosureStatus({
      state: "evidence_linked",
      currentGate: params.useCase.currentGate,
      lineageIntegrity: "degraded",
      reasons,
      currentCycleId: currentCycle.cycleId,
      latestAssessmentId: latestAssessment.assessmentId,
      latestAcceptedPayloadId: latestAcceptedEvidence?.payloadId ?? null,
      latestAuroraRunId: latestAcceptedEvidence?.processingRunId ?? null,
      latestApprovalRequestId: currentApprovalRequest?.requestId ?? null,
    });
  }

  if (
    latestOpenReassessment &&
    latestOpenReassessment.createdAt >= latestAssessment.createdAt &&
    latestOpenReassessment.sourceAssessmentId === latestAssessment.assessmentId
  ) {
    reasons.push("New accepted evidence created open reassessment pressure after the latest recorded assessment.");
    return buildCrossSystemClosureStatus({
      state: "reassessment_open",
      currentGate: params.useCase.currentGate,
      lineageIntegrity: "complete",
      reasons,
      currentCycleId: currentCycle.cycleId,
      latestAssessmentId: latestAssessment.assessmentId,
      latestAcceptedPayloadId: latestAcceptedEvidence?.payloadId ?? null,
      latestAuroraRunId: latestAcceptedEvidence?.processingRunId ?? null,
      latestApprovalRequestId: currentApprovalRequest?.requestId ?? null,
    });
  }

  if (currentDeliverables.length === 0) {
    const integrity: LineageIntegrity = expectsDeliverableLineage(params.useCase.status) ? "degraded" : "complete";
    if (integrity === "degraded") {
      reasons.push("Current-assessment deliverables are missing for the exposed governance state.");
    }
    return buildCrossSystemClosureStatus({
      state: "risk_assessed",
      currentGate: params.useCase.currentGate,
      lineageIntegrity: integrity,
      reasons,
      currentCycleId: currentCycle.cycleId,
      latestAssessmentId: latestAssessment.assessmentId,
      latestAcceptedPayloadId: latestAcceptedEvidence?.payloadId ?? null,
      latestAuroraRunId: latestAcceptedEvidence?.processingRunId ?? null,
      latestApprovalRequestId: null,
    });
  }

  if (!currentApprovalRequest) {
    const integrity: LineageIntegrity = expectsApprovalLineage(params.useCase.status) ? "degraded" : "complete";
    if (integrity === "degraded") {
      reasons.push("Approval-request lineage is missing for the exposed governance state.");
    }
    return buildCrossSystemClosureStatus({
      state: "controls_satisfied",
      currentGate: params.useCase.currentGate,
      lineageIntegrity: integrity,
      reasons,
      currentCycleId: currentCycle.cycleId,
      latestAssessmentId: latestAssessment.assessmentId,
      latestAcceptedPayloadId: latestAcceptedEvidence?.payloadId ?? null,
      latestAuroraRunId: latestAcceptedEvidence?.processingRunId ?? null,
      latestApprovalRequestId: null,
    });
  }

  if (currentApprovalRequest.status === "rejected") {
    return buildCrossSystemClosureStatus({
      state: "approval_rejected",
      currentGate: params.useCase.currentGate,
      lineageIntegrity: "complete",
      reasons,
      currentCycleId: currentCycle.cycleId,
      latestAssessmentId: latestAssessment.assessmentId,
      latestAcceptedPayloadId: latestAcceptedEvidence?.payloadId ?? null,
      latestAuroraRunId: latestAcceptedEvidence?.processingRunId ?? null,
      latestApprovalRequestId: currentApprovalRequest.requestId,
    });
  }

  if (!grantedDecision) {
    const integrity: LineageIntegrity =
      params.useCase.status === "approved_for_deploy" ? "degraded" : "complete";
    if (integrity === "degraded") {
      reasons.push("A granted approval decision is missing, so closure stays at approval pending.");
    }
    return buildCrossSystemClosureStatus({
      state: "approval_pending",
      currentGate: params.useCase.currentGate,
      lineageIntegrity: integrity,
      reasons,
      currentCycleId: currentCycle.cycleId,
      latestAssessmentId: latestAssessment.assessmentId,
      latestAcceptedPayloadId: latestAcceptedEvidence?.payloadId ?? null,
      latestAuroraRunId: latestAcceptedEvidence?.processingRunId ?? null,
      latestApprovalRequestId: currentApprovalRequest.requestId,
    });
  }

  return buildCrossSystemClosureStatus({
    state: "approved_for_deploy",
    currentGate: params.useCase.currentGate,
    lineageIntegrity: "complete",
    reasons,
    currentCycleId: currentCycle.cycleId,
    latestAssessmentId: latestAssessment.assessmentId,
    latestAcceptedPayloadId: latestAcceptedEvidence?.payloadId ?? null,
    latestAuroraRunId: latestAcceptedEvidence?.processingRunId ?? null,
    latestApprovalRequestId: currentApprovalRequest.requestId,
  });
}

function buildCrossSystemClosureStatus(
  input: Omit<CrossSystemClosureExposedStatus, "reasons"> & { reasons?: string[] },
): CrossSystemClosureExposedStatus {
  return {
    ...input,
    reasons: input.reasons ?? [],
  };
}

function selectLatestOpenReassessment(
  feedbackActions: FeedbackActionLineageRecord[],
): FeedbackActionLineageRecord | null {
  return (
    feedbackActions
      .filter(
        (action) => action.status === "open" && action.requestedState === "risk_reassessment_required",
      )
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0] ?? null
  );
}

function expectsAssessmentLineage(useCaseStatus: string): boolean {
  return ["risk_assessed", "controls_satisfied", "approval_pending", "approval_rejected", "approved_for_deploy"].includes(
    useCaseStatus,
  );
}

function expectsDeliverableLineage(useCaseStatus: string): boolean {
  return ["controls_satisfied", "approval_pending", "approval_rejected", "approved_for_deploy"].includes(
    useCaseStatus,
  );
}

function expectsApprovalLineage(useCaseStatus: string): boolean {
  return ["approval_pending", "approval_rejected", "approved_for_deploy"].includes(useCaseStatus);
}

async function insertCycle(db: D1Database, cycle: GovernanceCycleRecord): Promise<void> {
  await db
    .prepare(
      `INSERT INTO governance_cycles (
        cycle_id,
        use_case_id,
        parent_cycle_id,
        cycle_index,
        open_reason,
        status,
        opened_at,
        closed_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      cycle.id,
      cycle.useCaseId,
      cycle.parentCycleId ?? null,
      cycle.cycleIndex,
      cycle.openReason,
      cycle.status,
      cycle.openedAtIso,
      cycle.closedAtIso ?? null,
    )
    .run();
}

async function insertAssessmentControl(db: D1Database, row: AssessmentControlRow): Promise<void> {
  await db
    .prepare(
      `INSERT INTO assessment_controls (
        row_id,
        assessment_id,
        control_type,
        control_ref,
        created_at
      )
      VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(row.row_id, row.assessment_id, row.control_type, row.control_ref, row.created_at)
    .run();
}

async function insertDeliverable(db: D1Database, deliverable: DeliverableRecord): Promise<void> {
  await db
    .prepare(
      `INSERT INTO deliverables (
        deliverable_id,
        use_case_id,
        assessment_id,
        cycle_id,
        deliverable_type,
        template_id,
        policy_version,
        status,
        content_hash,
        content_json,
        evidence_citations_json,
        manual_notes_json,
        generated_from_json,
        created_at,
        updated_at,
        approved_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      deliverable.deliverableId,
      deliverable.useCaseId,
      deliverable.assessmentId,
      deliverable.cycleId,
      deliverable.deliverableType,
      deliverable.templateId,
      deliverable.policyVersion,
      deliverable.status,
      deliverable.contentHash,
      JSON.stringify(deliverable.content),
      JSON.stringify(deliverable.evidenceCitations),
      JSON.stringify(deliverable.manualNotes),
      JSON.stringify(deliverable.generatedFrom),
      deliverable.createdAtIso,
      deliverable.updatedAtIso,
      deliverable.approvedAtIso ?? null,
    )
    .run();
}

async function updateDeliverable(db: D1Database, deliverable: DeliverableRecord): Promise<void> {
  await db
    .prepare(
      `UPDATE deliverables
       SET status = ?, content_hash = ?, content_json = ?, evidence_citations_json = ?, manual_notes_json = ?, generated_from_json = ?, updated_at = ?, approved_at = ?
       WHERE deliverable_id = ?`,
    )
    .bind(
      deliverable.status,
      deliverable.contentHash,
      JSON.stringify(deliverable.content),
      JSON.stringify(deliverable.evidenceCitations),
      JSON.stringify(deliverable.manualNotes),
      JSON.stringify(deliverable.generatedFrom),
      deliverable.updatedAtIso,
      deliverable.approvedAtIso ?? null,
      deliverable.deliverableId,
    )
    .run();
}

async function updateUseCaseGateState(
  db: D1Database,
  params: {
    useCaseId: string;
    currentGate: string;
    status: string;
    gates: Record<string, string>;
    gateReasons: Record<string, string[]>;
    updatedAt: string;
    latestRiskTier?: string | undefined;
    latestAssessmentId?: string | undefined;
    currentCycleId?: string | undefined;
    cycleIndex?: number | undefined;
  },
): Promise<void> {
  const existing = await getUseCaseById(db, params.useCaseId);
  if (!existing) {
    throw new CompassGovernanceError("USE_CASE_NOT_FOUND", { useCaseId: params.useCaseId });
  }

  await db
    .prepare(
      `UPDATE use_cases
       SET latest_risk_tier = ?, latest_assessment_id = ?, current_cycle_id = ?, cycle_index = ?, current_gate = ?, status = ?, gates_json = ?, gate_reasons_json = ?, updated_at = ?
       WHERE use_case_id = ?`,
    )
    .bind(
      params.latestRiskTier ?? existing.latestRiskTier ?? null,
      params.latestAssessmentId ?? existing.latestAssessmentId ?? null,
      params.currentCycleId ?? existing.currentCycleId ?? null,
      params.cycleIndex ?? existing.cycleIndex,
      params.currentGate,
      params.status,
      JSON.stringify(params.gates),
      JSON.stringify(params.gateReasons),
      params.updatedAt,
      params.useCaseId,
    )
    .run();
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function toHandoffStorageError(error: unknown, context: Record<string, unknown>): CompassHandoffError {
  return new CompassHandoffError("D1_WRITE_FAILED", {
    ...context,
    underlyingMessage: error instanceof Error ? error.message : String(error),
  });
}

function toGovernanceStorageError(error: unknown, context: Record<string, unknown>): CompassGovernanceError {
  return new CompassGovernanceError("D1_WRITE_FAILED", {
    ...context,
    underlyingMessage: error instanceof Error ? error.message : String(error),
  });
}

function toApprovalStorageError(error: unknown, context: Record<string, unknown>): CompassApprovalError {
  return new CompassApprovalError("D1_WRITE_FAILED", {
    ...context,
    underlyingMessage: error instanceof Error ? error.message : String(error),
  });
}
