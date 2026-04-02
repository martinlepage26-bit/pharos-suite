# Aurora

Compatibility directory name: `aurorai/`

Aurora intake workflow and document-processing service for CompassAI.

## Current role

- `server.py` is the active FastAPI + Mongo backend for the Aurora intake workflow and IDP pipeline.
- `memory/PRD.md` and `docs/infrafabric-alignment-v2.md` describe the intended Aurora execution model and current state tracking.
- `storage/` contains migration-planning helpers for later D1/R2 work.
- `src/` is the active JavaScript-side Worker/module surface for the bounded intake, extraction, evidence-package, lineage/status exposure, AurorA-side closure fetch-through, and CompassAI handoff contract, and is validated with Vitest.
- `frontend/` remains a standalone browser-surface scaffold only: config files exist, but no runnable app tree or standalone frontend manifest lives there.

## Operational notes

- `CHANGELOG.md` records the verified local API target as `http://127.0.0.1:9206/`.
- The backend defaults to handing evidence off to CompassAI through `COMPASSAI_BASE_URL`.
- AurorA now uses `COMPASSAI_CLOSURE_READ_TOKEN` for the bounded closure fetch-through path when CompassAI is configured to require it.
- The closure fetch-through path is pinned to the configured `COMPASSAI_BASE_URL`; it does not honor request-time base URL overrides.
- `wrangler.toml` exists as a bounded Worker deploy scaffold, but no verified production Aurora Worker deployment is claimed by that file alone.
- The Worker now exposes `GET /api/documents/{doc_id}/lineage`, `GET /api/documents/{doc_id}/status`, and `GET /api/documents/{doc_id}/closure` from normalized AurorA lineage records plus a bounded CompassAI fetch-through view.
- Those status routes are intentionally fail-closed: if linked lineage records are missing, the Worker exposes the narrower state instead of smoothing the artifact forward narratively.
- The closure route keeps AurorA and CompassAI in separate sections and degrades to `local_only`, `governance_unavailable`, or `governance_ambiguous` instead of inventing a single flattened cross-system state.
- A bounded local `TestClient` harness confirmed `GET /api/` and `GET /api/idp/pipeline` return HTTP 200 when the backend is imported with placeholder Mongo env values.
- Repo-root backend verification now runs with `pytest aurorai/tests` and covers upload, extraction, evidence-package generation, and CompassAI handoff wiring without a live external service.
- JavaScript-side contract verification runs with `npm test` under Node 22+ and covers intake, extraction, append-only lineage persistence, fail-closed status exposure, evidence-package emission, and CompassAI handoff route behavior.

## Boundary notes

- Aurora sits inside CompassAI within PHAROS, but this directory is not the PHAROS public shell.
- The current on-disk directory name remains `aurorai/` for compatibility in this pass.
- Public presentation currently exists through the PHAROS portal routes while standalone hosting remains undecided.
- Do not infer that repo renaming or domain cleanup is required just because the product brand is clear.
- The fetch-through closure view is a bounded read path over the current Worker contract. It does not claim live service auth, a full remote graph join, or hosted-backend replacement.
- The dedicated closure-read token is a narrow service-auth contract for this route only. It is not yet general Worker auth or RBAC.
