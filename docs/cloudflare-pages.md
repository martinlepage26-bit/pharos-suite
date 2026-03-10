# Cloudflare Pages

## Live frontend state
- Pages project: `govern-ai`
- Pages URL: `https://govern-ai.pages.dev`
- Target custom domains:
  - `pharos-ai.ca`
  - `www.pharos-ai.ca`
- Legacy domains to redirect or retire:
  - `govern-ai.ca`
  - `www.govern-ai.ca`

## DNS state
- As of `2026-03-10`, `pharos-ai.ca` is attached to the Pages project but still pending verification
- As of `2026-03-10`, `www.pharos-ai.ca` is attached to the Pages project but still pending verification
- Cloudflare Pages reports `CNAME record not set` for both pending domains
- Public DNS does not currently resolve `pharos-ai.ca` or `www.pharos-ai.ca`
- RDAP for `pharos-ai.ca` currently returns not found, so the domain does not appear to be registered yet
- `https://pharos-ai.ca` is the intended public apex hostname for the PHAROS frontend
- `https://govern-ai.pages.dev` is serving the current PHAROS frontend build
- The active Cloudflare account currently has a zone for `govern-ai.ca`, not for `pharos-ai.ca`
- The active local Cloudflare token can manage Pages but cannot create zones or edit DNS

## Redirect behavior
- `govern-ai.ca`, `www.govern-ai.ca`, and `www.pharos-ai.ca` should resolve to `https://pharos-ai.ca`
- The active redirect is implemented as a Cloudflare zone-level Single Redirect
- `govern-ai.ca` currently returns `308` to `https://pharos-ai.ca/`
- `www.govern-ai.ca` does not currently resolve in public DNS
- `www.pharos-ai.ca` is currently in the Pages custom-domain list, but it is still pending because the new domain is not live in DNS yet

## Deployment flow
- Production deploys are currently driven from GitHub on the `main` branch
- Frontend root directory in Cloudflare Pages: `frontend`
- Build command: `npm install --legacy-peer-deps && npm run build`
- Output directory: `build`

## Local commands
- Build:
  - `npm run build`
- Direct Pages deploy:
  - `npm run cf:deploy`
- Preview deploy:
  - `npm run cf:preview`
- Emergency hostname workaround worker:
  - `infra/cloudflare-live-proxy`

## Admin passphrase
- The `/admin` flow now expects the backend environment variable `ADMIN_PASSPHRASE`
- Configure that variable anywhere the backend runs before using or deploying Admin
- The frontend no longer relies on a build-time public passphrase for admin access

## Backend subdomains
Not created yet:
- `api.pharos-ai.ca`
- `aurorai.pharos-ai.ca`
- `compassai.pharos-ai.ca`

Reason:
- there is no verified stable public origin for `api.pharos-ai.ca`
- the current candidate `AurorAI` and `CompassAI` origins are preview hosts, not confirmed production origins that are ready for custom-domain binding
- creating DNS for those now would risk dead or misleading endpoints

## Next backend-domain step
The next approved step is to create only:

- `api.pharos-ai.ca`

Do not create:

- `aurorai.pharos-ai.ca`
- `compassai.pharos-ai.ca`

Use the rollout in `docs/public-backend-plan.md`:

- bridge the current FastAPI service through Cloudflare Tunnel first
- rebuild Pages with `REACT_APP_BACKEND_URL=https://api.pharos-ai.ca`
- keep the API hostname stable if the origin later moves to managed hosting

## Current deployment status
- `https://govern-ai.pages.dev` is current and healthy
- `https://pharos-ai.ca` should become the public apex once DNS is switched
- legacy `govern-ai.ca` hostnames should return `308` to the new apex hostname
- The latest successful Pages production deployment is from GitHub commit `48049d9` on `main`
- The remaining blocker is no longer just DNS cutover: `pharos-ai.ca` must be registered first, then added as a Cloudflare zone, then delegated to Cloudflare nameservers before Pages can verify it
