# Free-First Architecture

## Public product

- `pharos-ai.ca` is the PHAROS public website
- `www.pharos-ai.ca` should redirect to the apex domain
- `govern-ai.ca` should also redirect to the apex domain during migration
- `CompassAI` is the PHAROS governance app, and `Aurora` is its intake workflow, but neither is a standalone public subdomain yet

## Current free setup

- Frontend: Cloudflare Pages
- DNS and redirects: Cloudflare
- Backends: local only for now
- Database and file processing: local only for now

## Simple rule

If it needs a Python server, Mongo, PDF processing, or file uploads, keep it private until we choose one paid host or redesign it for a simpler platform.

## What to tell yourself

1. Keep PHAROS public at `pharos-ai.ca`
2. Keep `CompassAI` and `Aurora` inside the PHAROS surface until separate hosting is ready
3. If a public backend is needed, start with only `api.pharos-ai.ca`
4. Keep heavier product surfaces off standalone public subdomains until hosting decisions are explicit
5. Use one storage plan before exposing heavier backend features

## Storage recommendation

- Use `D1` only for lightweight structured records if we simplify the data model
- Use `R2` for uploaded files and generated evidence packages
- Do not try to store documents directly in `D1`

## Next clean path

1. Keep building the PHAROS public product in this repo
2. If Admin and dynamic content need to go live, use the bridge plan in `docs/public-backend-plan.md`
3. Move Martin Lepage profile, resume, publication, and other non-PHAROS material to `governai.ca`
4. Keep Lotus out of the PHAROS repo and PHAROS public surface
