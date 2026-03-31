# PHAROS Surface Migration Audit

Date: 2026-03-13

Scope: `/home/cerebrhoe/repos/pharos-ai`

This is a boundary-enforcement audit for the GovernAI -> PHAROS migration. It does not treat every legacy string as a blind rename target. Some references are current PHAROS naming work, some are historical lineage, some should move out of the PHAROS public surface, and some are tied to external infrastructure that should only be changed in a coordinated follow-up.

## Current structure discovered

- `frontend/`: React + CRACO public site, Cloudflare Pages-targeted, client-side routing
- `backend/`: FastAPI service for bookings, services, admin, platform status, legacy Lotus, and legacy publication APIs
- `pharos_governance_suite/`: desktop-side assets; `CompassAI` remains PHAROS-aligned, `lotus_dr_sort` is migration residue
- `infra/cloudflare-live-proxy/`: Worker proxy to the legacy Pages hostname
- `docs/`: DNS, deployment, architecture, and historical lineage notes

## Target structure proposed

- `pharos-ai.ca`: PHAROS public surface only
- `govern-ai.ca`: legacy product hostname redirected into PHAROS
- `governai.ca`: Martin Lepage personal/professional and non-PHAROS surface
- `AurorA` and `CompassAI`: kept under PHAROS
- `LOTUS`, resume/profile/portfolio/publication surfaces: kept out of PHAROS

## Reference classification

### Rename to PHAROS

- `/home/cerebrhoe/repos/pharos-ai/README.md`
- `/home/cerebrhoe/repos/pharos-ai/docs/cloudflare-pages.md`
- `/home/cerebrhoe/repos/pharos-ai/docs/free-first-architecture.md`
- `/home/cerebrhoe/repos/pharos-ai/docs/pharos-api-dns-runbook.md`
- `/home/cerebrhoe/repos/pharos-ai/docs/public-backend-plan.md`
- `/home/cerebrhoe/repos/pharos-ai/frontend/README.md`
- `/home/cerebrhoe/repos/pharos-ai/frontend/functions/_middleware.js`
- `/home/cerebrhoe/repos/pharos-ai/frontend/package.json`
- `/home/cerebrhoe/repos/pharos-ai/frontend/src/lib/modulePortalApi.js`
- `/home/cerebrhoe/repos/pharos-ai/frontend/src/pages/Admin.js`
- `/home/cerebrhoe/repos/pharos-ai/frontend/src/pages/Game.js`
- `/home/cerebrhoe/repos/pharos-ai/pharos_governance_suite/README.md`
- `/home/cerebrhoe/repos/pharos-ai/backend/server.py`

Reason:
- These files define the live PHAROS shell, browser storage keys, route language, operator-facing labels, or current deployment/domain guidance.

### Keep in repo, but strip PHAROS-external behavior

- `/home/cerebrhoe/repos/pharos-ai/frontend/src/App.js`
- `/home/cerebrhoe/repos/pharos-ai/frontend/public/_redirects`
- `/home/cerebrhoe/repos/pharos-ai/backend/server.py`

Reason:
- These files are still part of the live PHAROS delivery surface and should remain in this repo.
- `frontend/src/App.js` should keep boundary routes that explicitly block `/portfolio` and legacy publication paths on `pharos-ai.ca`.
- `frontend/public/_redirects` should keep redirect compatibility behavior for the bounded PHAROS surface.
- `backend/server.py` should keep PHAROS runtime operations such as bookings, admin, FAQ, services, and platform status while fail-closing Lotus and publication endpoints.
- Editorial/publication behavior should be re-homed to the Martin-side `governai.ca` stack before being re-enabled anywhere.

### Leave unchanged

- `/home/cerebrhoe/repos/pharos-ai/docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md`
- `/home/cerebrhoe/repos/pharos-ai/docs/d1-r2-endpoint-mapping.md`
- `/home/cerebrhoe/repos/pharos-ai/docs/infrafabric-d1-r2-recursive-schema.md`
- `/home/cerebrhoe/repos/pharos-ai/docs/principles-alignment-2026-03-06.md`
- `/home/cerebrhoe/repos/pharos-ai/infra/d1/README.md`
- `/home/cerebrhoe/repos/pharos-ai/test_result.md`

Reason:
- These are historical lineage, architecture, or test-record documents where legacy GovernAI naming is evidence, not a current public brand claim.

### Ambiguous, needs human or infra follow-up

- `/home/cerebrhoe/repos/pharos-ai/docs/govern-suite-operations-runbook.md`
- `/home/cerebrhoe/repos/pharos-ai/frontend/wrangler.jsonc`
- `/home/cerebrhoe/repos/pharos-ai/infra/cloudflare-live-proxy/src/index.js`
- `/home/cerebrhoe/repos/pharos-ai/infra/cloudflare-live-proxy/wrangler.jsonc`

Reason:
- These files still reflect live external resource names, local filesystem paths, or currently active Cloudflare project and worker identities.
- Repo-only renaming could break deploys or operator scripts until the external resources are renamed in lockstep.

## Pharaohs sweep

- No `pharaohs` or `pharaohs-ai` references were found in the repository during this audit.
