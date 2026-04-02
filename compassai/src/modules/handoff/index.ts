// COMPASSai — evidence handoff receiver
// Source: Spec 05 — cross-system-evidence-handoff

import { deterministicHashObject } from "../../../../shared/utils/hash";
import { CompassHandoffError } from "../../lib/errors";
import { getEvidenceByPayloadId, getUseCaseById, recordAuditEvent, recordEvidencePackage, recordFeedbackAction, updateUseCaseEvidenceState } from "../../storage/d1";
import type { HandoffPayload } from "./types";

export interface ReceiveHandoffResult {
  received: true;
  handoffId: string;
  acceptanceState: "accepted_for_governance" | "rejected_for_governance";
  useCaseId: string;
  rejectionReason: string | null;
  idempotent?: true;
}

export async function receiveHandoff(
  payload: HandoffPayload,
  env?: { COMPASS_DB?: D1Database },
): Promise<ReceiveHandoffResult> {
  validatePayloadEnvelope(payload);

  const expectedPayloadId = await deterministicHashObject(payloadBody(payload));
  if (expectedPayloadId !== payload.payloadId) {
    throw new CompassHandoffError("HASH_MISMATCH", {
      expectedPayloadId,
      actualPayloadId: payload.payloadId,
    });
  }

  if (env?.COMPASS_DB) {
    const useCase = await getUseCaseById(env.COMPASS_DB, payload.useCaseId);
    if (!useCase) {
      throw new CompassHandoffError("USE_CASE_NOT_FOUND", { useCaseId: payload.useCaseId });
    }

    const existing = await getEvidenceByPayloadId(env.COMPASS_DB, payload.payloadId);
    if (existing) {
      return {
        received: true,
        handoffId: existing.payload_id,
        acceptanceState: existing.acceptance_state,
        useCaseId: existing.use_case_id,
        rejectionReason: existing.rejection_reason,
        idempotent: true,
      };
    }
    if (env.COMPASS_DB) {
      const rejectionReasons: string[] = [];
      if (!payload.schemaVersion.trim()) {
        rejectionReasons.push("schema_version_missing");
      }
      if (!payload.packageHash.trim()) {
        rejectionReasons.push("package_hash_missing");
      }
      if (payload.extractedEvidence.length === 0) {
        rejectionReasons.push("extracted_evidence_empty");
      }
      if (!payload.admissible) {
        rejectionReasons.push(payload.reviewReason ?? "package_marked_inadmissible_by_aurora");
      }

      const acceptanceState: ReceiveHandoffResult["acceptanceState"] =
        rejectionReasons.length === 0 ? "accepted_for_governance" : "rejected_for_governance";
      const rejectionReason = rejectionReasons.length > 0 ? rejectionReasons.join("; ") : null;
      const createdAt = payload.emittedAtIso;

      await recordEvidencePackage(env.COMPASS_DB, {
        payload,
        acceptanceState,
        rejectionReason,
        createdAt,
      });

      let feedbackActionCountDelta = 0;
      let feedbackActionId: string | null = null;
      if (acceptanceState === "accepted_for_governance") {
        if (useCase.latestAssessmentId && useCase.currentCycleId) {
          const feedbackAction = {
            id: crypto.randomUUID(),
            useCaseId: useCase.id,
            cycleId: useCase.currentCycleId,
            sourceAssessmentId: useCase.latestAssessmentId,
            actionType: "reassess_due_to_new_evidence",
            requestedState: "risk_reassessment_required",
            rationale: "New evidence changed the record after a prior assessment and should trigger reassessment.",
            status: "open" as const,
            createdAtIso: createdAt,
          };
          await recordFeedbackAction(env.COMPASS_DB, feedbackAction);
          feedbackActionCountDelta = 1;
          feedbackActionId = feedbackAction.id;
        }

        await updateUseCaseEvidenceState(env.COMPASS_DB, {
          useCase,
          updatedAt: createdAt,
          evidenceCount: useCase.evidenceCount + 1,
          feedbackActionCountDelta,
        });
      }

      await recordAuditEvent(env.COMPASS_DB, {
        eventId: `${payload.payloadId}:${acceptanceState}`,
        aggregateType: "use_case",
        aggregateId: payload.useCaseId,
        eventType: acceptanceState,
        eventPayload: {
          payloadId: payload.payloadId,
          packageHash: payload.packageHash,
          schemaVersion: payload.schemaVersion,
          rejectionReason,
          feedbackActionId,
        },
        createdAt,
      });

      return {
        received: true,
        handoffId: payload.payloadId,
        acceptanceState,
        useCaseId: payload.useCaseId,
        rejectionReason,
      };
    }
  }

  return {
    received: true,
    handoffId: payload.payloadId,
    acceptanceState: payload.admissible ? "accepted_for_governance" : "rejected_for_governance",
    useCaseId: payload.useCaseId,
    rejectionReason: payload.admissible ? null : payload.reviewReason ?? "package_marked_inadmissible_by_aurora",
  };
}

function validatePayloadEnvelope(payload: HandoffPayload): void {
  if (payload.sourceSystem !== "AurorA") {
    throw new CompassHandoffError("INVALID_SOURCE_SYSTEM", { sourceSystem: payload.sourceSystem });
  }

  if (payload.targetSystem !== "COMPASSai") {
    throw new CompassHandoffError("INVALID_TARGET_SYSTEM", { targetSystem: payload.targetSystem });
  }

  if (!payload.useCaseId.trim()) {
    throw new CompassHandoffError("MISSING_USE_CASE_ID");
  }

  if (!payload.payloadId.trim()) {
    throw new CompassHandoffError("INVALID_PAYLOAD", { field: "payloadId" });
  }
}

function payloadBody(payload: HandoffPayload): Omit<HandoffPayload, "payloadId"> {
  const { payloadId: _payloadId, ...body } = payload;
  return body;
}
