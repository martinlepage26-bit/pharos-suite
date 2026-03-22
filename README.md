# pharos-suite

Monorepo for the PHAROS public shell and the PHAROS product layers.

## What lives here

- `frontend/`, `backend/`, `docs/`, `infra/`, `scripts/`, and `emergentintegrations/` are the current PHAROS public-surface stack for `pharos-ai.ca`.
- `compassai/` is the canonical CompassAI governance application codebase.
- `aurorai/` is the current on-disk service directory for Aurora, the intake and document-processing workflow inside CompassAI.

## Production truth

- The proven public/browser surface today is the PHAROS shell in `frontend/`.
- The current CompassAI browser surface and Aurora intake surface exposed to users still live inside that shell at `/portal/compassai` and `/portal/compassai/aurora`, with `/portal/aurorai` retained as a compatibility route.
- The standalone `compassai/frontend/` and `aurorai/frontend/` directories are staged work, not yet verified standalone production apps.
- The canonical CompassAI backend lives in `compassai/backend/`. The Aurora service currently lives in `aurorai/`; that directory name is compatibility debt, not a statement that Aurora is a sibling product to CompassAI.

## Migration stance

This repository consolidates the working trees that previously lived in:

- `/home/cerebrhoe/repos/pharos-ai`
- `/home/cerebrhoe/repos/CompassAI`
- `/home/cerebrhoe/repos/AurorAI`

The migration intentionally excludes secrets, local `.env` files, uploads, caches, node modules, build output, and backup artifacts.

## High-level layout

- `frontend/`: PHAROS public site and module portal routes
- `backend/`: PHAROS public-shell backend for bookings, admin, services, and status
- `compassai/backend/`: CompassAI governance backend
- `compassai/frontend/`: staged CompassAI frontend work
- `aurorai/server.py`: Aurora intake backend in the compatibility `aurorai/` directory
- `aurorai/frontend/`: staged Aurora frontend scaffold in the compatibility `aurorai/` directory

## Boundary note

See `docs/pharos-product-boundaries.md` for the current naming and claim boundary source of truth.

Do not claim that CompassAI or Aurora have standalone production web frontends unless that is separately validated. Right now the safe claim is:

- standalone backends: yes
- standalone browser surfaces: not yet proven
- PHAROS-hosted portal surfaces: yes
