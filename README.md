# pharos-ai

PHAROS public-surface repo for `pharos-ai.ca`.

## Canonical boundary

- PHAROS public domain: `pharos-ai.ca`
- Legacy PHAROS/GovernAI product domain: `govern-ai.ca`
- Martin Lepage personal/professional surface: `governai.ca`
- AurorA and CompassAI belong under the PHAROS surface
- Lotus does not belong on the PHAROS surface

## Repo structure

- `frontend/` - public PHAROS React surface and Cloudflare Pages assets
- `backend/` - FastAPI API for bookings, admin, FAQ, services, and PHAROS operations
- `docs/` - deployment, DNS, and operating notes
- `infra/` - Cloudflare worker and infra support files
- `pharos_governance_suite/` - remaining CompassAI desktop snapshot still parked outside the PHAROS public surface
- `tests/` and `backend/tests/` - validation coverage

## Migration stance

This repo is the PHAROS surface only. Martin Lepage profile/resume/publication material and Lotus belong off this surface during the migration.

Lotus app files now belong under `/home/cerebrhoe/repos/Agency/lotus`, and Dr. Sort belongs under `/home/cerebrhoe/repos/Agency/scripto`.

Current residual exception to keep visible:

- the legacy `/publications/trust-advantage-analysis` path still exists only as boundary and redirect compatibility
- it stays outside the PHAROS public boundary and should resolve users toward `/observatory`, not to a publication page

Repo-side changes can enforce routes, metadata, and public-shell boundaries, but some legacy names still remain outside the repo boundary:

- local filesystem paths under `/home/cerebrhoe/repos/govern-ai`
- Cloudflare Pages project host `govern-ai.pages.dev`
- deploy scripts or external infra objects that still use `govern-ai`

Those require coordinated follow-up rather than blind in-repo renaming.

## Local rename note

The canonical working tree now lives at `/home/cerebrhoe/repos/pharos-ai`.
A compatibility symlink remains at `/home/cerebrhoe/repos/govern-ai` so older local scripts can keep working until they are updated.
