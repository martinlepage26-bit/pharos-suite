# Free-First Architecture

## Public product
- `pharos-ai.ca` is the intended public website
- `www.pharos-ai.ca` redirects to the apex domain
- `AurorAI` and `CompassAI` are treated as internal delivery modules, not public standalone products

## Current free setup
- Frontend: Cloudflare Pages
- DNS and redirects: Cloudflare
- Backends: local only for now
- Database and file processing: local only for now

## Simple rule
If it needs a Python server, Mongo, PDF processing, or file uploads, keep it private until we choose one paid host or redesign it for a simpler platform.

## What to tell yourself
1. Keep `govern-ai` public
2. Keep `AurorAI` and `CompassAI` internal
3. If a public backend is needed, start with only `api.pharos-ai.ca`
4. Keep `AurorAI` and `CompassAI` off public subdomains until there is a separate hosting decision
5. Use one storage plan before exposing heavier backend features

## Storage recommendation
- Use `D1` only for lightweight structured records if we simplify the data model
- Use `R2` for uploaded files and generated evidence packages
- Do not try to store documents directly in `D1`

## Next clean path
1. Keep building the public product in `govern-ai`
2. If Admin and dynamic content need to go live, use the bridge plan in `docs/public-backend-plan.md`
3. Decide later whether `AurorAI` and `CompassAI` stay local, move to one paid host, or get redesigned for Cloudflare-native storage and APIs
