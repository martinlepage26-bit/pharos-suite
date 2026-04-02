# CompassAI

Canonical CompassAI governance application repository.

## Current role

* Hosted-product backend lives in `backend/server.py` and remains the active runtime entrypoint.
* Governance-program expansion lives under `backend/routers/governance\_program.py`, with related migration docs in `docs/`.
* Frontend work is staged under `frontend/src/features/governanceProgram/`, but the repo does not currently include a runnable frontend package manifest.
* `src/` now contains a bounded internal Worker migration slice for the AurorA → COMPASSai evidence contract, use-case registry, risk assessment, deliverable generation, approval workflow, audit trail, and cross-system closure exposure. It is still a migration scaffold, not proof of a standalone public CompassAI edge app.
* CompassAI still runs operationally through the PHAROS shell plus the backend API; the Worker slice does not replace `backend/server.py`.

## Operational notes

* `CHANGELOG.md` records the verified local backend target as `http://127.0.0.1:9205/api/`.
* `docs/backend-consolidation-plan.md` shows the backend is still in a mixed monolith-plus-router shape.
* `docs/governance-program-migration-guide.md` explicitly says to treat the backend as live and the frontend as incomplete.
* Some runtime or environment residue still uses legacy `pharos-suite` naming. Treat that as compatibility debt, not as a blind rename target.
* Repo-root backend validation now runs in-process with no external service dependency: `pytest compassai/backend/tests`
* Bounded Worker governance validation currently runs through the AurorA-side Vitest harness under `aurorai/npm test`.
* The bundled `pharos_integrations/` package now resolves from the consolidated repo root, so backend imports no longer depend on ad hoc path exposure.
* `COMPASSAI_CLOSURE_READ_TOKEN`, when set, requires a matching bearer token on `GET /api/v1/use-cases/{usecase_id}/closure`.

## Bounded Worker routes

* `POST /api/v1/use-cases`
* `GET /api/v1/use-cases`
* `GET /api/v1/use-cases/{usecase_id}`
* `POST /api/v1/evidence`
* `GET /api/v1/evidence/use-case/{usecase_id}`
* `POST /api/v1/use-cases/{usecase_id}/assess`
* `POST /api/v1/use-cases/{usecase_id}/deliverables/generate`
* `GET /api/v1/use-cases/{usecase_id}/deliverables`
* `POST /api/v1/deliverables/{deliverable_id}/notes`
* `POST /api/v1/use-cases/{usecase_id}/approval-requests`
* `GET /api/v1/use-cases/{usecase_id}/approval-requests`
* `POST /api/v1/approval-requests/{request_id}/decisions`
* `GET /api/v1/use-cases/{usecase_id}/audit-trail`
* `GET /api/v1/use-cases/{usecase_id}/closure`

## Boundary notes

* CompassAI is the governance application within PHAROS, not the PHAROS public shell.
* Aurora is the intake workflow within CompassAI. The current compatibility service directory for that workflow remains `../aurorai/` in this pass.
* Current public presentation exists only through the `pharos-ai` portal routes and the PHAROS shell architecture-reference pages.
* Prefer the backend docs and live filesystem over `memory/PRD.md` when judging current frontend completeness.
* Worker approval remains bounded and body-declared for now; it is not yet a live auth/RBAC substitute for the hosted backend.
* Deliverables that declare `operatorInputRequired` now need a timestamped completion marker note before the Worker will treat `controls_satisfied` as complete.
* The closure route keeps AurorA evidence lineage and COMPASSai governance lineage in separate sections and fails closed when the supporting cycle or assessment records are missing.
* The closure-read token is a narrow service-auth contract for this one route. It does not promote the Worker slice to full auth/RBAC coverage.
