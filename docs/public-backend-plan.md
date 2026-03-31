# Public Backend Plan

As of 2026-03-13, the PHAROS frontend is being normalized to `pharos-ai.ca`, while the FastAPI backend still runs locally on `127.0.0.1:9202`.

## Decision

Use a dedicated API subdomain:

- Public API: `https://api.pharos-ai.ca`
- Public frontend: `https://pharos-ai.ca`
- Redirect hosts: `https://www.pharos-ai.ca`, `https://govern-ai.ca`, `https://www.govern-ai.ca`

Do not use a same-origin `/api/*` path on the apex yet.

## Hostname plan

Create now:

- `api.pharos-ai.ca` -> PHAROS FastAPI backend

Do not create yet:

- `aurorai.pharos-ai.ca`
- `compassai.pharos-ai.ca`

Those are PHAROS products, but their standalone public hosting is still a separate decision.

## Recommended rollout

### Phase 1: bridge the existing local backend

Publish `api.pharos-ai.ca` through a named Cloudflare Tunnel that points to:

```txt
http://127.0.0.1:9202
```

This keeps the current backend private while letting the PHAROS site call it through one stable hostname.

### Phase 2: rebuild the public frontend against the API hostname

In the Cloudflare Pages project that currently backs the PHAROS frontend, set:

```txt
REACT_APP_BACKEND_URL=https://api.pharos-ai.ca
```

Then trigger a production rebuild so:

- `/admin` posts to `https://api.pharos-ai.ca/api/admin/login`
- booking requests submit to `https://api.pharos-ai.ca/api/bookings`
- PHAROS product and service surfaces read from the same API origin where needed

### Phase 3: harden the backend edge

Set backend CORS explicitly instead of using `*`:

```txt
CORS_ORIGINS=https://pharos-ai.ca,https://www.pharos-ai.ca,https://govern-ai.ca,https://www.govern-ai.ca,https://govern-ai.pages.dev
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

## Operational notes

- `api.pharos-ai.ca` via Tunnel is suitable as a bridge, not a final uptime story
- if the local host is asleep, offline, or the local stack is stopped, the public API will fail
- `platform-status` only remains meaningful if `CompassAI` and `AurorA` are still reachable from the same machine as the PHAROS backend
- Lotus is no longer part of the PHAROS public/backend surface and should not be republished through this hostname

## Implementation checklist

1. Install and authenticate `cloudflared` on the machine running the PHAROS backend.
2. Create a named Cloudflare Tunnel.
3. Add a published application route for `api.pharos-ai.ca` -> `http://127.0.0.1:9202`.
4. Confirm `https://api.pharos-ai.ca/health` and `https://api.pharos-ai.ca/api/health`.
5. Set `CORS_ORIGINS` to the explicit site origins.
6. Set `REACT_APP_BACKEND_URL=https://api.pharos-ai.ca` in Cloudflare Pages production environment variables.
7. Trigger a new Pages production deployment.
8. Verify:
   - `https://pharos-ai.ca/admin`
   - `https://pharos-ai.ca/about`
   - `https://pharos-ai.ca/observatory`
   - `https://pharos-ai.ca/services`
   - booking form submission
