## Cloudflare Readiness

### Frontend
- `wrangler` installed locally in `frontend`
- Config file present at `frontend/wrangler.jsonc`
- SPA redirects prepared at `frontend/public/_redirects`
- Pages project already exists: `govern-ai`
- Custom domains added:
  - `govern-ai.ca`
- `www.govern-ai.ca` was removed from the Pages custom-domain list so it can be handled by a Cloudflare redirect rule
- Canonical `www -> apex` redirect is now live through a zone-level Single Redirect
- Deploy commands:
  - `npm run cf:deploy`
  - `npm run cf:preview`

### Blockers
- Backend subdomain origins are not verified yet for:
  - `api.govern-ai.ca`
  - `aurorai.govern-ai.ca`
  - `compassai.govern-ai.ca`

### Backend constraint
- `govern-ai`, `AurorAI`, and `CompassAI` are Python/Uvicorn services using Mongo sockets and local file upload behavior
- They are not a drop-in Cloudflare move in their current architecture
- Treat Cloudflare Pages as ready for the React frontend only
