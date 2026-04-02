# PHAROS Product Boundaries

This document is the current naming and boundary source of truth for `pharos-suite`.

## Canonical hierarchy

- PHAROS is the public shell at `pharos-ai.ca`.
- `pharos-suite` is the internal repo, deploy, and operations anchor.
- CompassAI is the governance application within PHAROS.
- Aurora is the intake and document-processing workflow within CompassAI.

## Surface ownership

- Production Pages project target: `pharos-suite`
- No active PHAROS preview Pages project exists as of 2026-03-30
- Public hostname remains `pharos-ai.ca`
- Martin public identity, Hephaistos narratives, authored tree artifacts, and standalone apps belong on `martin.govern-ai.ca`
- External non-PHAROS surfaces are outside this repo boundary

## Current browser truth

- The current user-facing browser surface is `frontend/`.
- The active user-facing routes are `/portal/compassai` and `/portal/compassai/aurora`.
- `/portal/aurorai` remains a compatibility redirect into the CompassAI/Aurora path.

## Current claim boundary

- Do not claim standalone CompassAI or Aurora production frontends.
- `compassai/frontend/` and `aurorai/frontend/` remain staged work unless separately verified and promoted.
- `aurorai/` remains the current on-disk compatibility directory for the Aurora service code.

## Naming rule for this pass

- Public domains stay PHAROS-facing: `pharos-ai.ca`
- Internal repo, deploy, and operations identifiers stay suite-facing: `pharos-suite`
- Do not reintroduce external Martin, editorial, or non-PHAROS domains into the PHAROS repo or deploy chain

## Operational note

- PHAROS-side production mail for `pharos@`, `consult@`, and `ml@pharos-ai.ca` is documented in `/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/EMAIL-INFRA.md`
