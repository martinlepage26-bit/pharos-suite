# Aurora Frontend Status

Date reviewed: 2026-03-14

Compatibility directory name: `aurorai/frontend`

This directory is not a runnable standalone Aurora browser surface as currently inspected.

## What exists

- `components.json`
- `craco.config.js`
- `jsconfig.json`

## What was not proven in this repo

- `frontend/package.json`
- a populated `frontend/src/` app tree
- a route tree or app shell
- build validation for a standalone frontend
- standalone hosting or deploy evidence

## Current product truth

- the real canonical runtime in this repo is `../server.py`
- Aurora is the intake workflow within CompassAI, and its current browser presentation is the PHAROS route at `/portal/compassai/aurora` inside `/home/cerebrhoe/repos/pharos-suite`, with `/portal/aurorai` retained as a compatibility route

## Do not claim yet

- standalone Aurora frontend
- standalone Aurora public web surface
- standalone Aurora deploy target

## Acceptance threshold before calling this a standalone browser surface

- a real frontend manifest
- a real route tree and app shell
- auth integration where required
- successful build validation
- hosting/deploy evidence
