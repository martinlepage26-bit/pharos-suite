// Aurora — Cloudflare Worker entry point
// Source: Spec 03 (intake), Spec 04 (extraction), Spec 05 (handoff), Spec 10 (release guardrails)

import type {
  AurorADocumentClosureExposedStatus,
  AurorADocumentClosureFetchTransport,
  AurorADocumentClosureView,
  CrossSystemLineageClosure,
  DataLineage,
  LineageIntegrity,
} from "../../shared/types/lineage";
import { deterministicHash, deterministicHashObject } from "../../shared/utils/hash";
import { handleIntake } from "./modules/intake/index";
import type { IntakeAcceptedResult } from "./modules/intake/types";
import { runExtraction } from "./modules/extraction/index";
import type { ExtractionFieldInput, ExtractionJob, ExtractionResult } from "./modules/extraction/types";
import { buildExtractionResultFromLogRecord, emitHandoff } from "./modules/handoff/index";
import { AuroraExtractionError, AuroraHandoffError, StorageWriteError } from "./lib/errors";
import { log } from "./lib/logger";
import {
  ensureArtifactLineageRoot,
  getAuroraLineageSnapshot,
  getIntakeById,
  getLatestExtractionLogByArtifactId,
  recordEvidencePackage,
  recordHandoffAuditEvent,
  type IntakeRecord,
} from "./storage/d1";

interface Env {
  AURORA_FILES: R2Bucket;
  AURORA_DB: D1Database;
  COMPASSAI_BASE_URL?: string;
  COMPASSAI_INGEST_TOKEN?: string;
  COMPASSAI_CLOSURE_READ_TOKEN?: string;
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getRequiredField(
  formData: FormData,
  canonicalName: string,
  legacyAlias?: string,
): string | null {
  const value = formData.get(canonicalName);
  if (typeof value === "string" && value) {
    return value;
  }

  if (legacyAlias) {
    const legacyValue = formData.get(legacyAlias);
    if (typeof legacyValue === "string" && legacyValue) {
      return legacyValue;
    }
  }

  return null;
}

function getOptionalField(
  formData: FormData,
  canonicalName: string,
  legacyAlias?: string,
): string | undefined {
  const value = formData.get(canonicalName);
  if (typeof value === "string" && value) {
    return value;
  }

  if (legacyAlias) {
    const legacyValue = formData.get(legacyAlias);
    if (typeof legacyValue === "string" && legacyValue) {
      return legacyValue;
    }
  }

  return undefined;
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/documents/upload") {
      if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      let formData: FormData;
      try {
        formData = await request.formData();
      } catch {
        return jsonResponse({ error: "invalid_multipart", code: "MALFORMED_HEADER" }, 400);
      }

      const fileEntry = formData.get("file") as unknown as File | string | null;
      if (!fileEntry || typeof fileEntry === "string") {
        return jsonResponse({ error: "missing required field: file", code: "MISSING_FIELD" }, 400);
      }
      const file = fileEntry;

      const sourceChannel = getRequiredField(formData, "source_channel");
      if (!sourceChannel) {
        return jsonResponse({ error: "missing required field: source_channel", code: "MISSING_FIELD" }, 400);
      }

      const operatorOrServiceIdentity = getRequiredField(
        formData,
        "operator_or_service_identity",
        "submittedBy",
      );
      if (!operatorOrServiceIdentity) {
        return jsonResponse(
          { error: "missing required field: operator_or_service_identity", code: "MISSING_FIELD" },
          400,
        );
      }

      const fileBuffer = await file.arrayBuffer();
      const intakeRequest = {
        file_buffer: fileBuffer,
        source_filename: file.name,
        source_mime_type: file.type,
        source_channel: sourceChannel,
        operator_or_service_identity: operatorOrServiceIdentity,
        document_type_hint: getOptionalField(formData, "document_type_hint"),
        jurisdiction_context: getOptionalField(formData, "jurisdiction_context", "jurisdictionCode"),
        legal_basis: getOptionalField(formData, "legal_basis"),
        purpose_of_processing: getOptionalField(formData, "purpose_of_processing"),
        retention_profile: getOptionalField(formData, "retention_profile"),
      };

      try {
        const result = await handleIntake(intakeRequest, env);

        if (result.intake_state === "rejected") {
          return jsonResponse(result, 422);
        }

        return jsonResponse(result, 200);
      } catch (error) {
        if (error instanceof StorageWriteError) {
          log("error", "storage_error", { error, code: error.code });
          return jsonResponse({ error: "storage_error", code: error.code }, 502);
        }
        log("error", "unexpected_error", { error: asError(error) });
        return jsonResponse({ error: "internal_error", code: "INTERNAL" }, 500);
      }
    }

    const extractionMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/extract$/);
    if (extractionMatch) {
      if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      const artifactId = extractionMatch[1];
      const intakeRecord = await getIntakeById(env.AURORA_DB, artifactId);
      if (!intakeRecord) {
        return jsonResponse({ error: "document_not_found", code: "NOT_FOUND" }, 404);
      }
      await ensureArtifactLineageRoot(env.AURORA_DB, intakeRecord);

      const body = await readJsonRecord(request);
      if (!body) {
        return jsonResponse({ error: "invalid_json", code: "MALFORMED_HEADER" }, 400);
      }

      try {
        const latestExtractionLog = await getLatestExtractionLogByArtifactId(env.AURORA_DB, artifactId);
        const result = await runExtraction(
          buildExtractionJob(intakeRecord, normalizeExtractionBody(body), latestExtractionLog?.processing_run_id ?? null),
          {
            AURORA_DB: env.AURORA_DB,
          },
        );
        return jsonResponse(result, 200);
      } catch (error) {
        if (error instanceof AuroraExtractionError) {
          log("warn", "extraction_rejected", { code: error.code, context: error.context, artifactId });
          return jsonResponse({ error: "extraction_validation_failed", code: error.code }, 422);
        }
        if (error instanceof StorageWriteError) {
          log("error", "storage_error", { error, code: error.code, artifactId });
          return jsonResponse({ error: "storage_error", code: error.code }, 502);
        }
        log("error", "unexpected_error", { error: asError(error), artifactId });
        return jsonResponse({ error: "internal_error", code: "INTERNAL" }, 500);
      }
    }

    const evidencePackageMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/evidence-package$/);
    if (evidencePackageMatch) {
      if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      const artifactId = evidencePackageMatch[1];
      const intakeRecord = await getIntakeById(env.AURORA_DB, artifactId);
      if (!intakeRecord) {
        return jsonResponse({ error: "document_not_found", code: "NOT_FOUND" }, 404);
      }
      await ensureArtifactLineageRoot(env.AURORA_DB, intakeRecord);

      const body = await readJsonRecord(request);
      if (!body) {
        return jsonResponse({ error: "invalid_json", code: "MALFORMED_HEADER" }, 400);
      }

      try {
        const extractionResult = await resolveExtractionResult(intakeRecord, body, env);
        const handoffPayload = await emitHandoff(toAcceptedIntakeResult(intakeRecord), extractionResult, {
          useCaseId: readString(body, "use_case_id", "useCaseId", "usecase_id"),
          sessionRef: readString(body, "session_ref", "sessionRef") || undefined,
        });
        await recordEvidencePackage(env.AURORA_DB, handoffPayload);
        return jsonResponse(handoffPayload, 200);
      } catch (error) {
        if (error instanceof AuroraExtractionError || error instanceof AuroraHandoffError) {
          return jsonResponse({ error: "handoff_validation_failed", code: error.code }, 422);
        }
        if (error instanceof StorageWriteError) {
          return jsonResponse({ error: "storage_error", code: error.code }, 502);
        }
        log("error", "unexpected_error", { error: asError(error), artifactId });
        return jsonResponse({ error: "internal_error", code: "INTERNAL" }, 500);
      }
    }

    const handoffMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/handoff-to-compassai$/);
    if (handoffMatch) {
      if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      const artifactId = handoffMatch[1];
      const intakeRecord = await getIntakeById(env.AURORA_DB, artifactId);
      if (!intakeRecord) {
        return jsonResponse({ error: "document_not_found", code: "NOT_FOUND" }, 404);
      }
      await ensureArtifactLineageRoot(env.AURORA_DB, intakeRecord);

      const body = await readJsonRecord(request);
      if (!body) {
        return jsonResponse({ error: "invalid_json", code: "MALFORMED_HEADER" }, 400);
      }

      try {
        const extractionResult = await resolveExtractionResult(intakeRecord, body, env);
        const handoffPayload = await emitHandoff(toAcceptedIntakeResult(intakeRecord), extractionResult, {
          useCaseId: readString(body, "use_case_id", "useCaseId", "usecase_id"),
          sessionRef: readString(body, "session_ref", "sessionRef") || undefined,
        });
        await recordEvidencePackage(env.AURORA_DB, handoffPayload);
        const targetBaseUrl = readString(body, "compassai_base_url", "compassaiBaseUrl") || env.COMPASSAI_BASE_URL || "";
        if (!targetBaseUrl.trim()) {
          throw new AuroraHandoffError("HANDOFF_REQUIRES_COMPASS_ENDPOINT", { artifactId });
        }

        const targetUrl = `${targetBaseUrl.replace(/\/$/, "")}/api/v1/evidence`;
        const attemptTimestamp = new Date().toISOString();
        await recordHandoffAuditEvent(env.AURORA_DB, {
          eventId: await deterministicHash(`${handoffPayload.payloadId}:handoff_attempted:${attemptTimestamp}`),
          artifactId,
          extractionId: extractionResult.extractionId,
          payloadId: handoffPayload.payloadId,
          useCaseId: handoffPayload.useCaseId,
          targetSystem: "COMPASSai",
          targetEndpoint: targetUrl,
          eventType: "handoff_attempted",
          createdAt: attemptTimestamp,
        });

        const response = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(env.COMPASSAI_INGEST_TOKEN ? { Authorization: `Bearer ${env.COMPASSAI_INGEST_TOKEN}` } : {}),
          },
          body: JSON.stringify(handoffPayload),
        });

        const responseBody = await readResponseBody(response);
        const resultEventTimestamp = new Date().toISOString();
        await recordHandoffAuditEvent(env.AURORA_DB, {
          eventId: await deterministicHash(
            `${handoffPayload.payloadId}:${response.ok ? "handoff_succeeded" : "handoff_failed"}:${resultEventTimestamp}`,
          ),
          artifactId,
          extractionId: extractionResult.extractionId,
          payloadId: handoffPayload.payloadId,
          useCaseId: handoffPayload.useCaseId,
          targetSystem: "COMPASSai",
          targetEndpoint: targetUrl,
          eventType: response.ok ? "handoff_succeeded" : "handoff_failed",
          httpStatus: response.status,
          errorCode: response.ok ? null : "COMPASS_RESPONSE_ERROR",
          responseBody,
          createdAt: resultEventTimestamp,
        });

        return jsonResponse(
          {
            handoffPayload,
            compassaiResponse: responseBody,
          },
          response.status,
        );
      } catch (error) {
        if (error instanceof AuroraExtractionError || error instanceof AuroraHandoffError) {
          return jsonResponse({ error: "handoff_validation_failed", code: error.code }, 422);
        }
        if (error instanceof StorageWriteError) {
          return jsonResponse({ error: "storage_error", code: error.code }, 502);
        }

        const fallbackTimestamp = new Date().toISOString();
        const useCaseId = readString(body, "use_case_id", "useCaseId", "usecase_id");
        const extractionLog = await getLatestExtractionLogByArtifactId(env.AURORA_DB, artifactId);
        if (useCaseId && extractionLog) {
          await recordHandoffAuditEvent(env.AURORA_DB, {
            eventId: await deterministicHash(`${artifactId}:handoff_failed:${fallbackTimestamp}`),
            artifactId,
            extractionId: extractionLog.extraction_id,
            useCaseId,
            targetSystem: "COMPASSai",
            targetEndpoint: readString(body, "compassai_base_url", "compassaiBaseUrl") || env.COMPASSAI_BASE_URL || "",
            eventType: "handoff_failed",
            errorCode: "HANDOFF_TRANSPORT_FAILED",
            responseBody: { message: asError(error).message },
            createdAt: fallbackTimestamp,
          });
        }
        return jsonResponse({ error: "handoff_transport_failed", code: "HANDOFF_TRANSPORT_FAILED" }, 502);
      }
    }

    const lineageMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/lineage$/);
    if (lineageMatch) {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      const artifactId = lineageMatch[1];
      const lineage = await getAuroraLineageSnapshot(env.AURORA_DB, artifactId);
      if (!lineage) {
        return jsonResponse({ error: "document_not_found", code: "NOT_FOUND" }, 404);
      }

      return jsonResponse(lineage, 200);
    }

    const statusMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/status$/);
    if (statusMatch) {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      const artifactId = statusMatch[1];
      const lineage = await getAuroraLineageSnapshot(env.AURORA_DB, artifactId);
      if (!lineage) {
        return jsonResponse({ error: "document_not_found", code: "NOT_FOUND" }, 404);
      }

      return jsonResponse(lineage.exposedStatus, 200);
    }

    const closureMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/closure$/);
    if (closureMatch) {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
      }

      const artifactId = closureMatch[1];
      const auroraLineage = await getAuroraLineageSnapshot(env.AURORA_DB, artifactId);
      if (!auroraLineage) {
        return jsonResponse({ error: "document_not_found", code: "NOT_FOUND" }, 404);
      }

      const closureView = await buildDocumentClosureView({
        artifactId,
        auroraLineage,
        explicitUseCaseId:
          readSearchString(url.searchParams, "use_case_id", "useCaseId", "usecase_id") || undefined,
        compassaiBaseUrl: env.COMPASSAI_BASE_URL?.trim() || undefined,
        compassaiClosureReadToken: env.COMPASSAI_CLOSURE_READ_TOKEN,
      });

      return jsonResponse(closureView, 200);
    }

    return jsonResponse({ error: "not_found", code: "NOT_FOUND" }, 404);
  },
};

async function resolveExtractionResult(
  intakeRecord: IntakeRecord,
  body: Record<string, unknown>,
  env: Env,
): Promise<ExtractionResult> {
  const extractionBody = normalizeExtractionBody(body);
  const documentType = readString(extractionBody, "document_type", "documentType");
  const fields = extractionBody.fields;

  if (documentType && isRecord(fields) && Object.keys(fields).length > 0) {
    const latestExtractionLog = await getLatestExtractionLogByArtifactId(env.AURORA_DB, intakeRecord.artifact_id);
    return runExtraction(
      buildExtractionJob(intakeRecord, extractionBody, latestExtractionLog?.processing_run_id ?? null),
      {
        AURORA_DB: env.AURORA_DB,
      },
    );
  }

  const latestExtractionLog = await getLatestExtractionLogByArtifactId(env.AURORA_DB, intakeRecord.artifact_id);
  if (!latestExtractionLog) {
    throw new AuroraHandoffError("HANDOFF_REQUIRES_EXTRACTED_EVIDENCE", {
      artifactId: intakeRecord.artifact_id,
    });
  }

  return buildExtractionResultFromLogRecord(latestExtractionLog);
}

function buildExtractionJob(
  intakeRecord: IntakeRecord,
  body: Record<string, unknown>,
  latestProcessingRunId?: string | null,
): ExtractionJob {
  const explicitParentRunId = readString(body, "parent_run_id", "parentRunId");

  return {
    intakeId: intakeRecord.artifact_id,
    r2Key: intakeRecord.r2_key,
    mimeType: intakeRecord.source_mime_type,
    sourceHash: intakeRecord.source_hash,
    sourceFilename: intakeRecord.source_filename,
    operatorOrServiceIdentity: intakeRecord.operator_or_service_identity,
    documentType: readString(body, "document_type", "documentType"),
    fields: isRecord(body.fields) ? (body.fields as Record<string, string | number | boolean | ExtractionFieldInput>) : {},
    defaultThreshold: readNumber(body, "default_threshold", "threshold", "defaultThreshold"),
    fieldThresholds: readNumberMap(body, "field_thresholds", "fieldThresholds"),
    mandatoryFields: readStringArray(body, "mandatory_fields", "mandatoryFields"),
    hitlRequiredWhen: readStringArray(body, "hitl_required_when", "hitlRequiredWhen"),
    piiPatterns: readStringArray(body, "pii_patterns", "piiPatterns"),
    legalBasis: intakeRecord.legal_basis ?? undefined,
    purpose: intakeRecord.purpose_of_processing ?? undefined,
    jurisdictionContext: intakeRecord.jurisdiction_context ?? undefined,
    retentionProfile: intakeRecord.retention_profile ?? undefined,
    processorId: readString(body, "processor_id", "processorId") || undefined,
    modelVersion: readString(body, "model_version", "modelVersion") || undefined,
    parentRunId: explicitParentRunId || latestProcessingRunId || undefined,
    benchmark: {
      accuracyScore: readNumber(body, "accuracy_score_benchmark", "accuracyScoreBenchmark"),
      dataset: readString(body, "benchmark_dataset", "benchmarkDataset") || undefined,
      date: readString(body, "benchmark_date", "benchmarkDate") || undefined,
    },
  };
}

async function buildDocumentClosureView(params: {
  artifactId: string;
  auroraLineage: DataLineage;
  explicitUseCaseId?: string | undefined;
  compassaiBaseUrl?: string | undefined;
  compassaiClosureReadToken?: string | undefined;
}): Promise<AurorADocumentClosureView> {
  const candidateUseCaseIds = collectCandidateUseCaseIds(params.auroraLineage);
  const latestPackageId = params.auroraLineage.exposedStatus.latestPackageId;
  const latestHandoffId = params.auroraLineage.exposedStatus.latestHandoffId;
  const localDegradedReasons =
    params.auroraLineage.exposedStatus.lineageIntegrity === "degraded"
      ? params.auroraLineage.exposedStatus.reasons.map((reason) => `AurorA: ${reason}`)
      : [];
  const transport: AurorADocumentClosureFetchTransport = {
    targetSystem: "COMPASSai",
    targetEndpoint: null,
    httpStatus: null,
    fetchedAt: null,
  };

  const requestedUseCaseId = params.explicitUseCaseId?.trim() ?? "";
  if (requestedUseCaseId && !candidateUseCaseIds.includes(requestedUseCaseId)) {
    return finalizeDocumentClosureView({
      artifactId: params.artifactId,
      auroraLineage: params.auroraLineage,
      compassaiClosure: null,
      transport,
      exposedStatus: {
        state: "governance_unavailable",
        lineageIntegrity: "degraded",
        reasons: [
          ...localDegradedReasons,
          `Requested use_case_id ${requestedUseCaseId} is not linked to this document in AurorA evidence packages.`,
        ],
        resolvedUseCaseId: null,
        candidateUseCaseIds,
        latestPackageId,
        latestHandoffId,
        auroraState: params.auroraLineage.exposedStatus.state,
        governanceState: null,
      },
    });
  }

  if (!requestedUseCaseId && candidateUseCaseIds.length === 0) {
    return finalizeDocumentClosureView({
      artifactId: params.artifactId,
      auroraLineage: params.auroraLineage,
      compassaiClosure: null,
      transport,
      exposedStatus: {
        state: "local_only",
        lineageIntegrity: params.auroraLineage.exposedStatus.lineageIntegrity,
        reasons: [
          ...localDegradedReasons,
          "No evidence package has been linked to a COMPASSai use case yet.",
        ],
        resolvedUseCaseId: null,
        candidateUseCaseIds,
        latestPackageId,
        latestHandoffId,
        auroraState: params.auroraLineage.exposedStatus.state,
        governanceState: null,
      },
    });
  }

  if (!requestedUseCaseId && candidateUseCaseIds.length > 1) {
    return finalizeDocumentClosureView({
      artifactId: params.artifactId,
      auroraLineage: params.auroraLineage,
      compassaiClosure: null,
      transport,
      exposedStatus: {
        state: "governance_ambiguous",
        lineageIntegrity: "degraded",
        reasons: [
          ...localDegradedReasons,
          "Multiple COMPASSai use_case_ids are linked to this document; pass use_case_id explicitly to fetch one governance closure.",
        ],
        resolvedUseCaseId: null,
        candidateUseCaseIds,
        latestPackageId,
        latestHandoffId,
        auroraState: params.auroraLineage.exposedStatus.state,
        governanceState: null,
      },
    });
  }

  const resolvedUseCaseId = requestedUseCaseId || candidateUseCaseIds[0] || null;
  if (!resolvedUseCaseId) {
    return finalizeDocumentClosureView({
      artifactId: params.artifactId,
      auroraLineage: params.auroraLineage,
      compassaiClosure: null,
      transport,
      exposedStatus: {
        state: "local_only",
        lineageIntegrity: params.auroraLineage.exposedStatus.lineageIntegrity,
        reasons: [...localDegradedReasons],
        resolvedUseCaseId: null,
        candidateUseCaseIds,
        latestPackageId,
        latestHandoffId,
        auroraState: params.auroraLineage.exposedStatus.state,
        governanceState: null,
      },
    });
  }

  if (!params.compassaiBaseUrl?.trim()) {
    return finalizeDocumentClosureView({
      artifactId: params.artifactId,
      auroraLineage: params.auroraLineage,
      compassaiClosure: null,
      transport,
      exposedStatus: {
        state: "governance_unavailable",
        lineageIntegrity: "degraded",
        reasons: [
          ...localDegradedReasons,
          "COMPASSAI_BASE_URL is not configured for AurorA closure fetch-through.",
        ],
        resolvedUseCaseId,
        candidateUseCaseIds,
        latestPackageId,
        latestHandoffId,
        auroraState: params.auroraLineage.exposedStatus.state,
        governanceState: null,
      },
    });
  }

  const targetEndpoint = `${params.compassaiBaseUrl.replace(/\/$/, "")}/api/v1/use-cases/${encodeURIComponent(
    resolvedUseCaseId,
  )}/closure`;
  const fetchedAt = new Date().toISOString();
  transport.targetEndpoint = targetEndpoint;
  transport.fetchedAt = fetchedAt;

  try {
    const headers = params.compassaiClosureReadToken
      ? ({ Authorization: `Bearer ${params.compassaiClosureReadToken}` } as HeadersInit)
      : {};
    const response = await fetch(targetEndpoint, {
      method: "GET",
      headers,
    });
    transport.httpStatus = response.status;

    if (!response.ok) {
      return finalizeDocumentClosureView({
        artifactId: params.artifactId,
        auroraLineage: params.auroraLineage,
        compassaiClosure: null,
        transport,
        exposedStatus: {
          state: "governance_unavailable",
          lineageIntegrity: "degraded",
          reasons: [
            ...localDegradedReasons,
            `COMPASSai closure fetch returned HTTP ${response.status} for use_case_id ${resolvedUseCaseId}.`,
          ],
          resolvedUseCaseId,
          candidateUseCaseIds,
          latestPackageId,
          latestHandoffId,
          auroraState: params.auroraLineage.exposedStatus.state,
          governanceState: null,
        },
      });
    }

    const responseBody = await readResponseBody(response);
    if (!isCrossSystemClosure(responseBody)) {
      return finalizeDocumentClosureView({
        artifactId: params.artifactId,
        auroraLineage: params.auroraLineage,
        compassaiClosure: null,
        transport,
        exposedStatus: {
          state: "governance_unavailable",
          lineageIntegrity: "degraded",
          reasons: [
            ...localDegradedReasons,
            `COMPASSai closure fetch returned an invalid closure body for use_case_id ${resolvedUseCaseId}.`,
          ],
          resolvedUseCaseId,
          candidateUseCaseIds,
          latestPackageId,
          latestHandoffId,
          auroraState: params.auroraLineage.exposedStatus.state,
          governanceState: null,
        },
      });
    }

    const remoteDegradedReasons =
      responseBody.closure.exposedStatus.lineageIntegrity === "degraded"
        ? responseBody.closure.exposedStatus.reasons.map((reason) => `COMPASSai: ${reason}`)
        : [];
    const lineageIntegrity: LineageIntegrity =
      params.auroraLineage.exposedStatus.lineageIntegrity === "degraded" ||
      responseBody.closure.exposedStatus.lineageIntegrity === "degraded"
        ? "degraded"
        : "complete";

    return finalizeDocumentClosureView({
      artifactId: params.artifactId,
      auroraLineage: params.auroraLineage,
      compassaiClosure: responseBody,
      transport,
      exposedStatus: {
        state: "governance_linked",
        lineageIntegrity,
        reasons: [...localDegradedReasons, ...remoteDegradedReasons],
        resolvedUseCaseId,
        candidateUseCaseIds,
        latestPackageId,
        latestHandoffId,
        auroraState: params.auroraLineage.exposedStatus.state,
        governanceState: responseBody.closure.exposedStatus.state,
      },
    });
  } catch (error) {
    return finalizeDocumentClosureView({
      artifactId: params.artifactId,
      auroraLineage: params.auroraLineage,
      compassaiClosure: null,
      transport,
      exposedStatus: {
        state: "governance_unavailable",
        lineageIntegrity: "degraded",
        reasons: [
          ...localDegradedReasons,
          `COMPASSai closure fetch failed for use_case_id ${resolvedUseCaseId}: ${asError(error).message}`,
        ],
        resolvedUseCaseId,
        candidateUseCaseIds,
        latestPackageId,
        latestHandoffId,
        auroraState: params.auroraLineage.exposedStatus.state,
        governanceState: null,
      },
    });
  }
}

async function finalizeDocumentClosureView(params: {
  artifactId: string;
  auroraLineage: DataLineage;
  compassaiClosure: CrossSystemLineageClosure | null;
  transport: AurorADocumentClosureFetchTransport;
  exposedStatus: AurorADocumentClosureExposedStatus;
}): Promise<AurorADocumentClosureView> {
  const closureId = await deterministicHashObject({
    artifactId: params.artifactId,
    auroraLineageId: params.auroraLineage.lineageId,
    compassaiClosureId: params.compassaiClosure?.closureId ?? null,
    state: params.exposedStatus.state,
    resolvedUseCaseId: params.exposedStatus.resolvedUseCaseId,
    transport: {
      targetEndpoint: params.transport.targetEndpoint,
      httpStatus: params.transport.httpStatus,
    },
  });

  return {
    closureId,
    artifactId: params.artifactId,
    aurora: params.auroraLineage,
    compassai: params.compassaiClosure,
    fetchThrough: {
      transport: params.transport,
      exposedStatus: params.exposedStatus,
    },
  };
}

function collectCandidateUseCaseIds(lineage: DataLineage): string[] {
  const orderedPackages = [...lineage.evidencePackages].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  const seen = new Set<string>();
  const useCaseIds: string[] = [];

  for (const pkg of orderedPackages) {
    const useCaseId = pkg.useCaseId.trim();
    if (!useCaseId || seen.has(useCaseId)) {
      continue;
    }
    seen.add(useCaseId);
    useCaseIds.push(useCaseId);
  }

  return useCaseIds;
}

function isCrossSystemClosure(value: unknown): value is CrossSystemLineageClosure {
  if (!isRecord(value) || typeof value.closureId !== "string") {
    return false;
  }

  const closure = value.closure;
  if (!isRecord(closure) || !isRecord(closure.exposedStatus)) {
    return false;
  }

  return typeof closure.exposedStatus.state === "string";
}

function normalizeExtractionBody(body: Record<string, unknown>): Record<string, unknown> {
  if (isRecord(body.extraction)) {
    return body.extraction;
  }
  return body;
}

function toAcceptedIntakeResult(record: IntakeRecord): IntakeAcceptedResult {
  return {
    artifact_id: record.artifact_id,
    intake_state: "ingested",
    received_at: record.received_at,
    size_bytes: record.size_bytes,
    source_hash: record.source_hash,
    source_channel: record.source_channel,
    source_filename: record.source_filename,
    source_mime_type: record.source_mime_type,
    operator_or_service_identity: record.operator_or_service_identity,
    document_type_hint: record.document_type_hint ?? undefined,
    jurisdiction_context: record.jurisdiction_context ?? undefined,
    legal_basis: record.legal_basis ?? undefined,
    purpose_of_processing: record.purpose_of_processing ?? undefined,
    retention_profile: record.retention_profile ?? undefined,
    known_unknowns: parseKnownUnknowns(record.known_unknowns),
    storage: {
      r2_key: record.r2_key,
    },
  };
}

function parseKnownUnknowns(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

async function readJsonRecord(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const payload = await request.json();
    return isRecord(payload) ? payload : null;
  } catch {
    return null;
  }
}

async function readResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { text } : null;
}

function readSearchString(searchParams: URLSearchParams, ...keys: string[]): string {
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(body: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = body[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function readStringArray(body: Record<string, unknown>, ...keys: string[]): string[] | undefined {
  for (const key of keys) {
    const value = body[key];
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  }
  return undefined;
}

function readNumber(body: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const value = body[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return undefined;
}

function readNumberMap(body: Record<string, unknown>, ...keys: string[]): Record<string, number> | undefined {
  for (const key of keys) {
    const value = body[key];
    if (!isRecord(value)) {
      continue;
    }
    const entries = Object.entries(value).filter(([, raw]) => typeof raw === "number" && Number.isFinite(raw));
    return Object.fromEntries(entries) as Record<string, number>;
  }
  return undefined;
}

function asError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}
