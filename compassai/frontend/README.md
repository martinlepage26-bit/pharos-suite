# CompassAI Frontend Status

Date reviewed: 2026-03-14

This directory is not a runnable standalone CompassAI browser surface as currently inspected.

## What exists

- config and scaffold files such as:
  - `.env`
  - `components.json`
  - `craco.config.js`
  - `jsconfig.json`
- staged governance-program module files under `src/features/governanceProgram/`

## What was not proven in this repo

- `frontend/package.json`
- a full app shell or route tree
- standalone auth wiring
- build validation for a standalone frontend
- hosting/deploy evidence for a standalone browser surface

## Current product truth

- the real canonical runtime in this repo is `../backend/server.py`
- CompassAI is the governance app within PHAROS, and Aurora is its intake workflow.
- the frontend state is staged/partial, not a proven runnable standalone app
- the current browser presentation for CompassAI is the PHAROS route at `/portal/compassai` inside `/home/cerebrhoe/repos/pharos-suite`

## Do not claim yet

- standalone CompassAI frontend
- standalone CompassAI public web surface
- standalone CompassAI deploy target

## Acceptance threshold before calling this a standalone browser surface

- a real frontend manifest
- a real route tree and app shell
- auth integration
- successful build validation
- hosting/deploy evidence
