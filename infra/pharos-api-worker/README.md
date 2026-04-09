# PHAROS API Worker Foundation

This Worker is the migration foundation for `api.pharos-ai.ca`.

It is not the live production API surface yet.

Its job is to give PHAROS a clean path from:

- Pages frontend + Tunnel-backed FastAPI bridge

to:

- Pages frontend + Worker API edge
- then Worker API edge + D1/R2-backed PHAROS runtime

## Current intent

Use this Worker in two stages:

1. Start as a bounded proxy in front of the existing backend.
2. Replace individual proxied routes with native Worker handlers once `D1`, `R2`, and edge-owned controls are ready.

This avoids a second hostname cutover later.

## What it does now

- exposes `/health` and `/api/health`
- adds explicit security headers and request IDs
- enforces explicit CORS for the PHAROS public origins
- proxies `/api/*` requests to `LEGACY_API_ORIGIN` when that env var is configured
- returns a bounded `503` when no legacy upstream is configured

## Future bindings reserved here

- `GOVERN_SUITE` for the consolidated `D1` database
- `GOVERN_ARTIFACTS` for artifact `R2` storage
- `GOVERN_EVIDENCE` for evidence-package `R2` storage

Those bindings stay unconfigured until the storage migration is actually ready.

## Local development

From the repo root:

```bash
npm run cf:api:dev
```

## Validation

From the repo root:

```bash
npm run cf:api:typecheck
npx wrangler deploy --dry-run --config infra/pharos-api-worker/wrangler.jsonc
```

## Deployment rule

Do not attach this Worker to `api.pharos-ai.ca` until:

- the cutover decision is explicit
- the legacy upstream is named
- the D1/R2 binding plan is fixed
- the route ownership is documented in the runbooks
