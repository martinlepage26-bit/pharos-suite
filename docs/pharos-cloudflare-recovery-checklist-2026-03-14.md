# PHAROS Cloudflare Recovery Checklist

Date: 2026-03-14

This is the smallest safe recovery sequence for the current PHAROS public-domain outage. It is intentionally narrow: fix domain wiring first, then deploy, then verify.

## Current proven state

- `https://pharos-ai.ca` is intended to be the canonical public PHAROS hostname.
- The current working tree already points canonical and Open Graph metadata to the apex hostname in `frontend/public/index.html`.
- Cloudflare Pages currently lists the `govern-ai` project with:
  - `govern-ai.pages.dev`
  - `govern-ai.ca`
  - `pharos-ai.ca`
- `www.pharos-ai.ca` is not currently listed there.
- Public checks from this machine show:
  - `pharos-ai.ca`: no public A answer and browser-level name resolution failure
  - `www.pharos-ai.ca`: resolves but returns `522`
  - `govern-ai.ca`: serves the PHAROS frontend
  - `govern-ai.pages.dev`: serves the PHAROS frontend

## Recovery order

1. Repair the apex custom domain in Cloudflare Pages and DNS.
   - Open the Cloudflare Pages project currently serving PHAROS.
   - Verify that `pharos-ai.ca` is attached and healthy as a custom domain.
   - If Cloudflare shows the domain as detached, pending, invalid, or conflicted, repair that state before touching the app again.
   - Do not assume repo-side redirects can compensate for a missing apex DNS answer.

2. Fix `www.pharos-ai.ca` as a redirect hostname.
   - Attach `www.pharos-ai.ca` to the same Pages project as a redirect to `https://pharos-ai.ca`.
   - Remove or replace any stale zone-level DNS or proxy path that still points `www.pharos-ai.ca` at an origin capable of returning `522`.
   - The goal is not for `www` to serve its own copy of the site; the goal is a clean redirect to the apex.

3. Leave `govern-ai.ca` decision-bound.
   - If you still want legacy PHAROS traffic preserved, keep `govern-ai.ca` redirecting into the apex PHAROS hostname.
   - If that redirect is not yet configured, do not treat the current `200` on `govern-ai.ca` as the finished public state.

4. Trigger a fresh production deploy only after the domain wiring is healthy.
   - The live Pages HTML currently lags the working tree and still advertises `https://www.pharos-ai.ca` in canonical metadata.
   - Prefer the existing GitHub production deploy path for `main`.
   - If you intentionally do a local Pages deploy, be aware that this repo has unrelated in-progress changes. Do not publish from a dirty tree unless you explicitly want all current frontend changes to go live together.

5. Run the repo-local verification check.
   - From the repo root:
   - `bash scripts/verify_pharos_domains.sh`
   - Success target:
     - `pharos-ai.ca` has a public A answer
     - `pharos-ai.ca` loads with final HTTP `200`
     - `www.pharos-ai.ca` lands on `https://pharos-ai.ca/`

## Local files to trust during verification

- Canonical metadata target: `/home/cerebrhoe/repos/pharos-ai/frontend/public/index.html`
- Redirect middleware target: `/home/cerebrhoe/repos/pharos-ai/frontend/functions/_middleware.js`
- Repo-side Pages expectations: `/home/cerebrhoe/repos/pharos-ai/docs/cloudflare-pages.md`
- Repeatable verification script: `/home/cerebrhoe/repos/pharos-ai/scripts/verify_pharos_domains.sh`

## What this checklist does not prove

- It does not prove long-term uptime architecture for `api.pharos-ai.ca`.
- It does not prove that all legacy hostnames are fully decommissioned.
- It does not replace a final browser pass after DNS propagation.
