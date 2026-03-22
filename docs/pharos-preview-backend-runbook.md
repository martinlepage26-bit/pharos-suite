# PHAROS Preview Backend Runbook

Last updated: 2026-03-22

This runbook documents the currently working interactive PHAROS preview path.

It is preview-only.

It does not change:

- `api.pharos-ai.ca`
- the live `govern-ai` Pages project
- frontend routes or branding

## Current preview architecture

- Frontend preview: `https://pharos-suite-review.pages.dev`
- Preview backend: `https://preview-api.pharos-ai.ca`
- Backend tunnel target: `http://127.0.0.1:9202`
- Local Mongo target: `127.0.0.1:27017`

Mechanism:

1. Cloudflare Pages serves the preview frontend at `pharos-suite-review.pages.dev`.
2. The preview frontend uses `REACT_APP_BACKEND_URL=https://preview-api.pharos-ai.ca`.
3. `preview-api.pharos-ai.ca` routes through a named Cloudflare Tunnel.
4. The tunnel forwards traffic to the local PHAROS backend on `127.0.0.1:9202`.
5. The local PHAROS backend uses local Mongo on `127.0.0.1:27017`.

## Required runtime pieces

- Local Mongo available on `127.0.0.1:27017`
- Local PHAROS backend running from `backend/server.py`
- Named Cloudflare Tunnel serving `preview-api.pharos-ai.ca`
- Backend `CORS_ORIGINS` including `https://pharos-suite-review.pages.dev`
- Pages preview project `pharos-suite-review` configured with:
  - `REACT_APP_BACKEND_URL`
  - `REACT_APP_PUBLIC_CONTACT_EMAIL`

## Repo-supported backend entrypoint

Run the PHAROS backend from:

```bash
cd /home/cerebrhoe/repos/pharos-suite/backend
/home/cerebrhoe/.local/bin/uvicorn server:app --host 127.0.0.1 --port 9202
```

For the current local preview runtime, the smallest restartable wrapper is:

```bash
/home/cerebrhoe/repos/pharos-suite/scripts/start_pharos_preview_backend.sh
```

This helper starts or reuses local Mongo on `127.0.0.1:27017`, starts or reuses the PHAROS backend on `127.0.0.1:9202`, verifies `/health` and `/api/health`, and only checks for a separate `cloudflared` process rather than embedding tunnel credentials.

Runtime configuration should supply at minimum:

- `MONGO_URL`
- `DB_NAME`
- `CORS_ORIGINS`

If `/admin` needs to work in preview, runtime configuration also needs:

- `ADMIN_PASSPHRASE`

## Required CORS shape

The PHAROS backend reads `CORS_ORIGINS` as a comma-separated list of full origins.

The preview origin must be included explicitly:

```txt
https://pharos-suite-review.pages.dev
```

Preview CORS is a runtime concern. Do not hardcode preview-only origins into public or production-only docs without making the environment boundary explicit.

## Startup order

1. Start local Mongo.
2. Start the PHAROS backend on `127.0.0.1:9202` with preview `CORS_ORIGINS`.
3. Verify local backend health:
   - `http://127.0.0.1:9202/health`
   - `http://127.0.0.1:9202/api/health`
   - `http://127.0.0.1:9202/api/`
4. Confirm the named Cloudflare Tunnel is up for `preview-api.pharos-ai.ca`.
5. Verify tunnel health:
   - `https://preview-api.pharos-ai.ca/health`
   - `https://preview-api.pharos-ai.ca/api/health`
   - `https://preview-api.pharos-ai.ca/api/`
6. Verify preview CORS with:
   - `OPTIONS /api/bookings`
   - `Origin: https://pharos-suite-review.pages.dev`
7. Only redeploy the Pages preview if `REACT_APP_BACKEND_URL` or `REACT_APP_PUBLIC_CONTACT_EMAIL` changed.

## Health checks

Local backend checks:

- `GET /health`
- `GET /api/health`
- `GET /api/`

Tunnel checks:

- `GET /health`
- `GET /api/health`
- `GET /api/`

Browser-level checks:

- `/contact`
- `/services/menu`
- `/portal/aurorai` redirect behavior

If the preview backend is healthy but browser requests still fail, re-check CORS before changing frontend code.

## Restart recovery after WSL restart

1. Confirm Mongo is back on `127.0.0.1:27017`.
2. Restart the PHAROS backend on `127.0.0.1:9202`.
3. Confirm local backend health.
4. Confirm the named Cloudflare Tunnel is connected and `preview-api.pharos-ai.ca` resolves.
5. Re-run the tunnel health checks.
6. Re-run the preview-origin CORS preflight against `OPTIONS /api/bookings`.
7. Test `/contact` and `/services/menu` from `https://pharos-suite-review.pages.dev`.

If the backend URL and contact-email values did not change, the preview frontend does not need a new deploy just because WSL restarted.

## Values that stay dashboard/runtime only

Do not commit these values to the repo unless they are intentionally being promoted out of preview-only scope:

- The exact `REACT_APP_PUBLIC_CONTACT_EMAIL` preview value
- The exact `MONGO_URL`
- `ADMIN_PASSPHRASE`
- `RESEND_API_KEY`
- `ADMIN_EMAILS`
- Cloudflare tunnel credentials
- Cloudflare account or tunnel IDs

The following value is safe to document because it is the current preview backend hostname rather than a secret:

- `REACT_APP_BACKEND_URL=https://preview-api.pharos-ai.ca`

## Boundary note

This runbook is for the preview-only backend path.

Production-facing PHAROS API planning remains in:

- `docs/public-backend-plan.md`
- `docs/pharos-api-dns-runbook.md`

Do not treat the preview backend host as a production API endpoint.
