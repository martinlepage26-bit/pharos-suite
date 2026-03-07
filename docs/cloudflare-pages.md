# Cloudflare Pages

## Live frontend state
- Pages project: `govern-ai`
- Pages URL: `https://govern-ai.pages.dev`
- Custom domains:
  - `govern-ai.ca`
  - `www.govern-ai.ca`

## DNS state
- Apex frontend records now point at Cloudflare Pages
- Email-related DNS records remain in Cloudflare DNS and were preserved:
  - inbound MX for `govern-ai.ca`
  - SES send records on `send.govern-ai.ca`
  - DMARC
  - Google verification
  - Resend DKIM

## Redirect behavior
- `www.govern-ai.ca` is canonically redirected to `https://govern-ai.ca`
- The active redirect is implemented as a Cloudflare zone-level Single Redirect
- The `www` DNS record is a proxied placeholder `A` record to `192.0.2.1`, which Cloudflare recommends for apex redirects

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
Before creating backend subdomains, confirm the stable public origins and whether they can terminate or proxy traffic for:
- `api.govern-ai.ca`
- `aurorai.govern-ai.ca`
- `compassai.govern-ai.ca`

## Current deployment status
- `https://govern-ai.ca` responds successfully from Cloudflare Pages
- `https://www.govern-ai.ca` now returns `308` to the apex hostname
- The latest production deployment is driven by GitHub `main`
