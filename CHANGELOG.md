# Changelog

## 2026-03-06
- Snapshot tag: `snapshot-2026-03-06-govern-suite`
- Commit: `754a9fe9c36116f41a3aa98e8b0f4283e1c8b1e6`

### Added
- Lighthouse-led brand system across the public frontend
- Client portal placeholder routes for AurorAI and CompassAI
- Admin platform status tab for service, LLM, and Cloudflare readiness
- Cloudflare Pages prep with `wrangler.jsonc` and SPA redirects

### Changed
- Tightened public-page copy, structure, and layout across the site
- Shifted deployment prep toward Cloudflare Pages for the frontend
- Added backend aggregation for platform status visibility

### Verified
- Frontend build passed
- Local preview works at `http://127.0.0.1:9201/`
- Admin platform status works at `http://127.0.0.1:9201/admin`
- Backend platform status endpoint works at `http://127.0.0.1:9202/api/admin/platform-status`

### Notes
- Frontend is prepared for Cloudflare Pages
- Cloudflare deployment still needs account credentials
- Python backends are not a drop-in Cloudflare move in their current architecture
