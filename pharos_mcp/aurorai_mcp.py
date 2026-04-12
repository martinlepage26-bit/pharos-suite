"""
aurorai_mcp.py — FastMCP 3.0 server for AurorAI

Exposes the AurorAI Intelligent Document Processing API as MCP tools so that
LLMs can:
  - Upload, list, and manage documents
  - Enqueue and monitor OCR / classification / extraction jobs
  - Retrieve AI-generated summaries, field extractions, and citation lists
  - Work the human-in-the-loop review queue
  - Hand processed documents off to CompassAI as evidence packages
  - Manage reading-list collections

Configuration (env vars):
  AURORAI_BASE_URL   — default http://127.0.0.1:9206
  AURORAI_TIMEOUT    — HTTP timeout in seconds, default 30
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

import httpx
from fastmcp import FastMCP, Context

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

BASE_URL = os.getenv("AURORAI_BASE_URL", "http://127.0.0.1:9206").rstrip("/")
TIMEOUT = float(os.getenv("AURORAI_TIMEOUT", "30"))

# ---------------------------------------------------------------------------
# Shared HTTP client (lifecycle-managed)
# ---------------------------------------------------------------------------

_http: httpx.AsyncClient | None = None


@asynccontextmanager
async def lifespan(server: FastMCP):
    global _http
    _http = httpx.AsyncClient(base_url=BASE_URL, timeout=TIMEOUT)
    try:
        yield
    finally:
        await _http.aclose()
        _http = None


def client() -> httpx.AsyncClient:
    assert _http is not None, "HTTP client not initialised — lifespan not started"
    return _http


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def _raise(r: httpx.Response) -> Any:
    """Raise a readable error or return parsed JSON body."""
    if r.is_error:
        raise ValueError(
            f"AurorAI {r.request.method} {r.request.url.path} → "
            f"HTTP {r.status_code}: {r.text[:400]}"
        )
    return r.json()


# ---------------------------------------------------------------------------
# Server
# ---------------------------------------------------------------------------

mcp = FastMCP(
    "AurorAI",
    instructions=(
        "Tools for the AurorAI Intelligent Document Processing module. "
        "Most tools require a Bearer `token` obtained via `aurorai_login`. "
        "Documents are processed through a pipeline: upload → OCR → classify "
        "→ extract → review → handoff to CompassAI."
    ),
    lifespan=lifespan,
)

# ── Authentication ──────────────────────────────────────────────────────────


@mcp.tool
async def aurorai_login(email: str, password: str) -> dict[str, Any]:
    """
    Authenticate with AurorAI and return a session token.

    Returns {"token": "...", "user": {...}}.
    Pass the token as `token` in all subsequent calls.
    """
    r = await client().post(
        "/session/login",
        json={"email": email, "password": password},
    )
    return _raise(r)


@mcp.tool
async def aurorai_me(token: str) -> dict[str, Any]:
    """Return the currently authenticated AurorAI user."""
    r = await client().get("/session/me", headers=auth_headers(token))
    return _raise(r)


# ── Discovery ───────────────────────────────────────────────────────────────


@mcp.tool
async def aurorai_health(token: str) -> dict[str, Any]:
    """Return the AurorAI API health/version info."""
    r = await client().get("/", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def aurorai_get_stats(token: str) -> dict[str, Any]:
    """
    Return processing statistics: document counts by category and pipeline status.
    """
    r = await client().get("/stats", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def aurorai_list_categories(token: str) -> list[str]:
    """List the document categories AurorAI recognises."""
    r = await client().get("/categories", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def aurorai_get_pipeline_description(token: str) -> dict[str, Any]:
    """Return a description of the IDP processing pipeline."""
    r = await client().get("/idp/pipeline", headers=auth_headers(token))
    return _raise(r)


# ── Documents ───────────────────────────────────────────────────────────────


@mcp.tool
async def aurorai_list_documents(
    token: str,
    category: str | None = None,
    status: str | None = None,
    limit: int = 50,
) -> list[dict[str, Any]]:
    """
    List documents with optional filters.

    category: e.g. 'Academic Papers', 'Invoices', 'Contracts', 'Reports'
    status:   e.g. 'pending', 'processing', 'complete', 'failed'
    limit:    max results, default 50
    """
    params: dict[str, Any] = {"limit": limit}
    if category:
        params["category"] = category
    if status:
        params["status"] = status
    r = await client().get("/documents", params=params, headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def aurorai_get_document(token: str, doc_id: str) -> dict[str, Any]:
    """
    Get full metadata and processing status for a document.

    Returns the document record including audit trail and all processing runs.
    """
    r = await client().get(f"/documents/{doc_id}", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def aurorai_upload_document(
    token: str,
    file_path: str,
    category: str | None = None,
    ctx: Context | None = None,
) -> dict[str, Any]:
    """
    Upload a document file to AurorAI.

    file_path: absolute path to the file on the local filesystem.
    category:  optional initial category hint.

    Returns the created Document record with its doc_id for further processing.
    """
    p = Path(file_path)
    if not p.exists():
        raise FileNotFoundError(f"File not found: {file_path}")
    if ctx:
        ctx.info(f"Uploading {p.name} ({p.stat().st_size} bytes)")

    with p.open("rb") as fh:
        files = {"file": (p.name, fh, "application/octet-stream")}
        data = {}
        if category:
            data["category"] = category
        r = await client().post(
            "/documents/upload",
            files=files,
            data=data,
            headers=auth_headers(token),
        )
    return _raise(r)


@mcp.tool
async def aurorai_update_document(
    token: str,
    doc_id: str,
    category: str | None = None,
    metadata: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Update document category or metadata fields."""
    payload: dict[str, Any] = {}
    if category is not None:
        payload["category"] = category
    if metadata is not None:
        payload["metadata"] = metadata
    r = await client().patch(
        f"/documents/{doc_id}",
        json=payload,
        headers=auth_headers(token),
    )
    return _raise(r)


@mcp.tool
async def aurorai_delete_document(token: str, doc_id: str) -> dict[str, Any]:
    """Permanently delete a document and all its processing jobs."""
    r = await client().delete(f"/documents/{doc_id}", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def aurorai_get_document_status(token: str, doc_id: str) -> dict[str, Any]:
    """
    Return detailed processing status for a document, including all job history.
    """
    r = await client().get(f"/status/{doc_id}", headers=auth_headers(token))
    return _raise(r)


# ── Processing pipeline ─────────────────────────────────────────────────────


@mcp.tool
async def aurorai_enqueue_processing(
    token: str,
    doc_id: str,
    job_type: str = "OCR",
    next_job_types: list[str] | None = None,
) -> dict[str, Any]:
    """
    Enqueue a processing job for a document.

    job_type: OCR | CLASSIFY | SUMMARY | EXTRACT | CITATIONS
    next_job_types: optional list of jobs to chain after this one completes,
                    e.g. ["CLASSIFY", "EXTRACT"]

    Returns a ProcessingJob record with a job_id. Poll with `aurorai_get_job`.
    """
    payload: dict[str, Any] = {"document_id": doc_id, "job_type": job_type}
    if next_job_types:
        payload["next_job_types"] = next_job_types
    r = await client().post("/process", json=payload, headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def aurorai_get_job(token: str, job_id: str) -> dict[str, Any]:
    """
    Get the status and output of a processing job.

    status will be one of: QUEUED, RUNNING, SUCCESS, FAILED.
    When SUCCESS, `output` contains the result (text, structured fields, etc.).
    """
    r = await client().get(f"/process/{job_id}", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def aurorai_reprocess_document(
    token: str,
    doc_id: str,
    job_type: str = "OCR",
) -> dict[str, Any]:
    """
    Reprocess a document from a given pipeline stage.

    Useful for correcting a failed run or forcing re-extraction after
    updating category or metadata.
    """
    r = await client().post(
        f"/reprocess/{doc_id}",
        json={"job_type": job_type},
        headers=auth_headers(token),
    )
    return _raise(r)


# ── AI analysis ─────────────────────────────────────────────────────────────


@mcp.tool
async def aurorai_categorize_document(
    token: str,
    doc_id: str,
) -> dict[str, Any]:
    """
    Request AI categorisation of a document.

    Returns a job_id. The completed job output will contain a category label
    and confidence scores. Poll with `aurorai_get_job`.
    """
    r = await client().post(
        f"/documents/{doc_id}/categorize",
        json={"document_id": doc_id},
        headers=auth_headers(token),
    )
    return _raise(r)


@mcp.tool
async def aurorai_bulk_categorize(
    token: str,
    doc_ids: list[str],
) -> dict[str, Any]:
    """Bulk-enqueue AI categorisation for multiple documents."""
    r = await client().post(
        "/documents/bulk-categorize",
        json={"document_ids": doc_ids},
        headers=auth_headers(token),
    )
    return _raise(r)


@mcp.tool
async def aurorai_summarize_document(
    token: str,
    doc_id: str,
    max_length: int | None = None,
) -> dict[str, Any]:
    """
    Request an AI-generated summary of a document.

    Returns a job_id. Poll with `aurorai_get_job` until SUCCESS,
    then read `output.summary`.
    """
    payload: dict[str, Any] = {"document_id": doc_id}
    if max_length is not None:
        payload["max_length"] = max_length
    r = await client().post(
        f"/documents/{doc_id}/summary",
        json=payload,
        headers=auth_headers(token),
    )
    return _raise(r)


@mcp.tool
async def aurorai_extract_document_fields(
    token: str,
    doc_id: str,
    fields: list[str] | None = None,
) -> dict[str, Any]:
    """
    Request structured field extraction from a document.

    fields: optional list of field names to target, e.g. ["date", "amount", "vendor"].
    Returns a job_id. Poll with `aurorai_get_job`; SUCCESS output contains
    a dict of extracted key-value pairs.
    """
    payload: dict[str, Any] = {"document_id": doc_id}
    if fields:
        payload["fields"] = fields
    r = await client().post(
        f"/documents/{doc_id}/extract",
        json=payload,
        headers=auth_headers(token),
    )
    return _raise(r)


@mcp.tool
async def aurorai_extract_citations(
    token: str,
    doc_id: str,
) -> dict[str, Any]:
    """
    Extract citations and references from a document.

    Useful for academic papers. Returns a job_id; completed output contains
    a structured list of citations.
    """
    r = await client().post(
        f"/documents/{doc_id}/citations",
        json={"document_id": doc_id},
        headers=auth_headers(token),
    )
    return _raise(r)


# ── Evidence & handoff ──────────────────────────────────────────────────────


@mcp.tool
async def aurorai_create_evidence_package(
    token: str,
    doc_id: str,
    notes: str | None = None,
) -> dict[str, Any]:
    """
    Generate a structured evidence package for a document.

    The package includes document metadata, extracted fields, and chain-of-custody
    information suitable for inclusion in a governance assessment.
    """
    payload: dict[str, Any] = {"document_id": doc_id}
    if notes:
        payload["notes"] = notes
    r = await client().post(
        f"/documents/{doc_id}/evidence-package",
        json=payload,
        headers=auth_headers(token),
    )
    return _raise(r)


@mcp.tool
async def aurorai_handoff_to_compassai(
    token: str,
    doc_id: str,
    assessment_id: str | None = None,
    usecase_id: str | None = None,
    notes: str | None = None,
) -> dict[str, Any]:
    """
    Hand off a processed document to CompassAI as evidence.

    Provide either assessment_id or usecase_id (or both) to target the handoff.
    Returns the handoff record with a confirmation ID.
    """
    payload: dict[str, Any] = {"document_id": doc_id}
    if assessment_id:
        payload["assessment_id"] = assessment_id
    if usecase_id:
        payload["usecase_id"] = usecase_id
    if notes:
        payload["notes"] = notes
    r = await client().post(
        f"/documents/{doc_id}/handoff-to-compassai",
        json=payload,
        headers=auth_headers(token),
    )
    return _raise(r)


# ── Human-in-the-loop review ────────────────────────────────────────────────


@mcp.tool
async def aurorai_get_review_queue(token: str) -> list[dict[str, Any]]:
    """
    Return documents awaiting human review.

    These are documents that the AI was uncertain about (low confidence scores)
    and need a reviewer to accept, reject, or flag them.
    """
    r = await client().get("/queue/review", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def aurorai_submit_review(
    token: str,
    doc_id: str,
    decision: str,
    comment: str | None = None,
    corrected_category: str | None = None,
) -> dict[str, Any]:
    """
    Submit a review decision for a document in the HITL queue.

    decision: 'approve' | 'reject' | 'flag'
    comment: optional reviewer note
    corrected_category: if the AI categorised incorrectly, provide the right one
    """
    payload: dict[str, Any] = {"decision": decision}
    if comment:
        payload["comment"] = comment
    if corrected_category:
        payload["corrected_category"] = corrected_category
    r = await client().post(
        f"/review/{doc_id}",
        json=payload,
        headers=auth_headers(token),
    )
    return _raise(r)


# ── Reading lists ───────────────────────────────────────────────────────────


@mcp.tool
async def aurorai_list_reading_lists(token: str) -> list[dict[str, Any]]:
    """List all reading-list collections for the current user."""
    r = await client().get("/reading-lists", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def aurorai_get_reading_list(
    token: str, list_id: str
) -> dict[str, Any]:
    """Get a reading list with all its documents."""
    r = await client().get(f"/reading-lists/{list_id}", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def aurorai_create_reading_list(
    token: str,
    name: str,
    description: str | None = None,
) -> dict[str, Any]:
    """Create a new reading list / document collection."""
    payload: dict[str, Any] = {"name": name}
    if description:
        payload["description"] = description
    r = await client().post(
        "/reading-lists", json=payload, headers=auth_headers(token)
    )
    return _raise(r)


@mcp.tool
async def aurorai_add_to_reading_list(
    token: str, list_id: str, doc_id: str
) -> dict[str, Any]:
    """Add a document to a reading list."""
    r = await client().post(
        f"/reading-lists/{list_id}/documents/{doc_id}",
        headers=auth_headers(token),
    )
    return _raise(r)


@mcp.tool
async def aurorai_remove_from_reading_list(
    token: str, list_id: str, doc_id: str
) -> dict[str, Any]:
    """Remove a document from a reading list."""
    r = await client().delete(
        f"/reading-lists/{list_id}/documents/{doc_id}",
        headers=auth_headers(token),
    )
    return _raise(r)


@mcp.tool
async def aurorai_delete_reading_list(
    token: str, list_id: str
) -> dict[str, Any]:
    """Delete a reading list (does not delete the documents)."""
    r = await client().delete(
        f"/reading-lists/{list_id}", headers=auth_headers(token)
    )
    return _raise(r)


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    mcp.run()
