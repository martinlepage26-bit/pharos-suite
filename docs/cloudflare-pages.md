# Cloudflare Pages

Updated: 2026-03-30

## Current repo-side understanding

- Canonical PHAROS public hostname: `https://pharos-ai.ca`
- Current production Pages project: `pharos-suite`
- Current production domains:
  - `https://pharos-ai.ca`
  - `https://www.pharos-ai.ca`
- No active PHAROS preview Pages project exists. The former preview project `pharos-suite-review` was deleted on 2026-03-30.
- The only other surviving Pages project in the account is `martin-lepage-site`, which serves `https://martin.govern-ai.ca` and is outside this repo boundary.

## Boundary rule

This repo owns the PHAROS public shell and PHAROS module entry routes only.

Do not attach Martin identity, Hephaistos narratives, authored tree artifacts, or standalone app surfaces to the PHAROS Pages project.

## Deployment flow

- Frontend root directory in Cloudflare Pages: `frontend`
- Build command: `npm install --legacy-peer-deps && npm run build`
- Output directory: `build`
- Canonical production deploy command:

```bash
cd /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/frontend
npm run cf:deploy
```

## Legacy hostname note

- `https://pharos-ai.ca` remains canonical
- `https://www.pharos-ai.ca` should redirect to `https://pharos-ai.ca`
- any retained suite-era hostnames such as `https://pharos-suite.ca` or `https://www.pharos-suite.ca` should be treated as optional redirect-only legacy aliases, not as active public identities

## Operational cross-references

- PHAROS product boundary source of truth: `docs/pharos-product-boundaries.md`
- PHAROS mail baseline: `/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/EMAIL-INFRA.md`
- PHAROS API and DNS rollout: `docs/pharos-api-dns-runbook.md`

## If preview is needed again

There is no supported PHAROS preview Pages surface at this time.

If preview must return:

1. Create a new Pages project explicitly.
2. Document its hostname and ownership boundary.
3. Verify it live before citing it in repo docs or scripts.
4. Reintroduce preview deploy helpers only after the new surface exists.

Do not assume the deleted `pharos-suite-review` project can be treated as latent or recoverable by name.

## Verification

- `https://pharos-ai.ca` returns HTTP `200`
- `https://www.pharos-ai.ca` redirects to `https://pharos-ai.ca`
- `https://pharos-suite.pages.dev` serves the current production build when the project is healthy
- no deleted preview hostname should be treated as a current verification target
