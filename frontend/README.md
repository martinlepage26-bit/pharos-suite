# PHAROS Frontend

React and Cloudflare Pages frontend for the PHAROS public surface at `pharos-ai.ca`.

## Commands

- `npm start`: local development
- `npm run build`: production build
- `npm test`: CRA test runner

## Public boundary

- Keep this frontend focused on PHAROS pages, PHAROS insights, and PHAROS product portals
- Do not treat external Martin-owned portfolio or resume material as PHAROS content
- Do not reintroduce Lotus as a PHAROS route without an explicit boundary decision
- Keep any legacy `/portal/lotus` handling at the redirect layer rather than reopening an in-app route

## Deployment notes

- Canonical public hostname: `https://pharos-ai.ca`
- Legacy hostnames such as `pharos-suite.ca` should redirect to `https://pharos-ai.ca`
- The current Cloudflare Pages project name remains the internal identifier `pharos-suite`
- There is no active PHAROS preview Pages host as of 2026-03-30
