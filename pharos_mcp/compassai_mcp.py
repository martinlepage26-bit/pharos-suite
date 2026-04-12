"""
compassai_mcp.py — FastMCP 3.0 server for CompassAI

Exposes the CompassAI governance assessment API as MCP tools so that LLMs can:
  - Manage clients and AI systems
  - Create and query assessments and use-cases
  - Retrieve deliverables, governance artefacts, and dashboard data
  - Inspect audit logs and benchmarks

Configuration (env vars):
  COMPASSAI_BASE_URL  — default http://127.0.0.1:9205
  COMPASSAI_TIMEOUT   — HTTP timeout in seconds, default 30
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager
from typing import Any

import httpx
from fastmcp import FastMCP, Context

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

BASE_URL = os.getenv("COMPASSAI_BASE_URL", "http://127.0.0.1:9205").rstrip("/")
TIMEOUT = float(os.getenv("COMPASSAI_TIMEOUT", "30"))

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


def _raise(r: httpx.Response) -> dict[str, Any]:
    """Raise a readable error or return JSON body."""
    if r.is_error:
        raise ValueError(
            f"CompassAI {r.request.method} {r.request.url.path} → "
            f"HTTP {r.status_code}: {r.text[:400]}"
        )
    return r.json()


# ---------------------------------------------------------------------------
# Server
# ---------------------------------------------------------------------------

mcp = FastMCP(
    "CompassAI",
    instructions=(
        "Tools for the CompassAI AI-governance assessment platform. "
        "Most tools require a JWT `token` obtained via `compassai_login`. "
        "Provide the token you received from login to every subsequent call."
    ),
    lifespan=lifespan,
)

# ── Authentication ──────────────────────────────────────────────────────────


@mcp.tool
async def compassai_login(email: str, password: str) -> dict[str, Any]:
    """
    Authenticate with CompassAI and return a JWT access token.

    Returns {"access_token": "...", "token_type": "bearer", "user": {...}}.
    Pass the access_token as `token` in all subsequent tool calls.
    """
    r = await client().post(
        "/auth/login",
        json={"email": email, "password": password},
    )
    return _raise(r)


@mcp.tool
async def compassai_me(token: str) -> dict[str, Any]:
    """Return the profile of the currently authenticated user."""
    r = await client().get("/auth/me", headers=auth_headers(token))
    return _raise(r)


# ── Clients ─────────────────────────────────────────────────────────────────


@mcp.tool
async def compassai_list_clients(token: str) -> list[dict[str, Any]]:
    """List all clients visible to the authenticated user."""
    r = await client().get("/clients", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_get_client(token: str, client_id: str) -> dict[str, Any]:
    """Get a single client record by ID."""
    r = await client().get(f"/clients/{client_id}", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_create_client(
    token: str,
    name: str,
    sector: str,
    contact_name: str | None = None,
    contact_email: str | None = None,
    contact_phone: str | None = None,
) -> dict[str, Any]:
    """
    Create a new client.

    sector must be one of: SaaS, Healthcare, Education, Public, Finance,
    Construction, Other.
    """
    payload: dict[str, Any] = {"name": name, "sector": sector}
    if contact_name or contact_email or contact_phone:
        payload["contact"] = {
            k: v
            for k, v in {
                "name": contact_name,
                "email": contact_email,
                "phone": contact_phone,
            }.items()
            if v is not None
        }
    r = await client().post("/clients", json=payload, headers=auth_headers(token))
    return _raise(r)


# ── AI Systems ──────────────────────────────────────────────────────────────


@mcp.tool
async def compassai_list_ai_systems(
    token: str,
    client_id: str | None = None,
) -> list[dict[str, Any]]:
    """
    List AI systems, optionally filtered to a specific client.

    Provide client_id to scope results to one organisation.
    """
    params = {}
    if client_id:
        params["client_id"] = client_id
    r = await client().get("/ai-systems", params=params, headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_get_ai_system(token: str, system_id: str) -> dict[str, Any]:
    """Get full details for a single AI system."""
    r = await client().get(f"/ai-systems/{system_id}", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_create_ai_system(
    token: str,
    client_id: str,
    name: str,
    description: str,
    use_case: str | None = None,
    deployment_environment: str | None = None,
) -> dict[str, Any]:
    """Register a new AI system under a client."""
    payload: dict[str, Any] = {
        "client_id": client_id,
        "name": name,
        "description": description,
    }
    if use_case:
        payload["use_case"] = use_case
    if deployment_environment:
        payload["deployment_environment"] = deployment_environment
    r = await client().post("/ai-systems", json=payload, headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_get_assessment_history(
    token: str, system_id: str
) -> list[dict[str, Any]]:
    """Return all past assessments for a given AI system."""
    r = await client().get(
        f"/ai-systems/{system_id}/assessment-history", headers=auth_headers(token)
    )
    return _raise(r)


# ── Assessments ─────────────────────────────────────────────────────────────


@mcp.tool
async def compassai_list_assessments(
    token: str,
    client_id: str | None = None,
    system_id: str | None = None,
) -> list[dict[str, Any]]:
    """List assessments, optionally filtered by client or system."""
    params: dict[str, str] = {}
    if client_id:
        params["client_id"] = client_id
    if system_id:
        params["system_id"] = system_id
    r = await client().get("/assessments", params=params, headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_get_assessment(
    token: str, assessment_id: str
) -> dict[str, Any]:
    """Get a full assessment record including all control results."""
    r = await client().get(
        f"/assessments/{assessment_id}", headers=auth_headers(token)
    )
    return _raise(r)


@mcp.tool
async def compassai_create_assessment(
    token: str,
    client_id: str,
    system_id: str,
    assessment_type: str = "standard",
    notes: str | None = None,
) -> dict[str, Any]:
    """
    Create a new assessment for an AI system.

    assessment_type is typically 'standard' or 'expedited'.
    """
    payload: dict[str, Any] = {
        "client_id": client_id,
        "system_id": system_id,
        "assessment_type": assessment_type,
    }
    if notes:
        payload["notes"] = notes
    r = await client().post("/assessments", json=payload, headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_get_deliverables(
    token: str, assessment_id: str
) -> dict[str, Any]:
    """
    Return the deliverables package for an assessment.

    Includes: remediation roadmap, evidence requests, compliance checklist,
    normative alignment summary.
    """
    r = await client().get(
        f"/assessments/{assessment_id}/deliverables", headers=auth_headers(token)
    )
    return _raise(r)


@mcp.tool
async def compassai_get_remediation_roadmap(
    token: str, assessment_id: str
) -> dict[str, Any]:
    """Return the prioritised remediation roadmap for an assessment."""
    r = await client().get(
        f"/assessments/{assessment_id}/deliverables/roadmap",
        headers=auth_headers(token),
    )
    return _raise(r)


@mcp.tool
async def compassai_export_assessment_markdown(
    token: str, assessment_id: str
) -> str:
    """Export a full assessment report as a Markdown string."""
    r = await client().get(
        f"/assessments/{assessment_id}/export/markdown",
        headers=auth_headers(token),
    )
    if r.is_error:
        raise ValueError(f"Export failed HTTP {r.status_code}: {r.text[:400]}")
    return r.text


@mcp.tool
async def compassai_get_governance_context(
    token: str, assessment_id: str
) -> dict[str, Any]:
    """Return governance artefacts and policies attached to an assessment."""
    r = await client().get(
        f"/assessments/{assessment_id}/governance-context",
        headers=auth_headers(token),
    )
    return _raise(r)


# ── Use Cases ───────────────────────────────────────────────────────────────


@mcp.tool
async def compassai_list_use_cases(token: str) -> list[dict[str, Any]]:
    """List all governance use-case records."""
    r = await client().get("/v1/use-cases", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_get_use_case(token: str, usecase_id: str) -> dict[str, Any]:
    """Get a single use-case record."""
    r = await client().get(f"/v1/use-cases/{usecase_id}", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_create_use_case(
    token: str,
    title: str,
    description: str,
    sector: str,
    system_id: str | None = None,
    client_id: str | None = None,
) -> dict[str, Any]:
    """
    Register a new governance use-case.

    sector: SaaS | Healthcare | Education | Public | Finance | Construction | Other
    """
    payload: dict[str, Any] = {
        "title": title,
        "description": description,
        "sector": sector,
    }
    if system_id:
        payload["system_id"] = system_id
    if client_id:
        payload["client_id"] = client_id
    r = await client().post("/v1/use-cases", json=payload, headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_assess_use_case(
    token: str, usecase_id: str
) -> dict[str, Any]:
    """
    Run risk tiering and control derivation for a use-case.

    Returns the derived risk tier, recommended controls, and rationale.
    """
    r = await client().post(
        f"/v1/use-cases/{usecase_id}/assess", headers=auth_headers(token)
    )
    return _raise(r)


@mcp.tool
async def compassai_get_use_case_audit_trail(
    token: str, usecase_id: str
) -> list[dict[str, Any]]:
    """Return the append-only audit trail for a use-case."""
    r = await client().get(
        f"/v1/use-cases/{usecase_id}/audit-trail", headers=auth_headers(token)
    )
    return _raise(r)


# ── Governance ──────────────────────────────────────────────────────────────


@mcp.tool
async def compassai_list_governance_artifacts(
    token: str,
) -> list[dict[str, Any]]:
    """List all governance artefacts (policies, procedures, templates, etc.)."""
    r = await client().get("/governance/artifacts", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_get_governance_artifact(
    token: str, artifact_id: str
) -> dict[str, Any]:
    """Get a single governance artefact by ID."""
    r = await client().get(
        f"/governance/artifacts/{artifact_id}", headers=auth_headers(token)
    )
    return _raise(r)


@mcp.tool
async def compassai_list_policies(token: str) -> list[dict[str, Any]]:
    """List all governance policies."""
    r = await client().get("/governance/policies", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_list_committees(token: str) -> list[dict[str, Any]]:
    """List governance committees."""
    r = await client().get("/governance/committees", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_get_committee_report(
    token: str, committee_id: str
) -> dict[str, Any]:
    """Get a governance committee status report including recent decisions."""
    r = await client().get(
        f"/governance/committees/{committee_id}/report", headers=auth_headers(token)
    )
    return _raise(r)


@mcp.tool
async def compassai_executive_dashboard(token: str) -> dict[str, Any]:
    """Return the executive governance dashboard (program health, risk summary)."""
    r = await client().get(
        "/governance/executive-dashboard", headers=auth_headers(token)
    )
    return _raise(r)


@mcp.tool
async def compassai_get_pharos_control_register(token: str) -> dict[str, Any]:
    """Return the PHAROS method control register."""
    r = await client().get(
        "/governance/method/control-register", headers=auth_headers(token)
    )
    return _raise(r)


# ── Admin / Stats ───────────────────────────────────────────────────────────


@mcp.tool
async def compassai_dashboard_stats(token: str) -> dict[str, Any]:
    """Return aggregate dashboard statistics (counts by status, sector, etc.)."""
    r = await client().get("/stats/dashboard", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_list_audit_logs(
    token: str,
    limit: int = 50,
    action: str | None = None,
    resource_type: str | None = None,
) -> list[dict[str, Any]]:
    """
    List audit log entries.

    action: optional filter, e.g. 'create', 'update', 'delete'
    resource_type: optional filter, e.g. 'assessment', 'client'
    limit: max results, default 50
    """
    params: dict[str, Any] = {"limit": limit}
    if action:
        params["action"] = action
    if resource_type:
        params["resource_type"] = resource_type
    r = await client().get("/audit-logs", params=params, headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_list_benchmarks(token: str, sector: str) -> dict[str, Any]:
    """
    Return benchmark data for a sector.

    sector: SaaS | Healthcare | Education | Public | Finance | Construction | Other
    """
    r = await client().get(f"/benchmarks/{sector}", headers=auth_headers(token))
    return _raise(r)


@mcp.tool
async def compassai_compare_to_benchmark(
    token: str, sector: str, assessment_id: str
) -> dict[str, Any]:
    """Compare an assessment result against the sector benchmark."""
    r = await client().get(
        f"/benchmarks/{sector}/compare/{assessment_id}", headers=auth_headers(token)
    )
    return _raise(r)


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    mcp.run()
