# PHAROS Workers Foundation

Date: 2026-04-02

## Governing object

This note defines the bounded path from the current `Pages + Functions + Tunnel-backed FastAPI` setup to a future `Workers + D1 + R2` runtime.

It does not declare the migration complete.

It lays the foundation so we can harden the public surface now and move the API edge later without redoing the topology a second time.

## Current production state

- public shell: `https://pharos-ai.ca`
- runtime shape: Cloudflare Pages with `frontend/functions/_middleware.js`
- current API bridge: `https://api.pharos-ai.ca` -> Cloudflare Tunnel -> local FastAPI on `127.0.0.1:9202`
- database-backed Worker modules already exist in bounded form inside:
  - `/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/aurorai/src`
  - `/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/compassai/src`

## Hardening decisions made now

### Pages surface

Keep the public shell on Pages for now.

Reason:

- the public shell is mostly static and route-stable
- Pages already gives us the right hosting shape for the marketing and intake surface
- Pages Functions already covers the current redirect and protected-path edge logic
- a forced move right now would mix host migration risk with unfinished database migration work

### Edge controls

The Pages middleware should now be treated as a real edge boundary, not just a redirect shim.

That means:

- enforce `GET`, `HEAD`, and `OPTIONS` only on the public shell
- apply explicit security headers on every response
- keep protected routes non-cacheable and non-indexable
- keep hostname normalization at the edge

## Worker foundation added now

New bounded foundation:

- `/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/infra/pharos-api-worker`

What it is:

- a route-detached Worker for `api.pharos-ai.ca`
- usable first as a proxy to the legacy FastAPI backend
- shaped to become the later D1/R2-backed API edge

What it does today:

- serves `/health` and `/api/health`
- issues request IDs
- applies API-side security headers
- enforces explicit CORS for PHAROS origins
- proxies `/api/*` to `LEGACY_API_ORIGIN` when configured
- fails closed with `503` when no upstream is configured

What it does not claim:

- production route ownership
- complete auth or RBAC
- D1 migration completion
- R2 write completion
- hosted replacement of the live FastAPI backend

## Migration trigger conditions

Move `api.pharos-ai.ca` to the Worker when at least one of these becomes operationally necessary:

1. D1-backed persistence is needed for live governance state instead of bridge-only planning.
2. R2-backed artifact or evidence storage must be managed at the edge.
3. The laptop-hosted FastAPI bridge becomes an uptime or dependency risk.
4. Cross-product request tracing and edge-owned audit receipts become required.
5. CORS, rate limiting, and request control need to live in one Cloudflare-native surface.

## Phased migration path

### Phase 0

Current state.

- Pages hosts the shell.
- Tunnel-backed FastAPI hosts the API.
- Worker foundation exists but is not attached to `api.pharos-ai.ca`.

### Phase 1

Attach the Worker to `api.pharos-ai.ca` in proxy mode.

- Worker receives all API traffic.
- Worker proxies to the current FastAPI backend.
- tunnel remains the actual business-logic runtime
- Cloudflare becomes the stable edge ownership layer

This phase is the right first cutover because it changes the edge without changing the storage or business logic.

### Phase 2

Move the easiest routes to native Worker ownership first.

Candidates:

- `/health`
- read-only configuration or capability endpoints
- request tracing and intake envelope validation

### Phase 3

Bind and activate:

- `GOVERN_SUITE` in `D1`
- `GOVERN_ARTIFACTS` in `R2`
- `GOVERN_EVIDENCE` in `R2`

Then cut over the already bounded Worker-era modules from AurorA and COMPASSai incrementally.

### Phase 4

Remove the tunnel dependency once the required route families are native and the database-backed edge state is actually live.

## Implementation guardrails

- Do not move the public shell off Pages just because a Worker exists.
- Do not attach the Worker route before the upstream or bindings are named.
- Do not claim database-backed completeness before the D1 schema is provisioned and applied.
- Do not let the Worker foundation become a second undocumented runtime.

## Immediate next steps after this foundation pass

1. Keep using Pages for the public shell deploys.
2. Keep using `api.pharos-ai.ca` through the tunnel until cutover is explicit.
3. Validate the Worker foundation with typecheck and dry-run deploys only.
4. When D1 becomes real, attach bindings in `infra/pharos-api-worker/wrangler.jsonc` instead of inventing another API surface.
