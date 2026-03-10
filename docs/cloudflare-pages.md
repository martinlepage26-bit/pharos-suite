# Cloudflare Pages

## Live frontend state
- Pages project: `govern-ai`
- Pages URL: `https://govern-ai.pages.dev`
- Active custom domain:
  - `govern-ai.ca`
- Additional hostname to restore or redirect:
  - `www.govern-ai.ca`
- Removed pending experiment on `2026-03-10`:
  - `pharos-ai.ca`
  - `www.pharos-ai.ca`

## DNS state
- As of `2026-03-10`, `govern-ai.ca` is attached to the Pages project and validated
- `https://govern-ai.pages.dev` is serving the current PHAROS frontend build
- The active Cloudflare account has a zone for `govern-ai.ca`
- The active local Cloudflare token can manage Pages, but it cannot inspect or edit zone-level redirect or DNS rules

## Redirect behavior
- The intended canonical hostname is `https://govern-ai.ca`
- The intended redirect is `https://www.govern-ai.ca` -> `https://govern-ai.ca`
- `govern-ai.ca` now serves the site again after the hostname rollback deploy
- `www.govern-ai.ca` is attached to Pages and currently pending validation
- Finishing the rollback requires waiting for `www.govern-ai.ca` validation to complete in the Cloudflare dashboard

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
- `api.govern-ai.ca`
- `aurorai.govern-ai.ca`
- `compassai.govern-ai.ca`

Reason:
- there is no verified stable public origin for `api.govern-ai.ca`
- the current candidate `AurorAI` and `CompassAI` origins are preview hosts, not confirmed production origins that are ready for custom-domain binding
- creating DNS for those now would risk dead or misleading endpoints

## Next backend-domain step
The next approved step is to create only:

- `api.govern-ai.ca`

Do not create:

- `aurorai.govern-ai.ca`
- `compassai.govern-ai.ca`

Use the rollout in `docs/public-backend-plan.md`:

- bridge the current FastAPI service through Cloudflare Tunnel first
- rebuild Pages with `REACT_APP_BACKEND_URL=https://api.govern-ai.ca`
- keep the API hostname stable if the origin later moves to managed hosting

## Current deployment status
- `https://govern-ai.pages.dev` is current and healthy
- `https://govern-ai.ca` is serving as the public apex again
- The hostname rollback deploy is live on the Pages project
- The remaining blocker is only `www.govern-ai.ca` still pending validation
