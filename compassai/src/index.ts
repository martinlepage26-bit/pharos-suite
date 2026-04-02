// COMPASSai — bounded Worker entry point for governance intake and evidence handoff
// Source: Spec 05 — cross-system-evidence-handoff, Spec 06 — governance engine, Spec 07 — policy deliverables

import { deterministicHashObject } from "../../shared/utils/hash";
import { DEFAULT_JURISDICTION } from "../../shared/types/regulatory";
import { CompassApprovalError, CompassGovernanceError, CompassHandoffError } from "./lib/errors";
import { applyApprovalDecision, createApprovalRequest } from "./modules/approval/index";
import type { ApprovalDecisionInput } from "./modules/approval/types";
import { runGovernancePipeline } from "./modules/governance-engine/index";
import {
  buildGovernanceCycle,
  buildUseCaseRecord,
  createAssessmentRecord,
} from "./modules/governance-engine/program";
import type { UseCaseCreateInput } from "./modules/governance-engine/types";
import { receiveHandoff } from "./modules/handoff/index";
import type { HandoffPayload } from "./modules/handoff/types";
import {
  appendDeliverableManualNote,
  buildGovernanceDeliverables,
  deliverableRequiresOperatorCompletion,
  evaluatePolicyState,
} from "./modules/policy-deliverables/index";
import { CURRENT_POLICY_VERSION } from "./modules/policy-deliverables/templates";
import type { ApprovalRole, DeliverableRecord } from "./modules/policy-deliverables/types";
import {
  getDeliverableById,
  getCrossSystemClosureSnapshot,
  getApprovalRequestById,
  getAssessmentById,
  getLatestApprovalRequestByUseCase,
  getLatestAssessmentByUseCase,
  getUseCaseById,
  listApprovalDecisionsByRequest,
  listApprovalRequestsByUseCase,
  listAuditEventsByUseCase,
  listDeliverablesByUseCase,
  listEvidenceByUseCase,
  listUseCases,
  recordApprovalDecision,
  recordApprovalRequest,
  recordAssessment,
  recordDeliverableUpdate,
  recordGeneratedDeliverables,
  recordUseCase,
} from "./storage/d1";

interface Env {
  COMPASS_DB: D1Database;
  COMPASSAI_CLOSURE_READ_TOKEN?: string;
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/v1/use-cases") {
      if (request.method === "POST") {
        const body = await readJsonRecord(request);
        if (!body) {
          return jsonResponse({ error: "invalid_json", code: "MALFORMED_BODY" }, 400);
        }

        try {
          const input = parseUseCaseCreateInput(body);
          validateUseCaseInput(input);

          const createdAt = new Date().toISOString();
          const baseUseCase = buildUseCaseRecord(input, createdAt);
          const initialCycle = buildGovernanceCycle(baseUseCase, {
            openReason: "intake_complete",
            nowIso: createdAt,
          });
          const useCase = {
            ...baseUseCase,
            currentCycleId: initialCycle.id,
            cycleIndex: initialCycle.cycleIndex,
            updatedAtIso: createdAt,
          };

          await recordUseCase(env.COMPASS_DB, {
            useCase,
            initialCycle,
            createdAt,
          });

          return jsonResponse({ useCase, governanceCycle: initialCycle }, 201);
        } catch (error) {
          return handleGovernanceError(error);
        }
      }

      if (request.method === "GET") {
        const useCases = await listUseCases(env.COMPASS_DB, {
          clientId: url.searchParams.get("client_id") ?? undefined,
          status: url.searchParams.get("status") ?? undefined,
        });
        return jsonResponse({ useCases }, 200);
      }

      return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
    }

    if (url.pathname === "/api/v1/evidence") {
      if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      const payload = await readJsonRecord(request);
      if (!payload) {
        return jsonResponse({ error: "invalid_payload", code: "MALFORMED_BODY" }, 400);
      }

      try {
        const result = await receiveHandoff(payload as unknown as HandoffPayload, { COMPASS_DB: env.COMPASS_DB });
        return jsonResponse(result, result.acceptanceState === "accepted_for_governance" ? 200 : 202);
      } catch (error) {
        if (error instanceof CompassHandoffError) {
          const status = error.code === "USE_CASE_NOT_FOUND" ? 404 : 422;
          return jsonResponse({ error: "handoff_rejected", code: error.code }, status);
        }
        return jsonResponse({ error: "internal_error", code: "INTERNAL" }, 500);
      }
    }

    const approvalDecisionMatch = url.pathname.match(/^\/api\/v1\/approval-requests\/([^/]+)\/decisions$/);
    if (approvalDecisionMatch) {
      if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      const approvalRequest = await getApprovalRequestById(env.COMPASS_DB, approvalDecisionMatch[1]);
      if (!approvalRequest) {
        return jsonResponse({ error: "approval_request_not_found", code: "NOT_FOUND" }, 404);
      }

      const useCase = await getUseCaseById(env.COMPASS_DB, approvalRequest.useCaseId);
      if (!useCase) {
        return jsonResponse({ error: "use_case_not_found", code: "NOT_FOUND" }, 404);
      }

      const assessment = await getAssessmentById(env.COMPASS_DB, approvalRequest.assessmentId);
      if (!assessment) {
        return jsonResponse({ error: "latest_assessment_required", code: "LATEST_ASSESSMENT_REQUIRED" }, 409);
      }

      const body = await readJsonRecord(request);
      if (!body) {
        return jsonResponse({ error: "invalid_json", code: "MALFORMED_BODY" }, 400);
      }

      const allDeliverables = await listDeliverablesByUseCase(env.COMPASS_DB, useCase.id);
      const approvalRecord = allDeliverables.find(
        (record) => record.deliverableId === approvalRequest.approvalRecordDeliverableId,
      );
      if (!approvalRecord) {
        return jsonResponse({ error: "approval_record_required", code: "APPROVAL_RECORD_REQUIRED" }, 409);
      }

      try {
        const existingDecisions = await listApprovalDecisionsByRequest(env.COMPASS_DB, approvalRequest.requestId);
        const decisionInput = parseApprovalDecisionInput(body);
        const transition = await applyApprovalDecision({
          useCase,
          assessment,
          approvalRequest,
          approvalRecord,
          existingDecisions,
          decisionInput,
        });

        const scopedDeliverables = allDeliverables
          .filter(
            (record) =>
              record.assessmentId === approvalRequest.assessmentId &&
              record.policyVersion === approvalRequest.policyVersion &&
              record.status !== "superseded",
          )
          .map((record) =>
            record.deliverableId === transition.approvalRecord.deliverableId
              ? transition.approvalRecord
              : finalizeDeliverableStatus(record, transition.approvalRequest.status, transition.approvalDecision.createdAtIso),
          );
        const evidenceRecords = toAcceptedEvidenceCitations(await listEvidenceByUseCase(env.COMPASS_DB, useCase.id));
        const evaluation = evaluatePolicyState({
          useCase,
          assessment,
          evidenceCitations: evidenceRecords,
          deliverables: scopedDeliverables,
          approvalRequest: {
            status: transition.approvalRequest.status,
            unmetConditions: transition.approvalRequest.unmetConditions,
          },
          policyVersion: approvalRequest.policyVersion,
        });

        await recordApprovalDecision(env.COMPASS_DB, {
          useCaseId: useCase.id,
          approvalRequest: transition.approvalRequest,
          approvalDecision: transition.approvalDecision,
          deliverablesToUpdate: scopedDeliverables,
          gateStatus: evaluation.gateStatus,
          gateReasons: evaluation.gateReasons,
          updatedAt: transition.approvalDecision.createdAtIso,
        });

        return jsonResponse(
          {
            approvalRequest: transition.approvalRequest,
            approvalDecision: transition.approvalDecision,
            gateStatus: evaluation.gateStatus,
            gateReasons: evaluation.gateReasons,
          },
          200,
        );
      } catch (error) {
        return handleApprovalError(error);
      }
    }

    const deliverableNoteMatch = url.pathname.match(/^\/api\/v1\/deliverables\/([^/]+)\/notes$/);
    if (deliverableNoteMatch) {
      if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      const deliverable = await getDeliverableById(env.COMPASS_DB, deliverableNoteMatch[1]);
      if (!deliverable) {
        return jsonResponse({ error: "deliverable_not_found", code: "NOT_FOUND" }, 404);
      }

      const useCase = await getUseCaseById(env.COMPASS_DB, deliverable.useCaseId);
      if (!useCase) {
        return jsonResponse({ error: "use_case_not_found", code: "NOT_FOUND" }, 404);
      }

      const assessment = await getAssessmentById(env.COMPASS_DB, deliverable.assessmentId);
      if (!assessment) {
        return jsonResponse({ error: "latest_assessment_required", code: "LATEST_ASSESSMENT_REQUIRED" }, 409);
      }

      const body = await readJsonRecord(request);
      if (!body) {
        return jsonResponse({ error: "invalid_json", code: "MALFORMED_BODY" }, 400);
      }

      const note = readOptionalString(body, "note");
      const addedBy = readOptionalString(body, "added_by", "addedBy");
      const marksComplete = readBoolean(body, "marks_complete", "marksComplete");
      if (!note || !addedBy) {
        return jsonResponse({ error: "deliverable_note_invalid", code: "DELIVERABLE_NOTE_REQUIRED" }, 422);
      }
      if (marksComplete && !deliverableRequiresOperatorCompletion(deliverable)) {
        return jsonResponse(
          { error: "deliverable_completion_not_required", code: "DELIVERABLE_COMPLETION_NOT_REQUIRED" },
          409,
        );
      }

      const updatedDeliverable = await appendDeliverableManualNote({
        deliverable,
        note,
        addedBy,
        noteType: marksComplete ? "completion_marker" : "operator_note",
      });

      const allDeliverables = await listDeliverablesByUseCase(env.COMPASS_DB, useCase.id);
      const scopedDeliverables = allDeliverables
        .filter(
          (record) =>
            record.assessmentId === deliverable.assessmentId &&
            record.policyVersion === deliverable.policyVersion &&
            record.status !== "superseded",
        )
        .map((record) => (record.deliverableId === updatedDeliverable.deliverableId ? updatedDeliverable : record));
      const evidenceRecords = toAcceptedEvidenceCitations(await listEvidenceByUseCase(env.COMPASS_DB, useCase.id));
      const latestApprovalRequest = await getLatestApprovalRequestByUseCase(env.COMPASS_DB, useCase.id);
      const scopedApprovalRequest =
        latestApprovalRequest &&
        latestApprovalRequest.assessmentId === deliverable.assessmentId &&
        latestApprovalRequest.policyVersion === deliverable.policyVersion
          ? {
              status: latestApprovalRequest.status,
              unmetConditions: latestApprovalRequest.unmetConditions,
            }
          : undefined;
      const evaluation = evaluatePolicyState({
        useCase,
        assessment,
        evidenceCitations: evidenceRecords,
        deliverables: scopedDeliverables,
        approvalRequest: scopedApprovalRequest,
        policyVersion: deliverable.policyVersion,
      });
      const lifecycle = deriveUseCaseLifecycleState(evaluation.gateStatus, scopedApprovalRequest?.status);

      await recordDeliverableUpdate(env.COMPASS_DB, {
        useCaseId: useCase.id,
        deliverable: updatedDeliverable,
        gateStatus: evaluation.gateStatus,
        gateReasons: evaluation.gateReasons,
        currentGate: lifecycle.currentGate,
        status: lifecycle.status,
        updatedAt: updatedDeliverable.updatedAtIso,
        eventType: marksComplete ? "deliverable_completion_marked" : "deliverable_note_added",
        eventPayload: {
          deliverableId: updatedDeliverable.deliverableId,
          deliverableType: updatedDeliverable.deliverableType,
          noteType: marksComplete ? "completion_marker" : "operator_note",
          addedBy,
        },
      });

      return jsonResponse(
        {
          deliverable: updatedDeliverable,
          gateStatus: evaluation.gateStatus,
          gateReasons: evaluation.gateReasons,
        },
        200,
      );
    }

    const useCaseMatch = url.pathname.match(/^\/api\/v1\/use-cases\/([^/]+)$/);
    if (useCaseMatch) {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }
      const useCase = await getUseCaseById(env.COMPASS_DB, useCaseMatch[1]);
      if (!useCase) {
        return jsonResponse({ error: "use_case_not_found", code: "NOT_FOUND" }, 404);
      }
      return jsonResponse(useCase, 200);
    }

    const closureMatch = url.pathname.match(/^\/api\/v1\/use-cases\/([^/]+)\/closure$/);
    if (closureMatch) {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      const authFailure = requireClosureReadToken(request, env);
      if (authFailure) {
        return authFailure;
      }

      const closure = await getCrossSystemClosureSnapshot(env.COMPASS_DB, closureMatch[1]);
      if (!closure) {
        return jsonResponse({ error: "use_case_not_found", code: "NOT_FOUND" }, 404);
      }

      return jsonResponse(closure, 200);
    }

    const generateDeliverablesMatch = url.pathname.match(/^\/api\/v1\/use-cases\/([^/]+)\/deliverables\/generate$/);
    if (generateDeliverablesMatch) {
      if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      const useCase = await getUseCaseById(env.COMPASS_DB, generateDeliverablesMatch[1]);
      if (!useCase) {
        return jsonResponse({ error: "use_case_not_found", code: "NOT_FOUND" }, 404);
      }

      const assessment = await getLatestAssessmentByUseCase(env.COMPASS_DB, useCase.id);
      if (!assessment) {
        return jsonResponse({ error: "latest_assessment_required", code: "LATEST_ASSESSMENT_REQUIRED" }, 409);
      }

      const evidenceRecords = toAcceptedEvidenceCitations(await listEvidenceByUseCase(env.COMPASS_DB, useCase.id));
      const existingDeliverables = await listDeliverablesByUseCase(env.COMPASS_DB, useCase.id);
      const nowIso = new Date().toISOString();

      try {
        const { deliverables, newDeliverables, evaluation } = await buildGovernanceDeliverables({
          useCase,
          assessment,
          evidenceRecords,
          existingDeliverables,
          policyVersion: CURRENT_POLICY_VERSION,
          nowIso,
        });

        await recordGeneratedDeliverables(env.COMPASS_DB, {
          useCaseId: useCase.id,
          newDeliverables,
          gateStatus: evaluation.gateStatus,
          gateReasons: evaluation.gateReasons,
          policyVersion: evaluation.policyVersion,
          updatedAt: nowIso,
        });

        return jsonResponse(
          {
            deliverables,
            policyVersion: evaluation.policyVersion,
            gateStatus: evaluation.gateStatus,
            gateReasons: evaluation.gateReasons,
            unmetConditions: evaluation.unmetConditions,
          },
          200,
        );
      } catch (error) {
        return handleApprovalError(error);
      }
    }

    const deliverablesMatch = url.pathname.match(/^\/api\/v1\/use-cases\/([^/]+)\/deliverables$/);
    if (deliverablesMatch) {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      const useCase = await getUseCaseById(env.COMPASS_DB, deliverablesMatch[1]);
      if (!useCase) {
        return jsonResponse({ error: "use_case_not_found", code: "NOT_FOUND" }, 404);
      }

      const deliverables = await listDeliverablesByUseCase(env.COMPASS_DB, useCase.id);
      return jsonResponse({ deliverables, policyVersion: CURRENT_POLICY_VERSION }, 200);
    }

    const approvalRequestsMatch = url.pathname.match(/^\/api\/v1\/use-cases\/([^/]+)\/approval-requests$/);
    if (approvalRequestsMatch) {
      const useCase = await getUseCaseById(env.COMPASS_DB, approvalRequestsMatch[1]);
      if (!useCase) {
        return jsonResponse({ error: "use_case_not_found", code: "NOT_FOUND" }, 404);
      }

      if (request.method === "GET") {
        const requests = await listApprovalRequestsByUseCase(env.COMPASS_DB, useCase.id);
        return jsonResponse({ approvalRequests: requests }, 200);
      }

      if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      const assessment = await getLatestAssessmentByUseCase(env.COMPASS_DB, useCase.id);
      if (!assessment) {
        return jsonResponse({ error: "latest_assessment_required", code: "LATEST_ASSESSMENT_REQUIRED" }, 409);
      }

      const body = (await readJsonRecord(request)) ?? {};
      const evidenceRecords = toAcceptedEvidenceCitations(await listEvidenceByUseCase(env.COMPASS_DB, useCase.id));
      const deliverables = await listDeliverablesByUseCase(env.COMPASS_DB, useCase.id);
      const latestApprovalRequest = await getLatestApprovalRequestByUseCase(env.COMPASS_DB, useCase.id);
      const evaluation = evaluatePolicyState({
        useCase,
        assessment,
        evidenceCitations: evidenceRecords,
        deliverables,
        policyVersion: CURRENT_POLICY_VERSION,
      });
      const approvalRecord = deliverables.find(
        (record) =>
          record.assessmentId === assessment.id &&
          record.policyVersion === CURRENT_POLICY_VERSION &&
          record.deliverableType === "approval_record" &&
          record.status !== "superseded",
      );

      if (!approvalRecord) {
        return jsonResponse({ error: "approval_record_required", code: "APPROVAL_RECORD_REQUIRED" }, 409);
      }

      try {
        const requestedBy = readOptionalString(body, "requested_by", "requestedBy") ?? "compassai-worker";
        const requestedByRole = readApprovalRole(body, "requested_by_role", "requestedByRole", "governance_admin");
        const approvalRequest = createApprovalRequest({
          useCase,
          assessment,
          approvalRecord,
          requestedBy,
          requestedByRole,
          evaluation,
          existingPendingRequest: latestApprovalRequest?.status === "pending" ? latestApprovalRequest : undefined,
          nowIso: new Date().toISOString(),
        });

        const isIdempotent = latestApprovalRequest?.requestId === approvalRequest.requestId;
        const scopedDeliverables = await Promise.all(
          deliverables
            .filter(
              (record) =>
                record.assessmentId === assessment.id &&
                record.policyVersion === CURRENT_POLICY_VERSION &&
                record.status !== "superseded",
            )
            .map(async (record): Promise<DeliverableRecord> =>
              record.deliverableId === approvalRecord.deliverableId
                ? withApprovalRequestContext(record, approvalRequest)
                : record.status === "draft"
                  ? { ...record, status: "pending_approval", updatedAtIso: approvalRequest.updatedAtIso }
                  : record,
            ),
        );
        const evaluationWithRequest = evaluatePolicyState({
          useCase,
          assessment,
          evidenceCitations: evidenceRecords,
          deliverables: scopedDeliverables,
          approvalRequest: {
            status: approvalRequest.status,
            unmetConditions: approvalRequest.unmetConditions,
          },
          policyVersion: CURRENT_POLICY_VERSION,
        });

        if (!isIdempotent) {
          await recordApprovalRequest(env.COMPASS_DB, {
            useCaseId: useCase.id,
            approvalRequest,
            deliverablesToUpdate: scopedDeliverables,
            gateStatus: evaluationWithRequest.gateStatus,
            gateReasons: evaluationWithRequest.gateReasons,
            updatedAt: approvalRequest.updatedAtIso,
          });
        }

        return jsonResponse(
          {
            approvalRequest,
            idempotent: isIdempotent,
            gateStatus: evaluationWithRequest.gateStatus,
            gateReasons: evaluationWithRequest.gateReasons,
          },
          isIdempotent ? 200 : 201,
        );
      } catch (error) {
        return handleApprovalError(error);
      }
    }

    const evidenceMatch = url.pathname.match(/^\/api\/v1\/evidence\/use-case\/([^/]+)$/);
    if (evidenceMatch) {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }
      const useCase = await getUseCaseById(env.COMPASS_DB, evidenceMatch[1]);
      if (!useCase) {
        return jsonResponse({ error: "use_case_not_found", code: "NOT_FOUND" }, 404);
      }
      const evidence = await listEvidenceByUseCase(env.COMPASS_DB, useCase.id);
      return jsonResponse({ evidence }, 200);
    }

    const assessMatch = url.pathname.match(/^\/api\/v1\/use-cases\/([^/]+)\/assess$/);
    if (assessMatch) {
      if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      const useCase = await getUseCaseById(env.COMPASS_DB, assessMatch[1]);
      if (!useCase) {
        return jsonResponse({ error: "use_case_not_found", code: "NOT_FOUND" }, 404);
      }

      const createdAt = new Date().toISOString();
      const evidence = await listEvidenceByUseCase(env.COMPASS_DB, useCase.id);
      const priorAssessment = await getLatestAssessmentByUseCase(env.COMPASS_DB, useCase.id);
      const nextCycle =
        priorAssessment || !useCase.currentCycleId
          ? buildGovernanceCycle(useCase, {
              openReason: priorAssessment ? "reassessment_after_new_evidence" : "initial_assessment",
              parentCycleId: useCase.currentCycleId,
              nowIso: createdAt,
            })
          : undefined;

      const program = await runGovernancePipeline({
        useCase,
        evidenceRecords: evidence.map((record) => ({
          payload: record.payload,
          createdAt: record.createdAt,
          acceptanceState: record.acceptanceState,
        })),
        priorAssessment: priorAssessment ?? undefined,
        governanceContext: {
          sessionId: nextCycle?.id ?? useCase.currentCycleId ?? `${useCase.id}:session`,
          operator: "compassai-worker",
          timestampIso: createdAt,
          jurisdictionCode: DEFAULT_JURISDICTION,
        },
        programId: `${useCase.id}:${createdAt}`,
      });

      const assessment = createAssessmentRecord({
        useCaseId: useCase.id,
        cycleId: nextCycle?.id ?? useCase.currentCycleId ?? crypto.randomUUID(),
        priorAssessmentId: useCase.latestAssessmentId,
        triggerType: priorAssessment ? "reassessment" : "initial_assessment",
        riskTier: program.riskTier,
        dimensionScores: program.dimensionScores,
        dimensionRationale: program.dimensionRationale,
        uncertaintyFields: program.uncertaintyFields,
        requiredControls: program.requiredControls,
        requiredDeliverables: program.requiredDeliverables,
        evidenceCount: program.evidenceCount,
        gateStatus: program.gateStatus,
        gateReasons: program.gateReasons,
        createdAtIso: createdAt,
      });

      await recordAssessment(env.COMPASS_DB, {
        useCase,
        assessment,
        priorRiskTier: useCase.latestRiskTier,
        currentCycleId: useCase.currentCycleId,
        nextCycle,
        requiredControls: program.requiredControls,
        requiredDeliverables: program.requiredDeliverables,
        updatedAt: createdAt,
      });

      return jsonResponse(
        {
          assessment,
          governanceStatus: program.status,
          auditTrailRef: program.auditTrailRef,
        },
        200,
      );
    }

    const auditMatch = url.pathname.match(/^\/api\/v1\/use-cases\/([^/]+)\/audit-trail$/);
    if (auditMatch) {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }
      const useCase = await getUseCaseById(env.COMPASS_DB, auditMatch[1]);
      if (!useCase) {
        return jsonResponse({ error: "use_case_not_found", code: "NOT_FOUND" }, 404);
      }
      const auditTrail = await listAuditEventsByUseCase(env.COMPASS_DB, useCase.id);
      return jsonResponse({ auditTrail }, 200);
    }

    return jsonResponse({ error: "not_found", code: "NOT_FOUND" }, 404);
  },
};

function validateUseCaseInput(input: UseCaseCreateInput): void {
  if (!input.businessOwnerConfirmed) {
    throw new CompassGovernanceError("USE_CASE_REQUIRES_BUSINESS_OWNER_CONFIRMATION");
  }
  if (input.systemsInvolved.length === 0) {
    throw new CompassGovernanceError("USE_CASE_REQUIRES_SYSTEMS");
  }
  if (input.dataCategories.length === 0) {
    throw new CompassGovernanceError("USE_CASE_REQUIRES_DATA_CATEGORIES");
  }
  if (input.knownUnknowns.length === 0) {
    throw new CompassGovernanceError("USE_CASE_REQUIRES_KNOWN_UNKNOWNS");
  }
}

function requireClosureReadToken(request: Request, env: Env): Response | null {
  const expectedToken = env.COMPASSAI_CLOSURE_READ_TOKEN?.trim();
  if (!expectedToken) {
    return null;
  }

  const providedToken = readBearerToken(request);
  if (!providedToken) {
    return jsonResponse({ error: "closure_auth_required", code: "AUTH_REQUIRED" }, 401);
  }

  if (providedToken !== expectedToken) {
    return jsonResponse({ error: "closure_auth_invalid", code: "AUTH_INVALID" }, 403);
  }

  return null;
}

function readBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return null;
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function parseUseCaseCreateInput(body: Record<string, unknown>): UseCaseCreateInput {
  const systemsInvolved = readStringArray(body, "systems_involved", "systemsInvolved");
  const dataCategories = readStringArray(body, "data_categories", "dataCategories");
  const knownUnknowns = readStringArray(body, "known_unknowns", "knownUnknowns");

  return {
    name: readString(body, "name"),
    purpose: readString(body, "purpose"),
    businessOwner: readString(body, "business_owner", "businessOwner"),
    businessOwnerConfirmed: readBoolean(body, "business_owner_confirmed", "businessOwnerConfirmed"),
    systemsInvolved,
    dataCategories,
    automationLevel: readString(body, "automation_level", "automationLevel"),
    decisionImpact: readOptionalString(body, "decision_impact", "decisionImpact"),
    regulatedDomain: readBoolean(body, "regulated_domain", "regulatedDomain"),
    regulatedDomainNotes: readOptionalString(body, "regulated_domain_notes", "regulatedDomainNotes"),
    scale: readOptionalString(body, "scale"),
    knownUnknowns,
    clientId: readOptionalString(body, "client_id", "clientId"),
    aiSystemId: readOptionalString(body, "ai_system_id", "aiSystemId"),
  };
}

function parseApprovalDecisionInput(body: Record<string, unknown>): ApprovalDecisionInput {
  const decision = readString(body, "decision") as ApprovalDecisionInput["decision"];
  return {
    decidedBy: readString(body, "decided_by", "decidedBy"),
    actorRole: readApprovalRole(body, "actor_role", "actorRole"),
    decision,
    notes: readOptionalString(body, "notes"),
    overrideReason: readOptionalString(body, "override_reason", "overrideReason"),
    decidedAtIso: readOptionalString(body, "decided_at", "decidedAt"),
  };
}

async function withApprovalRequestContext(
  deliverable: DeliverableRecord,
  approvalRequest: {
    requestId: string;
    requiredRoles: ApprovalRole[];
    approvalsReceived: ApprovalRole[];
    latestDecisionSummary: string;
    updatedAtIso: string;
  },
): Promise<DeliverableRecord> {
  const content = {
    ...deliverable.content,
    approvalWorkflow: {
      requestId: approvalRequest.requestId,
      status: "pending",
      requiredRoles: approvalRequest.requiredRoles,
      approvalsReceived: approvalRequest.approvalsReceived,
      latestDecisionSummary: approvalRequest.latestDecisionSummary,
      decisions: [],
    },
  };
  return {
    ...deliverable,
    status: "pending_approval",
    content,
    contentHash: await deterministicHashObject(content),
    updatedAtIso: approvalRequest.updatedAtIso,
  };
}

function deriveUseCaseLifecycleState(
  gateStatus: Record<string, string>,
  approvalStatus?: "pending" | "approved" | "rejected" | "overridden" | undefined,
): { currentGate: string; status: string } {
  if (gateStatus.approved_for_deploy === "complete") {
    return { currentGate: "approved_for_deploy", status: "approved_for_deploy" };
  }
  if (approvalStatus === "rejected") {
    return {
      currentGate: gateStatus.controls_satisfied === "complete" ? "controls_satisfied" : "risk_assessed",
      status: "approval_rejected",
    };
  }
  if (gateStatus.approved_for_deploy === "pending" || approvalStatus === "pending") {
    return {
      currentGate: gateStatus.controls_satisfied === "complete" ? "controls_satisfied" : "risk_assessed",
      status: "approval_pending",
    };
  }
  if (gateStatus.controls_satisfied === "complete") {
    return { currentGate: "controls_satisfied", status: "controls_satisfied" };
  }
  return { currentGate: "risk_assessed", status: "risk_assessed" };
}

function finalizeDeliverableStatus(
  deliverable: DeliverableRecord,
  approvalStatus: "pending" | "approved" | "rejected" | "overridden",
  updatedAtIso: string,
): DeliverableRecord {
  if (approvalStatus === "pending") {
    return {
      ...deliverable,
      status: "pending_approval",
      updatedAtIso,
    };
  }

  if (approvalStatus === "rejected") {
    return {
      ...deliverable,
      status: "rejected",
      updatedAtIso,
      approvedAtIso: undefined,
    };
  }

  return {
    ...deliverable,
    status: "approved",
    updatedAtIso,
    approvedAtIso: updatedAtIso,
  };
}

function toAcceptedEvidenceCitations(
  evidence: Array<{
    acceptanceState: "accepted_for_governance" | "rejected_for_governance";
    payload: HandoffPayload;
  }>,
): Array<{
  payloadId: string;
  packageHash: string;
  artifactId: string;
  sourceFilename: string;
  reviewStatus: string;
  evidenceTier: number;
  receivedAtIso: string;
}> {
  return evidence
    .filter((record) => record.acceptanceState === "accepted_for_governance")
    .map((record) => ({
      payloadId: record.payload.payloadId,
      packageHash: record.payload.packageHash,
      artifactId: record.payload.fileRef.artifactId,
      sourceFilename: record.payload.fileRef.sourceFilename,
      reviewStatus: record.payload.reviewStatus,
      evidenceTier: record.payload.evidenceTier,
      receivedAtIso: record.payload.fileRef.receivedAtIso,
    }));
}

async function readJsonRecord(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const payload = await request.json();
    return isRecord(payload) ? payload : null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(body: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = body[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

function readOptionalString(body: Record<string, unknown>, ...keys: string[]): string | undefined {
  const value = readString(body, ...keys);
  return value.length > 0 ? value : undefined;
}

function readBoolean(body: Record<string, unknown>, ...keys: string[]): boolean {
  for (const key of keys) {
    const value = body[key];
    if (typeof value === "boolean") {
      return value;
    }
  }
  return false;
}

function readStringArray(body: Record<string, unknown>, ...keys: string[]): string[] {
  for (const key of keys) {
    const value = body[key];
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  }
  return [];
}

function readApprovalRole(
  body: Record<string, unknown>,
  firstKey: string,
  secondKey?: string | undefined,
  fallback?: ApprovalRole | undefined,
): ApprovalRole {
  const keys = [firstKey, ...(secondKey ? [secondKey] : [])];
  const hasExplicitValue = keys.some((key) => body[key] !== undefined && body[key] !== null);
  const value = readOptionalString(body, ...keys);
  if (!hasExplicitValue) {
    return fallback ?? "approver";
  }
  if (value === "governance_admin" || value === "risk_owner" || value === "approver" || value === "independent_reviewer") {
    return value;
  }
  throw new CompassApprovalError("INVALID_APPROVAL_ROLE", {
    providedRole: value ?? body[firstKey] ?? (secondKey ? body[secondKey] : undefined),
  });
}

function handleGovernanceError(error: unknown): Response {
  if (error instanceof CompassGovernanceError) {
    const status = error.code === "USE_CASE_NOT_FOUND" ? 404 : error.code === "LATEST_ASSESSMENT_REQUIRED" ? 409 : 422;
    return jsonResponse({ error: "governance_rejected", code: error.code }, status);
  }
  return jsonResponse({ error: "internal_error", code: "INTERNAL" }, 500);
}

function handleApprovalError(error: unknown): Response {
  if (error instanceof CompassApprovalError) {
    const status =
      error.code === "APPROVAL_REQUEST_NOT_FOUND"
        ? 404
        : error.code === "D1_WRITE_FAILED"
          ? 500
          : error.code === "APPROVAL_ROLE_NOT_REQUIRED" ||
              error.code === "APPROVAL_ROLE_ALREADY_DECIDED" ||
              error.code === "INVALID_APPROVAL_ROLE"
            ? 422
            : 409;
    return jsonResponse({ error: "approval_rejected", code: error.code }, status);
  }
  return jsonResponse({ error: "internal_error", code: "INTERNAL" }, 500);
}
