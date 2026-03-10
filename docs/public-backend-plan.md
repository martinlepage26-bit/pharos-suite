# Public Backend Plan

As of 2026-03-09, the public frontend is deployed through Cloudflare Pages, while the FastAPI backend still runs locally on `127.0.0.1:9202`.

This document sets the recommended public backend shape for the next phase.

## Decision

Use a dedicated API subdomain:

- Public API: `https://api.pharos-ai.ca`
- Public frontend: `https://pharos-ai.ca`
- Keep `https://www.pharos-ai.ca` as a redirect to the apex

Do not use a same-origin `/api/*` path on the Pages apex yet.

Reason:

- the React app already expects a separate `REACT_APP_BACKEND_URL`
- a subdomain keeps Pages routing simple
- the backend can move from local tunnel to managed hosting later without another frontend URL change
- Cloudflare Tunnel, WAF, and rate limits are easier to scope cleanly on a dedicated API hostname

## Hostname plan

Create now:

- `api.pharos-ai.ca` -> govern-ai FastAPI backend

Do not create yet:

- `aurorai.pharos-ai.ca`
- `compassai.pharos-ai.ca`

Those modules should stay private until there is a separate decision to expose them.

## Recommended rollout

### Phase 1: bridge the existing local backend

Publish `api.pharos-ai.ca` through a named Cloudflare Tunnel that points to:

```txt
http://127.0.0.1:9202
```

This is the fastest safe path because the current backend still depends on:

- local MongoDB
- local environment secrets
- the same machine as the existing operations scripts

Keep the FastAPI app bound to localhost. `cloudflared` can proxy to a localhost service directly.

### Phase 2: rebuild the public frontend against the API hostname

In the Cloudflare Pages project for `govern-ai`, set the production build environment variable:

```txt
REACT_APP_BACKEND_URL=https://api.pharos-ai.ca
```

Then trigger a production rebuild so:

- `/admin` posts to `https://api.pharos-ai.ca/api/admin/login`
- `About`, `Portfolio`, and `Services` load live data from the same API origin

### Phase 3: harden the backend edge

Set backend CORS explicitly instead of using `*`:

```txt
CORS_ORIGINS=https://pharos-ai.ca,https://www.pharos-ai.ca,https://govern-ai.pages.dev
```

Keep these backend requirements in place:

- `ADMIN_PASSPHRASE`
- `MONGO_URL`
- `DB_NAME`
- `RESEND_API_KEY`
- `SENDER_EMAIL`
- `ADMIN_EMAILS`

Add Cloudflare controls on `api.pharos-ai.ca`:

- WAF enabled
- rate limiting on `POST /api/bookings`
- optional rate limiting on `POST /api/admin/login`

### Phase 4: keep the hostname, swap the origin later

When uptime requirements justify it, move the FastAPI backend off the local machine to a stable host.

Keep the public hostname the same:

```txt
https://api.pharos-ai.ca
```

Only the origin behind it changes.

That future host should colocate or replace:

- MongoDB
- booking email credentials
- any admin-only operational probes that currently assume `127.0.0.1`

## Why not `/api/*` on the apex

`pharos-ai.ca` should be the public apex on the Pages project.

A path-based backend would require an extra proxy layer or Worker route to split:

- static frontend traffic to Pages
- API traffic to FastAPI

That is possible later, but it adds moving pieces without solving a problem the current frontend already avoids.

## Operational notes

- `api.pharos-ai.ca` via Tunnel is suitable as a bridge, not a final uptime story
- if the local host is asleep, offline, or the local stack is stopped, the public API will fail
- `platform-status` only remains meaningful if `CompassAI` and `AurorAI` are still reachable from the same machine as the govern-ai backend
- if Cloudflare Access is added later, prefer protecting the frontend admin route and any separate operator tools, while keeping the public read endpoints reachable by the site

## Implementation checklist

1. Install and authenticate `cloudflared` on the machine running the govern-ai backend.
2. Create a named Cloudflare Tunnel.
3. Add a published application route for `api.pharos-ai.ca` -> `http://127.0.0.1:9202`.
4. Confirm `https://api.pharos-ai.ca/health` and `https://api.pharos-ai.ca/api/health`.
5. Set `CORS_ORIGINS` to the explicit site origins.
6. Set `REACT_APP_BACKEND_URL=https://api.pharos-ai.ca` in Cloudflare Pages production environment variables.
7. Trigger a new Pages production deployment.
8. Verify:
   - `https://pharos-ai.ca/admin`
   - `https://pharos-ai.ca/about`
   - `https://pharos-ai.ca/portfolio`
   - `https://pharos-ai.ca/services`
   - booking form submission

## Source notes

This plan follows the current product split already in the repo and uses the documented Cloudflare patterns for:

- Pages build environment variables
- Tunnel published applications
- explicit hostname-to-local-service routing

Official references:

- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/tunnel/setup/
- https://developers.cloudflare.com/tunnel/routing/
- https://fastapi.tiangolo.com/tutorial/cors/
