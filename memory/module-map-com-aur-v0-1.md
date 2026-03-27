# pharos-suite Module Map

Version: 0.1  
Date: 2026-03-06

## Purpose

This module map defines the first practical integration shape for `pharos-suite`, `AurorAI`, and `CompassAI`.

The design goal is simple:

- `pharos-suite` is the institutional shell and client-facing experience
- `AurorAI` is the document execution and evidence-packaging engine
- `CompassAI` is the governance workbench that consumes evidence and produces tiered governance outputs

This keeps the system legible and prevents three separate products from drifting into three separate frontends.

## Naming

User-facing product names:

- `pharos-suite`
- `AurorAI`
- `CompassAI`

Architecture/spec shorthand:

- `AurorAI` = execution layer
- `ComPassAI` = governance layer

In code and URLs, `CompassAI` remains the stable public name. `ComPassAI` is treated as the architecture label carried over from the aligned spec.

## Operating Model

```text
pharos-suite shell
  -> client portal entry
    -> AurorAI module
      -> evidence package
        -> CompassAI module
          -> risk tier
          -> controls
          -> deliverables
          -> audit trail
```

## Responsibility Split

### pharos-suite

Owns:

- public website
- positioning, trust, and contact flows
- client portal entry points
- future shared auth shell
- future shared navigation across modules

Does not own:

- low-level document extraction
- evidence package generation logic
- governance tiering logic

### AurorAI

Owns:

- document intake
- text extraction
- document classification
- structured field extraction
- control checks on extracted content
- evidence package generation

Does not own:

- final governance tiering
- deployment approval
- portfolio-level governance decisions

### CompassAI

Owns:

- canonical use-case registry
- append-only evidence ingestion
- risk tiering
- required controls derivation
- required deliverables derivation
- governance audit trail

Does not own:

- raw document processing
- OCR and extraction execution
- external marketing shell

## Frontend Route Map

### pharos-suite public shell

- `/`
- `/services`
- `/research`
- `/about`
- `/connect`
- `/faq`
- `/tool`
- `/services/menu`
- `/library`
- `/cases`
- `/portfolio`
- `/sealed-card`

### pharos-suite client portal entry

- `/client-portal/aurorai`
- `/client-portal/compassai`

These are currently placeholders, but they establish the navigation contract now.

## Backend Module Map

### AurorAI current role

Repository:

- `/home/cerebrhoe/repos/AurorAI`

Current first-pass backend surfaces relevant to integration:

- `POST /api/documents/upload`
- `POST /api/documents/{doc_id}/categorize`
- `POST /api/documents/{doc_id}/summary`
- `POST /api/documents/{doc_id}/extract`
- `POST /api/documents/{doc_id}/citations`
- `POST /api/documents/{doc_id}/evidence-package`
- document and reading-list retrieval routes

New first-pass contract added:

- `POST /api/documents/{doc_id}/evidence-package`

What it does:

- requires structured extraction first
- computes or reuses `source_hash`
- assembles a spec-aligned evidence package
- stores append-only evidence package records in `db.evidence_packages`
- returns an envelope containing:
  - `usecase_id`
  - `producer`
  - `artifact_type`
  - `payload`
  - `hash`
  - `control_checks`

### CompassAI current role

Repository:

- `/home/cerebrhoe/repos/CompassAI`

Current first-pass governance surfaces added into the live monolith:

- `POST /api/v1/use-cases`
- `GET /api/v1/use-cases`
- `GET /api/v1/use-cases/{usecase_id}`
- `POST /api/v1/evidence`
- `GET /api/v1/evidence/use-case/{usecase_id}`
- `POST /api/v1/use-cases/{usecase_id}/assess`
- `GET /api/v1/use-cases/{usecase_id}/audit-trail`

What they do:

- create canonical use-case registry records
- ingest evidence packages append-only
- verify evidence hashes before acceptance
- run first-pass T0 to T3 risk tiering
- derive required controls
- derive required deliverables
- maintain an append-only governance audit trail

## Canonical Flow

### Step 1

A client enters through `pharos-suite` and is routed toward the relevant module surface.

### Step 2

A document is processed in `AurorAI`.

Outputs include:

- source hash
- extraction results
- control checks
- review signals
- evidence package envelope

### Step 3

The resulting evidence package is sent to `CompassAI` through:

- `POST /api/v1/evidence`

### Step 4

`CompassAI` links the evidence to a canonical use case and runs:

- risk tier assessment
- required controls derivation
- required deliverables derivation

### Step 5

`pharos-suite` becomes the place where those module outputs are surfaced coherently for clients.

## Key Shared Objects

### Use case record

Owned by `CompassAI`.

Core fields:

- `name`
- `purpose`
- `business_owner`
- `business_owner_confirmed`
- `systems_involved`
- `data_categories`
- `automation_level`
- `decision_impact`
- `regulated_domain`
- `regulated_domain_notes`
- `scale`
- `known_unknowns`
- `client_id`
- `ai_system_id`

### Evidence package envelope

Produced by `AurorAI`, consumed by `CompassAI`.

Core fields:

- `usecase_id`
- `producer`
- `artifact_type`
- `payload`
- `hash`
- `control_checks`

### Governance assessment

Owned by `CompassAI`.

Core outputs:

- `risk_tier`
- `dimension_scores`
- `dimension_rationale`
- `uncertainty_fields`
- `required_controls`
- `required_deliverables`
- `gate_status`

## First-Pass Risk Logic

Current logic is intentionally simple and inspectable.

Dimensions:

- data sensitivity
- decision impact
- regulated domain
- scale

Current behavior:

- assigns `T0` to `T3` from the highest dimension score
- bumps one tier upward when uncertainty exists
- returns explicit dimension rationale and uncertainty fields

This is good enough for a first governance spine.
It is not yet a finished policy engine.

## What Is Deliberately Not Implemented Yet

To avoid going off rails, the following are still out of scope in this pass:

- shared authentication across all three systems
- automatic evidence push from `AurorAI` to `CompassAI`
- full policy versioning engine
- real deliverable document generation
- approval signatures and deployment gate enforcement
- shared embedded frontend workbench inside `pharos-suite`
- multi-tenant tenancy model

## Immediate Next Build Steps

### Phase A

Stabilize the contracts.

- keep `AurorAI` evidence package schema stable
- keep `CompassAI` evidence ingest validation strict
- add light integration tests around hash verification and tiering

### Phase B

Expose module outputs inside `pharos-suite`.

- show use-case status
- show latest evidence package state
- show current risk tier and required next actions

### Phase C

Unify auth and navigation.

- shared login shell in `pharos-suite`
- module-aware navigation and permissions
- client-specific portal experiences

## Working Rule

If a capability belongs to extraction, it stays in `AurorAI`.
If a capability belongs to governance judgment, it lives in `CompassAI`.
If a capability belongs to trust, presentation, and client navigation, it belongs in `pharos-suite`.

That split is the simplest shape that can scale without making later consolidation harder.
