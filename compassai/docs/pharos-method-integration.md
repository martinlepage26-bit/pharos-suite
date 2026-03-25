# PHAROS Method Integration in CompassAI

## Scope

CompassAI now embeds a bounded operational profile of the PHAROS Method Repository so method controls can be consumed and applied inside governance workflows.

This integration uses source-grounded method cues from:

- `90_CONSOLIDATED_DEFINITIVE_METHOD.md`
- `90_CONSOLIDATED_ONE_PAGE_SCHEMA.md`
- `04_IMPLEMENTATION_SURFACE_compassai_PROFILE.md`
- `DATA/CONTROLS/00_FINAL_QUALITY_CHECK.md`
- `DATA/CONTROLS/00_CONTROL_PHASE_TEST_RESULTS.md`

## Backend artifacts

- Method catalog: `compassai/backend/pharos_method_catalog.py`
- Method router: `compassai/backend/routers/pharos_method.py`
- Server mount: `compassai/backend/server.py`

## API endpoints

Mounted under `/api`:

- `GET /api/governance/method/pack`
  - Returns consolidated method pack for CompassAI (steps, schema flow, control rails, provenance, quality summary).

- `GET /api/governance/method/control-register`
  - Returns PHAROS control rails mapped to CompassAI enforcement surfaces.

- `POST /api/governance/method/bootstrap`
  - Upserts `governance_method_profiles` record (`pharos_method_compassai_v1`) in Mongo.

- `GET /api/assessments/{assessment_id}/method-context`
  - Reads method context attached to an assessment.

- `POST /api/assessments/{assessment_id}/method/apply`
  - Applies method context to an assessment and writes:
    - `assessment.method_context`
    - `assessment.workflow.latest_decision_summary`
  - Also writes an audit log event (`assessment_method_context`).

## What “applied” means

Applied means each assessment can carry explicit method governance context, including:

- control rails
- quality status reference
- provenance references
- enforcement flag (`enforce_controls`)
- operator note for boundary conditions

This keeps method claims bounded and auditable instead of implicit.
