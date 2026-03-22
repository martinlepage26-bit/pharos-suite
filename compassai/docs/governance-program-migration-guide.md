# Governance Program Migration Guide

This guide deploys the AI governance deliverables package into the live CompassAI backend that exists today: FastAPI + Motor + MongoDB. It does not assume the target SQLAlchemy/PostgreSQL architecture is already in place.

CompassAI should be treated as a hosted, browser-based governance platform. End users should complete assessments, attach evidence, review committee decisions, and consume executive reporting online through the web application, not through a desktop workflow.

## 1. Pre-deployment checks

1. Ensure the backend environment has valid `MONGO_URL`, `DB_NAME`, and `SECRET_KEY` values in [backend/.env](/home/cerebrhoe/repos/pharos-suite/compassai/backend/.env).
2. Confirm the application can already start from [backend/server.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/server.py).
3. Take a database backup of the target CompassAI environment before running the import and linking scripts.
4. Collect the governance deliverables markdown bundle into a single directory with these filenames:
   - `ai_governance_framework.md`
   - `executive_sponsor_briefing.md`
   - `governance_committee_charter.md`
   - `ai_system_inventory.md`
   - `policy_library.md`
   - `incident_response_plan.md`
   - `third_party_ai_contract_template.md`
   - `training_and_awareness_plan.md`

## 2. Deploy the backend code

Deploy these files together:

- [backend/server.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/server.py)
- [backend/models/__init__.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/models/__init__.py)
- [backend/governance_catalog.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/governance_catalog.py)
- [backend/routers/governance_program.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/routers/governance_program.py)
- [backend/routers/__init__.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/routers/__init__.py)

The new router is mounted under `/api`, so the new endpoints become available without changing the external base path.

## 3. Import the deliverables package

Run:

```bash
cd /home/cerebrhoe/repos/pharos-suite/compassai/backend
python3 scripts/import_governance_deliverables.py --bundle-dir /path/to/governance-package
```

This script:

- upserts the markdown bundle into `governance_artifacts`
- bootstraps `governance_policies`
- bootstraps `training_modules`
- creates a default `Enterprise AI Governance Committee`
- preserves taxonomy metadata for each artifact:
  - domain
  - control function
  - artifact class
  - subject object
  - lifecycle stage
  - evidence status
  - formality
  - file format

If you want to stage the import in smaller steps:

```bash
python3 scripts/import_governance_deliverables.py --bundle-dir /path/to/governance-package --skip-policies --skip-training --skip-committee
```

## 4. Link the new records into existing CompassAI data

Run:

```bash
cd /home/cerebrhoe/repos/pharos-suite/compassai/backend
python3 scripts/link_governance_context.py
```

This script:

- updates clients with governance-program defaults and committee references
- attaches base policies and control references to AI systems
- enriches assessments with policy IDs, workflow flags, artifact attachments, and training recommendations

Use `--force` only if you intentionally want to overwrite existing governance-context values:

```bash
python3 scripts/link_governance_context.py --force
```

## 5. Validate the deployment

### Route availability

Confirm the following endpoints respond:

- `GET /api/governance/artifacts`
- `GET /api/governance/policies`
- `GET /api/governance/training`
- `GET /api/governance/committees`
- `GET /api/governance/executive-dashboard`

### Data checks

Confirm these collections now exist and contain records:

- `governance_artifacts`
- `governance_policies`
- `training_modules`
- `governance_committees`
- `governance_committee_meetings`
- `governance_committee_decisions`

### Assessment checks

Spot-check a representative assessment and verify:

- `criteria.applicable_policy_ids` is populated
- `workflow.current_stage` exists
- `governance_artifacts` contains attached package artifacts
- `training_recommendation_ids` is present when the assessment has gaps

## 6. Frontend dependency note

The repository currently does **not** contain a complete runnable CompassAI React app. There is a `frontend/` scaffold, but not a working package manifest. Deploy the backend first, then wire a hosted web workbench against the published API surface using the schemas in [docs/governance-program-openapi.yaml](/home/cerebrhoe/repos/pharos-suite/compassai/docs/governance-program-openapi.yaml).

## 7. Rollback plan

If you need to roll back:

1. Deploy the prior version of [backend/server.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/server.py) and related backend files.
2. Restore the pre-migration Mongo backup.
3. If partial rollback is required, delete the new collections only after confirming nothing else depends on them.

Recommended rollback deletion order:

1. `governance_committee_decisions`
2. `governance_committee_meetings`
3. `governance_committees`
4. `training_modules`
5. `governance_policies`
6. `governance_artifacts`

## 8. Post-deployment follow-up

After the first successful deployment:

1. Add frontend forms for assessment governance context, artifact attachments, and executive dashboard views.
2. Standardize server-side validation so governance-context rules are enforced during assessment creation and update, not only by linking scripts.
3. Decide whether to keep the current Motor/Mongo design or migrate to the target SQLAlchemy/PostgreSQL architecture in a later phase.
4. Expose the assessment workflow only through the hosted online workbench so governance records, approvals, and audit trails stay centralized.
