# PHAROS Suite Operations Runbook

This runbook covers the current local operating model for:

- `pharos-suite`
- `AurorAI`
- `CompassAI`

Current public/private split:

- Public frontend target: `https://pharos-ai.ca`
- Local frontend preview: `http://127.0.0.1:9201/`
- Local backends only: `pharos-suite`, `AurorAI`, `CompassAI`

## Post-Consolidation Changes

- Canonical repo root moved from `/home/cerebrhoe/repos/pharos-suite` to `/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite`
- `pharos_integrations/` now resolves as a bundled monorepo package under that consolidated root
- CompassAI no longer carries a standalone Worker/browser entrypoint; its live surfaces are the backend API and the PHAROS shell architecture-reference routes
- If you memorized the old repo path, update shell aliases, `PYTHONPATH` snippets, and ad hoc scripts before using this runbook

## Architecture decisions

- [ADR 001 — retire CompassAI standalone edge surface](./adr/001-compassai-edge-surface-retirement.md)

## 1. What runs where

| Service | Purpose | Local URL | Port |
|---|---|---|---:|
| Dashboard | local service dashboard | `http://127.0.0.1:9200/` | `9200` |
| pharos-suite frontend | public site UI | `http://127.0.0.1:9201/` | `9201` |
| pharos-suite backend | bookings, services, platform status | `http://127.0.0.1:9202/` | `9202` |
| CompassAI backend | governance engine | `http://127.0.0.1:9205/api/` | `9205` |
| AurorAI backend | evidence and document engine | `http://127.0.0.1:9206/api/` | `9206` |
| Local MongoDB | shared local database | `mongodb://127.0.0.1:27017` | `27017` |

## 2. Fastest way to operate everything

Open a Linux terminal in WSL and use these commands.

### Start the full stack

```bash
/home/cerebrhoe/repo-hosting/start-all.sh
```

### Check the full stack

```bash
/home/cerebrhoe/repo-hosting/status.sh
```

### Stop the full stack

```bash
/home/cerebrhoe/repo-hosting/stop-all.sh
```

### Rebuild the pharos-suite frontend for local preview

```bash
/home/cerebrhoe/repo-hosting/build-pharos-suite.sh
```

### Run the local CI gate

```bash
/home/cerebrhoe/repo-hosting/ci-check.sh
```

This runs the consolidated CompassAI + AurorAI backend pytest suites, the AurorAI Vitest suite, and the PHAROS shell smoke test as a single local go/no-go check.

### Pre-push hook

```bash
/home/cerebrhoe/repo-hosting/build-pharos-suite.sh
```

That build helper refreshes `.git/hooks/pre-push` from the tracked hook source at `/home/cerebrhoe/repo-hosting/pre-push.hook.sh`. Every push from the local `pharos-suite` repo then runs the same CI gate automatically before Git is allowed to continue.

## 3. Main folders

Linux paths:

- pharos-suite repo: `/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite`
- AurorAI repo: `/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/aurorai`
- CompassAI repo: `/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/compassai`
- hosting scripts: `/home/cerebrhoe/repo-hosting`
- logs: `/home/cerebrhoe/repo-hosting/logs`
- pid files: `/home/cerebrhoe/repo-hosting/pids`

Windows paths from WSL:

- `C:\Users\softinfo\Downloads` -> `/mnt/c/Users/softinfo/Downloads`
- `C:\Users\softinfo\Documents` -> `/mnt/c/Users/softinfo/Documents`

## 4. Current service connections

### pharos-suite

- Frontend is static and served from the built React app on `9201`
- Backend runs on `9202`
- The frontend build assumes backend access at `http://127.0.0.1:9202`

### AurorAI

- Runs on `9206`
- Uses Mongo database `aurorai`
- Sensitive routes require a bearer token
- On the managed local stack, the token is already injected for server startup

### CompassAI

- Runs on `9205`
- Uses Mongo database `compassai`
- Most routes require JWT auth
- The evidence ingest route can also accept the internal service token used by AurorAI handoff

### AurorAI -> CompassAI handoff

Local stack wiring already sets:

- `COMPASSAI_BASE_URL=http://127.0.0.1:9205`
- `COMPASSAI_INGEST_TOKEN=compassai-local-ingest-token`
- `COMPASSAI_CLOSURE_READ_TOKEN=compassai-local-closure-read-token`

That means:

1. AurorAI generates an evidence package
2. AurorAI posts it to `CompassAI /api/v1/evidence`
3. CompassAI stores it against a use case
4. CompassAI can then assess that use case

For the bounded closure fetch-through path:

1. AurorAI resolves the linked `use_case_id` from its local evidence packages
2. AurorAI calls `GET /api/v1/use-cases/{usecase_id}/closure`
3. When `COMPASSAI_CLOSURE_READ_TOKEN` is set, AurorAI must send it as a bearer token
4. CompassAI rejects missing or invalid closure-read tokens with `401` / `403`

AurorAI keeps that closure read pinned to its configured `COMPASSAI_BASE_URL`; request-time base URL overrides are not part of the closure-read contract.

## 5. Health and smoke-check URLs

### pharos-suite

```bash
curl http://127.0.0.1:9202/health
curl http://127.0.0.1:9202/api/admin/platform-status
curl http://127.0.0.1:9202/api/services/active
```

### AurorAI

```bash
curl http://127.0.0.1:9206/api/
curl http://127.0.0.1:9206/api/idp/pipeline
curl http://127.0.0.1:9206/api/categories
```

### CompassAI

```bash
curl http://127.0.0.1:9205/api/
```

## 6. Logs

Tail logs with:

```bash
tail -f /home/cerebrhoe/repo-hosting/logs/pharos-suite-backend.log
tail -f /home/cerebrhoe/repo-hosting/logs/pharos-suite-frontend.log
tail -f /home/cerebrhoe/repo-hosting/logs/aurorai.log
tail -f /home/cerebrhoe/repo-hosting/logs/compassai.log
```

## 7. pharos-suite day-to-day commands

### Open the repo

```bash
cd /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite
```

### Frontend dev mode

```bash
cd /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/frontend
npm install
npm start
```

This runs:

- Tailwind watch
- React dev server

### Frontend production build

```bash
cd /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/frontend
npm run build
```

### CI gate before deploy or handoff

```bash
/home/cerebrhoe/repo-hosting/ci-check.sh
```

### Cloudflare Pages deploy

```bash
cd /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/frontend
npm run cf:deploy
```

Canonical production target is the `pharos-suite` Pages project serving `pharos-ai.ca`.

### Backend manual run

```bash
cd /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/backend
env MONGO_URL=mongodb://127.0.0.1:27017 DB_NAME=pharos_suite /home/cerebrhoe/.local/bin/uvicorn server:app --host 127.0.0.1 --port 9202
```

## 8. AurorAI day-to-day commands

### Open the repo

```bash
cd /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/aurorai
```

### Important local prerequisite

Make sure the local uploads directory exists:

```bash
mkdir -p /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/aurorai/uploads
```

### Manual run

```bash
cd /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/aurorai
env \
  MONGO_URL=mongodb://127.0.0.1:27017 \
  DB_NAME=aurorai \
  AURORAI_API_TOKEN=aurorai-local-dev-token \
  COMPASSAI_BASE_URL=http://127.0.0.1:9205 \
  COMPASSAI_INGEST_TOKEN=compassai-local-ingest-token \
  PYTHONPATH="/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite${PYTHONPATH:+:$PYTHONPATH}" \
  /home/cerebrhoe/.local/bin/uvicorn server:app --host 127.0.0.1 --port 9206
```

### Auth header for local API calls

```bash
export AURORAI_TOKEN='aurorai-local-dev-token'
```

### Upload a TXT file

```bash
curl -X POST http://127.0.0.1:9206/api/documents/upload \
  -H "Authorization: Bearer $AURORAI_TOKEN" \
  -F "file=@/path/to/document.txt"
```

### Extract fields from a document

```bash
curl -X POST http://127.0.0.1:9206/api/documents/<DOC_ID>/extract \
  -H "Authorization: Bearer $AURORAI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"document_id":"<DOC_ID>"}'
```

### Generate an evidence package

```bash
curl -X POST http://127.0.0.1:9206/api/documents/<DOC_ID>/evidence-package \
  -H "Authorization: Bearer $AURORAI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"usecase_id":"<USE_CASE_ID>","producer":"aurorai","artifact_type":"evidence_package"}'
```

### Handoff to CompassAI

```bash
curl -X POST http://127.0.0.1:9206/api/documents/<DOC_ID>/handoff-to-compassai \
  -H "Authorization: Bearer $AURORAI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"usecase_id":"<USE_CASE_ID>","producer":"aurorai","artifact_type":"evidence_package"}'
```

## 9. CompassAI day-to-day commands

### Open the repo

```bash
cd /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/compassai/backend
```

### Manual run

```bash
cd /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/compassai/backend
env \
  MONGO_URL=mongodb://127.0.0.1:27017 \
  DB_NAME=compassai \
  COMPASSAI_INGEST_TOKEN=compassai-local-ingest-token \
  PYTHONPATH="/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite${PYTHONPATH:+:$PYTHONPATH}" \
  /home/cerebrhoe/.local/bin/uvicorn server:app --host 127.0.0.1 --port 9205
```

### Register a local user

```bash
curl -X POST http://127.0.0.1:9205/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"you@example.com",
    "password":"TestPass123!",
    "name":"Your Name",
    "role":"admin"
  }'
```

### Log in

```bash
curl -X POST http://127.0.0.1:9205/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"you@example.com",
    "password":"TestPass123!"
  }'
```

Take the returned `access_token` and set:

```bash
export COMPASS_TOKEN='<JWT_FROM_LOGIN_OR_REGISTER>'
```

### Create a use case

Important: `business_owner_confirmed` must be `true`.

```bash
curl -X POST http://127.0.0.1:9205/api/v1/use-cases \
  -H "Authorization: Bearer $COMPASS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Invoice review automation",
    "purpose":"Validate invoice extraction and governance handoff",
    "business_owner":"Finance Ops",
    "business_owner_confirmed":true,
    "systems_involved":["AurorAI","CompassAI"],
    "data_categories":["financial","contact"],
    "automation_level":"assistive",
    "decision_impact":"advisory",
    "regulated_domain":false,
    "scale":"team",
    "known_unknowns":["Threshold calibration pending"]
  }'
```

### List use cases

```bash
curl -H "Authorization: Bearer $COMPASS_TOKEN" \
  http://127.0.0.1:9205/api/v1/use-cases
```

### List evidence for a use case

```bash
curl -H "Authorization: Bearer $COMPASS_TOKEN" \
  http://127.0.0.1:9205/api/v1/evidence/use-case/<USE_CASE_ID>
```

### Assess a use case

```bash
curl -X POST http://127.0.0.1:9205/api/v1/use-cases/<USE_CASE_ID>/assess \
  -H "Authorization: Bearer $COMPASS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Read the audit trail

```bash
curl -H "Authorization: Bearer $COMPASS_TOKEN" \
  http://127.0.0.1:9205/api/v1/use-cases/<USE_CASE_ID>/audit-trail
```

## 10. Verified local end-to-end flow

This sequence was verified locally today:

1. register in `CompassAI`
2. create a use case in `CompassAI`
3. upload a TXT invoice into `AurorAI`
4. extract fields in `AurorAI`
5. hand off the evidence package to `CompassAI`
6. assess the use case in `CompassAI`

Observed result:

- evidence landed successfully in `CompassAI`
- assessment returned `risk_tier = T2`
- local handoff path is working

## 11. Known local caveats

- `pharos-suite` frontend is public on Cloudflare Pages, but the backends are still local-only
- `AurorAI` currently accepts `PDF`, `TXT`, and `DOCX`; legacy `DOC` stays unsupported
- image-only PDFs attempt OCR first through the guarded local OCR path; if the runtime is unavailable, the document is kept with an explicit `OCR required/unavailable` state instead of pretending extraction succeeded
- `AurorAI` falls back to heuristic extraction if the LLM path is not fully configured
- `CompassAI` requires JWT auth for most routes
- if a local upload path disappears, recreate it with:

```bash
mkdir -p /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/aurorai/uploads
```

## 12. Daily operator checklist

### Morning start

```bash
/home/cerebrhoe/repo-hosting/start-all.sh
/home/cerebrhoe/repo-hosting/status.sh
```

### Before editing frontend

```bash
cd /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/frontend
npm run build
```

### Before backend testing

```bash
curl http://127.0.0.1:9202/health
curl http://127.0.0.1:9206/api/categories
curl http://127.0.0.1:9205/api/
```

### End of day

```bash
/home/cerebrhoe/repo-hosting/stop-all.sh
```
