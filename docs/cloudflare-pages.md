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
- As of `2026-03-09`, the apex web DNS record does not point at Cloudflare Pages yet
- `https://pharos-ai.ca` is the intended public apex hostname for the PHAROS frontend
- `https://govern-ai.pages.dev` is serving the current PHAROS frontend build
- Email-related DNS records remain in Cloudflare DNS and were preserved:
  - inbound MX for `pharos-ai.ca`
  - SES send records on `send.pharos-ai.ca`
  - DMARC
  - Google verification
  - Resend DKIM

## Redirect behavior
- `govern-ai.ca`, `www.govern-ai.ca`, and `www.pharos-ai.ca` should resolve to `https://pharos-ai.ca`
- The active redirect is implemented as a Cloudflare zone-level Single Redirect
- `www.pharos-ai.ca` is not in the Pages custom-domain list on purpose

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
- The latest successful Pages production deployment is from GitHub commit `dd9a40b` on `main`
- The remaining blocker is the external DNS/domain cutover from `govern-ai.ca` to `pharos-ai.ca`
