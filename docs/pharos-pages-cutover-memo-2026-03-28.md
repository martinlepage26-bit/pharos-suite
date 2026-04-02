# PHAROS Pages Cutover Memo

Date: 2026-03-28

Completion note: the cutover is now complete. As of 2026-03-30, the surviving Pages projects are `pharos-suite` for PHAROS and `martin-lepage-site` for the Martin surface. The former preview project `pharos-suite-review` has been deleted.

Use this memo during the Cloudflare dashboard cutover for the PHAROS public shell.

## Cutover target

- Public site: `https://pharos-ai.ca`
- Production Pages project: `pharos-suite`
- No active PHAROS preview Pages project

## Operator boundary

- Repo-side configuration must point production deploys at `pharos-suite`.
- Deleted preview Pages or tunnel surfaces must not be cited as current state.
- No external non-PHAROS domains should remain attached to the production Pages object.

## Preflight

1. Confirm repo-side targets:

```bash
cd /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/frontend
cat package.json
cat wrangler.jsonc
```

Expected:

- production: `pharos-suite`
- preview: retired / not active

2. If the `pharos-suite` production Pages project is missing, create it first with:

- root directory: `frontend`
- build command: `npm install --legacy-peer-deps && npm run build`
- output directory: `build`

## Cutover sequence

1. Build and deploy the production shell:

```bash
cd /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/frontend
npm install
npm run build
npm run cf:deploy
```

2. Verify the resulting `pages.dev` deployment.
3. Attach:
   - `pharos-ai.ca`
   - `www.pharos-ai.ca`
4. Verify redirect rules for:
   - `pharos-suite.ca`
   - `www.pharos-suite.ca`
5. Confirm that no non-PHAROS aliases remain attached to the production project.

## Verification

Run:

```bash
curl -I https://pharos-ai.ca
curl -I https://www.pharos-ai.ca
curl -I https://pharos-suite.ca
```

Expected:

- `https://pharos-ai.ca` returns HTTP `200`
- `https://www.pharos-ai.ca` redirects to `https://pharos-ai.ca`
- `https://pharos-suite.ca` redirects to `https://pharos-ai.ca`

Also verify in the browser:

- `https://pharos-ai.ca/`
- `https://pharos-ai.ca/about`
- `https://pharos-ai.ca/methods/`
- any other release-critical public routes

## Stop conditions

Stop if:

- the `pharos-suite` production deploy fails
- the new `pages.dev` deployment is unhealthy
- canonical routing or redirects behave unexpectedly
- any non-PHAROS domain is still bound to the production Pages object

## Rollback

If the new deployment is unhealthy, fix and redeploy `pharos-suite`. Do not reintroduce old non-PHAROS Pages targets into repo-side commands.

## Record what happened

Capture:

- timestamp of the `pharos-suite` production deploy
- verified `pages.dev` URL
- time `pharos-ai.ca` and `www.pharos-ai.ca` were attached or revalidated
- redirect verification for `pharos-suite.ca` and `www.pharos-suite.ca`
- final confirmation that no external non-PHAROS aliases remain attached
