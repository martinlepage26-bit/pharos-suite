# PHAROS Product Boundaries

This document is the current naming and boundary source of truth for the safe-language pass in `pharos-suite`.

## Canonical hierarchy

- PHAROS is the public shell at `pharos-ai.ca`.
- CompassAI is the governance application within PHAROS.
- Aurora is the intake and document-processing workflow within CompassAI.

## Current browser truth

- The current real browser surface is the PHAROS frontend shell in `frontend/`.
- The active user-facing routes are `/portal/compassai` and `/portal/compassai/aurora`.
- `/portal/aurorai` remains a compatibility route that redirects to `/portal/compassai/aurora`, not a statement that Aurora is a sibling product to CompassAI.

## Current claim boundary

- Do not claim standalone CompassAI or Aurora production frontends.
- `compassai/frontend/` and `aurorai/frontend/` remain staged work rather than verified standalone browser surfaces.
- `aurorai/` remains the current on-disk compatibility directory for the Aurora service code.

## Rename hold for this pass

- Do not rename filesystem paths, package names, route mechanics, redirects, storage keys, env vars, deploy identifiers, or runtime wiring in this pass.
- Legacy `pharos-suite` and `pharossuite` technical references may still be load-bearing and should be reviewed individually before any rename.
