# PHAROS Preview Status

Status snapshot: 2026-03-22

## Current state

Previously verified live:

- Frontend preview project: `pharos-suite-review`
- Frontend preview URL: `https://pharos-suite-review.pages.dev`
- Preview backend URL: `https://preview-api.pharos-ai.ca`
- `https://preview-api.pharos-ai.ca/api/health` returned healthy
- `https://pharos-suite-review.pages.dev/contact` loaded normally
- `https://pharos-suite-review.pages.dev/services/menu` loaded normally
- `https://pharos-suite-review.pages.dev/portal/aurorai` redirected to `https://pharos-suite-review.pages.dev/portal/compassai/aurora/`

Portal preview is intentionally bounded. There is no confirmed public AurorAI preview origin and no confirmed public CompassAI preview origin. `REACT_APP_AURORAI_URL` and `REACT_APP_COMPASSAI_URL` are expected by the frontend but unset for this preview path, so the correct behavior is a preview-unavailable state with no fake live module data and no same-origin Pages `/api/*` auto-fetches.

Previously verified live portal behavior:

- `https://pharos-suite-review.pages.dev/portal/aurorai` resolved to `https://pharos-suite-review.pages.dev/portal/compassai/aurora/`
- `https://pharos-suite-review.pages.dev/portal/compassai/aurora/` made zero same-origin Pages `/api/*` requests in a clean browser session
- `https://pharos-suite-review.pages.dev/portal/compassai/` made zero same-origin Pages `/api/*` requests in a clean browser session
- Bounded preview copy was present
- Old live-data copy was absent

## Final fixed issue

The frontend logic fix existed locally and passed tests, but the deployed Pages preview initially kept serving an older frontend artifact. First, the portal patch existed only in the working tree and had not been committed or pushed, so Pages built the old branch tip. Second, after commit and push, Cloudflare registered the new git deployment, but the preview alias still served the old bundle until a manual Pages deploy of the built frontend was run. The final blocker was Pages deployment provenance and alias state, not portal frontend logic.

## Current deployment identifiers

- Repo path: `/home/cerebrhoe/repos/pharos-suite`
- Branch: `preview/pharos-shell-check`
- Commit SHA: `f583584e33c9d575accb5a528676f9e06f31482f`
- Commit subject: `Bound PHAROS portal previews when module origins are unset`
- Pages project: `pharos-suite-review`
- Preview frontend URL: `https://pharos-suite-review.pages.dev`
- Preview backend URL: `https://preview-api.pharos-ai.ca`
- Live alias JS asset now being served: `static/js/main.022b9d12.js` (previously verified live)
- Old alias JS asset before fix: `static/js/main.b9ecd47b.js` (previously verified live)
- Patched local build artifact: `build/static/js/main.022b9d12.js`

Patch file scope, previously verified:

- Intended changed files only:
  - `frontend/src/pages/PortalAurorAI.js`
  - `frontend/src/pages/PortalCompassAI.js`
  - `frontend/src/App.smoke.test.js`
- No intended changes to:
  - `frontend/src/pages/Connect.js`
  - `frontend/src/pages/ServiceMenu.js`
  - `frontend/src/lib/modulePortalApi.js`
  - `frontend/src/App.js`
  - `frontend/public/_redirects`
  - backend
  - production config

## Recovery / redeploy command

Preferred repeatable path: `scripts/deploy_pharos_preview_frontend.sh --yes`

```bash
cd /home/cerebrhoe/repos/pharos-suite/frontend
npx wrangler pages deploy build --project-name pharos-suite-review --branch preview/pharos-shell-check --commit-hash f583584e33c9d575accb5a528676f9e06f31482f --commit-message "Bound PHAROS portal previews when module origins are unset"
```

## Verification checklist

Preview backend health:

```bash
curl -i https://preview-api.pharos-ai.ca/api/health
```

`/contact`:

```bash
curl -L -D - -o /tmp/pharos_contact.html https://pharos-suite-review.pages.dev/contact
rg -o -N '<title>[^<]+' /tmp/pharos_contact.html
```

`/services/menu`:

```bash
curl -L -D - -o /tmp/pharos_services.html https://pharos-suite-review.pages.dev/services/menu
rg -o -N '<title>[^<]+' /tmp/pharos_services.html
```

Redirect check for `/portal/aurorai`:

```bash
curl -L -D - -o /dev/null https://pharos-suite-review.pages.dev/portal/aurorai
```

Current served bundle hash extraction:

```bash
curl -s https://pharos-suite-review.pages.dev/portal/compassai/aurora/ | rg -o "static/js/main\\.[a-f0-9]+\\.js|static/css/main\\.[a-f0-9]+\\.css" -n
```

Browser-level request inspection, previously verified expectation:

- In a clean browser session, `https://pharos-suite-review.pages.dev/portal/compassai/aurora/` should make zero same-origin Pages `/api/*` requests.
- In a clean browser session, `https://pharos-suite-review.pages.dev/portal/compassai/` should make zero same-origin Pages `/api/*` requests.
- Bounded preview copy should be present.
- Old live-data copy should be absent.

## What this preview does NOT mean

- No public AurorAI module API origin is confirmed.
- No public CompassAI module API origin is confirmed.
- This preview does not expose live module data.
- Do not point portal routes at `preview-api.pharos-ai.ca`.
- Do not reuse old `preview.emergentagent.com` hosts.
- Do not touch production during preview recovery.

## If the portal looks broken again

1. Confirm the current branch and commit in `/home/cerebrhoe/repos/pharos-suite`.
2. Confirm the Pages project is `pharos-suite-review` and the branch is `preview/pharos-shell-check`.
3. Confirm the currently served bundle hash from the live alias.
4. Confirm whether the alias is serving an old artifact instead of the expected bundle.
5. Re-run the manual Pages deploy command if the alias is stale.
6. Re-check bounded preview copy and confirm zero same-origin Pages `/api/*` requests on `/portal/compassai/aurora/` and `/portal/compassai/`.

## Known remaining debt

- Pre-existing unrelated warning: nested `<button>` markup in Aurora smoke/test output.
- Standalone public AurorAI and CompassAI hosting remains undefined.
