# Cloudflare Pages

## Current repo-side understanding

- Canonical PHAROS hostname target: `https://pharos-ai.ca`
- Redirect hostnames to preserve:
  - `https://www.pharos-ai.ca`
  - `https://pharos-suite.ca`
  - `https://www.pharos-suite.ca`
- Current Pages host that still exists in deployment references: `https://pharos-suite.pages.dev`
- Current Pages project name that still exists in deployment references: `pharos-suite`

## Important boundary note

Repo-side changes now treat `pharos-ai.ca` as the PHAROS surface only.

Do not point `pharossuite.ca` at this Pages project. That hostname belongs to Martin Lepage's personal and professional surface, not to PHAROS.

## Deployment flow

- Production deploys are currently driven from the primary local release branch and local CI/CD controls
- Frontend root directory in Cloudflare Pages: `frontend`
- Build command: `npm install --legacy-peer-deps && npm run build`
- Output directory: `build`

## Preview backend note

- The currently working interactive preview frontend is `https://pharos-suite-review.pages.dev`.
- The currently working preview backend hostname is `https://preview-api.pharos-ai.ca`.
- Preview backend startup order, local dependencies, runtime-only values, and restart recovery are documented in [pharos-preview-backend-runbook.md](/home/cerebrhoe/repos/pharos-suite/docs/pharos-preview-backend-runbook.md).
- Keep preview-only contact-email values, secret env vars, and tunnel credentials out of the repo.

## Redirect behavior to preserve

- `https://pharos-ai.ca` should be the canonical public URL
- `https://www.pharos-ai.ca` should redirect to `https://pharos-ai.ca`
- `https://pharos-suite.ca` should redirect to `https://pharos-ai.ca`
- `https://www.pharos-suite.ca` should redirect to `https://pharos-ai.ca`

## What the repo can change safely

- frontend canonical metadata
- Pages middleware hostname redirects
- SPA route redirects for surfaces that no longer belong on PHAROS
- robots and sitemap assets

## What still needs manual Cloudflare follow-up

- rename or replace the Cloudflare Pages project if you want the external project name to stop saying `pharos-suite`
- attach or verify the apex and redirect hostnames in Cloudflare
- update any zone-level rules that still point legacy PHAROS traffic somewhere else

## Backend subdomains

Not created yet:

- `api.pharos-ai.ca`
- `aurorai.pharos-ai.ca`
- `compassai.pharos-ai.ca`

Current stance:

- `CompassAI` is the PHAROS governance app, and `Aurora` is its intake workflow
- both remain under the main PHAROS surface for now
- do not create standalone public subdomains for them until hosting and boundary decisions are explicit
