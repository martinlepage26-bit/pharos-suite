## Cloudflare Readiness

Superseded note: this 2026-03-06 readiness snapshot is historical. As of 2026-03-30, the surviving Pages projects are `pharos-suite` for PHAROS and `martin-lepage-site` for the Martin surface; the former preview project `pharos-suite-review` has been deleted.

### Frontend
- `wrangler` installed locally in `frontend`
- Config file present at `frontend/wrangler.jsonc`
- SPA redirects prepared at `frontend/public/_redirects`
- Pages project already exists: `pharos-suite`
- Custom domains added:
  - `pharos-suite.ca` on Pages, currently still pending verification
- `www.pharos-suite.ca` was removed from the Pages custom-domain list so it can be handled by a Cloudflare redirect rule
- Canonical `www -> apex` redirect is now live through a zone-level Single Redirect
- Deploy commands:
  - `npm run cf:deploy`
  - `npm run cf:preview` now exits with a retirement message because the old preview project no longer exists
- Current live mismatch as of `2026-03-09`:
  - `pharos-suite.pages.dev` serves the current PHAROS build
  - `pharos-suite.ca` still serves the old Pharos-hosted site
  - fixing the apex cutover requires replacing the existing external DNS record

### Blockers
- Apex web DNS for `pharos-suite.ca` still points at the older external origin
- The saved local API token in `/home/cerebrhoe/.cloudflare-pharos-suite.env` is stale and cannot edit DNS
- Backend subdomain origins are not verified yet for:
  - `api.pharos-suite.ca`
  - `aurorai.pharos-suite.ca`
  - `compassai.pharos-suite.ca`

### Backend constraint
- `pharos-suite`, `AurorAI`, and `CompassAI` are Python/Uvicorn services using Mongo sockets and local file upload behavior
- They are not a drop-in Cloudflare move in their current architecture
- Treat Cloudflare Pages as ready for the React frontend only
