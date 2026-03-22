# CompassAI Backend Consolidation Plan

CompassAI currently has two backend shapes at once:

- a large runnable monolith in [backend/server.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/server.py)
- a partial router/module structure under [backend/routers/](/home/cerebrhoe/repos/pharos-suite/compassai/backend/routers/)

The governance-program integration was added in a way that works with the live monolith today, but long-term maintainability depends on collapsing these two shapes into one coherent architecture.

## What is duplicated today

### Runtime entrypoint and models

[backend/server.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/server.py) defines:

- enums
- Pydantic models
- auth helpers
- route handlers
- application assembly

At the same time, [backend/models/__init__.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/models/__init__.py) defines overlapping Pydantic models for many of the same concepts.

### Route definitions

The repo already has router files:

- [backend/routers/auth.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/routers/auth.py)
- [backend/routers/clients.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/routers/clients.py)
- [backend/routers/ai_systems.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/routers/ai_systems.py)
- [backend/routers/admin.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/routers/admin.py)
- [backend/routers/governance_program.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/routers/governance_program.py)

But the main route inventory still lives directly in [backend/server.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/server.py), so the router package is only partially authoritative.

## Target backend shape

The clean target is:

1. `server.py` becomes a thin application assembly file
2. `models/` becomes the only place for request/response schemas
3. `routers/` owns route definitions
4. `services/` owns business logic and database workflows
5. `utils/` keeps auth, audit, notifications, and shared helpers

## Recommended migration path

### Phase 1: stop new duplication

Completed partially by this governance-program work:

- new governance functionality lives in [backend/routers/governance_program.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/routers/governance_program.py)
- shared schema changes were mirrored into [backend/models/__init__.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/models/__init__.py)

Next rule:

- no new route handlers should be added directly to [backend/server.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/server.py)

### Phase 2: extract route families

Move route groups out of the monolith in this order:

1. auth
2. clients
3. AI systems
4. assessments
5. evidence and deliverables
6. reports, benchmarks, scheduled reviews, sharing

Each extraction should:

- copy route logic into a router module
- replace direct model definitions with imports from `models`
- keep endpoint paths unchanged
- leave a regression test covering the old behavior

### Phase 3: extract service layer

Create service modules such as:

- `services/assessments.py`
- `services/evidence.py`
- `services/governance_program.py`
- `services/benchmarks.py`

These services should own:

- database reads/writes
- aggregation pipelines
- reusable transformation logic
- policy and workflow enrichment

Routers should become thin transport layers only.

### Phase 4: align data definitions

Once route extraction is stable:

- delete duplicated model definitions from [backend/server.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/server.py)
- import all schema classes from [backend/models/__init__.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/models/__init__.py)
- add focused model tests for new governance fields and defaults

### Phase 5: introduce collection contracts

CompassAI currently uses Mongo without a hard migration framework. Before any SQLAlchemy/PostgreSQL migration decision, add:

- collection naming conventions
- required indexes
- seed/bootstrap scripts
- validation tests for expected document shapes

The governance-program scripts already added in this phase are:

- [backend/scripts/import_governance_deliverables.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/scripts/import_governance_deliverables.py)
- [backend/scripts/link_governance_context.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/scripts/link_governance_context.py)

## Regression-testing strategy

Use three layers:

1. unit tests for catalog and enrichment helpers
2. API tests for route families after extraction
3. smoke tests against a seeded staging database before deploy

Minimum regression checklist for each migrated route family:

- authentication still works
- payload validation is unchanged or intentionally versioned
- response shape is unchanged
- audit logging still fires
- seed scripts still populate required collections

## Decision point: Mongo or SQLAlchemy/PostgreSQL

The user-facing target architecture mentions SQLAlchemy and PostgreSQL, but the live CompassAI repo is still Motor + Mongo. Do not attempt a half-migration. Make the decision explicitly:

- if staying on Mongo, formalize collections and service boundaries
- if moving to PostgreSQL, migrate after the backend architecture is clean enough to map services to repositories cleanly

## Immediate next milestone

The next practical milestone is not a database rewrite. It is:

- finish extracting assessment, evidence, and deliverables logic out of [backend/server.py](/home/cerebrhoe/repos/pharos-suite/compassai/backend/server.py)
- wire the staged frontend workbench against the now-stable governance-program routes
- then choose the persistence strategy from a cleaner architecture baseline
