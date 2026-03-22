# PHAROS Clean Release Candidate

Date: 2026-03-14

This repo currently has many unrelated in-progress changes. To avoid publishing the whole dirty tree, use a detached release-candidate worktree built from `HEAD` and overlay only the PHAROS domain-fix files.

## What belongs in the minimal domain-fix release

- `frontend/functions/_middleware.js`
- `frontend/public/index.html`
- `frontend/public/_redirects`
- `frontend/public/robots.txt`
- `frontend/public/sitemap.xml`

Why this set:

- it captures the apex/canonical metadata change
- it captures redirect-host handling in Pages Functions middleware
- it captures static redirect exclusions already intended for the bounded PHAROS surface
- it includes the new public robots/sitemap assets that point at `pharos-ai.ca`

## Why not deploy from the current working tree

- the current repo has many other frontend, backend, and content changes in progress
- a local Pages deploy from this tree would publish more than the domain repair
- the clean worktree keeps release scope narrow and auditable

## How to create the clean candidate

From the main repo root:

```bash
bash scripts/create_pharos_release_candidate.sh
```

Default target:

```text
/home/cerebrhoe/repos/pharos-ai-release-candidate-2026-03-14
```

You can also provide a custom target path:

```bash
bash scripts/create_pharos_release_candidate.sh /home/cerebrhoe/repos/pharos-ai-release-candidate-custom
```

## What the script does

1. Creates a detached git worktree from `HEAD`
2. Copies only the release-scoped PHAROS domain files from the current working tree
3. Leaves the main dirty workspace untouched

## After the worktree exists

Build it:

```bash
cd /home/cerebrhoe/repos/pharos-ai-release-candidate-2026-03-14/frontend
npm run build
```

If you choose to do a manual Pages deploy from that clean candidate later:

```bash
npm run cf:deploy
```

That still targets the existing `govern-ai` Pages project, which is expected for now.

## Verification after Cloudflare repair or deploy

Run:

```bash
bash /home/cerebrhoe/repos/pharos-ai/scripts/verify_pharos_domains.sh
```

Success target:

- `pharos-ai.ca` returns a public A answer
- `pharos-ai.ca` ends at HTTP `200`
- `www.pharos-ai.ca` lands on `https://pharos-ai.ca/`
- served canonical and `og:url` resolve to `https://pharos-ai.ca`
