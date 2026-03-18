# Cloudflare Pages

## Current repo-side understanding

- Canonical PHAROS hostname target: `https://pharos-ai.ca`
- Redirect hostnames to preserve:
  - `https://www.pharos-ai.ca`
  - `https://govern-ai.ca`
  - `https://www.govern-ai.ca`
- Current Pages host that still exists in deployment references: `https://govern-ai.pages.dev`
- Current Pages project name that still exists in deployment references: `govern-ai`

## Important boundary note

Repo-side changes now treat `pharos-ai.ca` as the PHAROS surface only.

Do not point `governai.ca` at this Pages project. That hostname belongs to Martin Lepage's personal and professional surface, not to PHAROS.

## Deployment flow

- Production deploys are currently driven from GitHub on the `main` branch
- Frontend root directory in Cloudflare Pages: `frontend`
- Build command: `npm install --legacy-peer-deps && npm run build`
- Output directory: `build`

## Redirect behavior to preserve

- `https://pharos-ai.ca` should be the canonical public URL
- `https://www.pharos-ai.ca` should redirect to `https://pharos-ai.ca`
- `https://govern-ai.ca` should redirect to `https://pharos-ai.ca`
- `https://www.govern-ai.ca` should redirect to `https://pharos-ai.ca`

## What the repo can change safely

- frontend canonical metadata
- Pages middleware hostname redirects
- SPA route redirects for surfaces that no longer belong on PHAROS
- robots and sitemap assets

## What still needs manual Cloudflare follow-up

- rename or replace the Cloudflare Pages project if you want the external project name to stop saying `govern-ai`
- attach or verify the apex and redirect hostnames in Cloudflare
- update any zone-level rules that still point legacy PHAROS traffic somewhere else

## Backend subdomains

Not created yet:

- `api.pharos-ai.ca`
- `aurorai.pharos-ai.ca`
- `compassai.pharos-ai.ca`

Current stance:

- `AurorAI` and `CompassAI` are PHAROS products
- they remain under the main PHAROS surface for now
- do not create standalone public subdomains for them until hosting and boundary decisions are explicit
