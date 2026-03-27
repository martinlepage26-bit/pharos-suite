# CompassAI

Canonical CompassAI governance application repository.

## Current role

* Hosted-product backend lives in `backend/server.py` and remains the active runtime entrypoint.
* Governance-program expansion lives under `backend/routers/governance\_program.py`, with related migration docs in `docs/`.
* Frontend work is staged under `frontend/src/features/governanceProgram/`, but the repo does not currently include a runnable frontend package manifest.

## Operational notes

* `CHANGELOG.md` records the verified local backend target as `http://127.0.0.1:9205/api/`.
* `docs/backend-consolidation-plan.md` shows the backend is still in a mixed monolith-plus-router shape.
* `docs/governance-program-migration-guide.md` explicitly says to treat the backend as live and the frontend as incomplete.
* Some runtime or environment residue still uses legacy `pharos-suite` naming. Treat that as compatibility debt, not as a blind rename target.
* A bounded local `TestClient` harness confirmed `GET /api/` returns HTTP 200 when the backend is imported with placeholder Mongo env values and the in-scope `pharos-ai/pharos_integrations` package path is exposed.
* That makes the backend runtime real in the reviewed local scope, but with a local dependency-path caveat that should not be hidden in docs.

## Boundary notes

* CompassAI is the governance application within PHAROS, not the PHAROS public shell.
* Aurora is the intake workflow within CompassAI. The current compatibility service directory for that workflow remains `../aurorai/` in this pass.
* Current public presentation also exists inside the `pharos-ai` portal routes while standalone hosting remains undecided.
* Prefer the backend docs and live filesystem over `memory/PRD.md` when judging current frontend completeness.
