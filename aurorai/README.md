# Aurora

Compatibility directory name: `aurorai/`

Aurora intake workflow and document-processing service for CompassAI.

## Current role

- `server.py` is the active FastAPI + Mongo backend for the Aurora intake workflow and IDP pipeline.
- `memory/PRD.md` and `docs/infrafabric-alignment-v2.md` describe the intended Aurora execution model and current state tracking.
- `storage/` contains migration-planning helpers for later D1/R2 work.
- `frontend/` is only a scaffold at the moment: config files exist, but no runnable package manifest or populated app tree was found.

## Operational notes

- `CHANGELOG.md` records the verified local API target as `http://127.0.0.1:9206/`.
- The backend defaults to handing evidence off to CompassAI through `COMPASSAI_BASE_URL`.
- This repo does not currently define a standalone public domain or deploy config.
- A bounded local `TestClient` harness confirmed `GET /api/` and `GET /api/idp/pipeline` return HTTP 200 when the backend is imported with placeholder Mongo env values.

## Boundary notes

- Aurora sits inside CompassAI within PHAROS, but this directory is not the PHAROS public shell.
- The current on-disk directory name remains `aurorai/` for compatibility in this pass.
- Public presentation currently also exists inside the `pharos-ai` portal routes while standalone hosting remains undecided.
- Do not infer that repo renaming or domain cleanup is required just because the product brand is clear.
