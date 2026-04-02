# CompassAI Governance Engine

## Module purpose

CompassAI is the governance engine that turns verified evidence into risk posture, required controls, required deliverables, and auditable deployment decisions.

## Engine responsibilities

- maintain canonical use-case registry
- accept and verify append-only evidence packages
- run T0-T3 risk tiering
- preserve governance-cycle lineage
- derive required controls and deliverables
- export human-readable audit trails

## Core engine modules

### 1. Use-case intake

- opens a canonical use-case record
- records `known_unknowns`
- creates the first governance cycle
- sets `status = intake_complete`

### 2. Evidence intake

- verifies evidence hash
- links evidence to use case
- updates evidence count
- records audit events

### 3. Risk engine

- assigns T0-T3 tier
- uses fail-closed logic on uncertainty
- records dimension rationale
- records uncertainty explicitly

### 4. Governance-cycle manager

- opens new cycles on intake or reassessment
- links reassessment to parent assessment
- preserves reopen pressure from new evidence

### 5. Audit trail

- records intake, evidence, assessment, override, and approval events
- keeps the event stream human-readable and machine-parseable

## Tier model

| Tier | Meaning |
|---|---|
| `T0` | low-risk, limited-impact use case |
| `T1` | moderate-risk, assistive or limited personal-data context |
| `T2` | high-risk, significant data or consequential decision potential |
| `T3` | critical-risk, sensitive data and/or strong regulatory consequence |

Tier assignment is a governance signal, not a legal determination.

## State rules

- `intake_complete` is an intake state only
- reassessment to a higher tier requires re-approval
- lower-tier reassessment still requires explicit human confirmation
- new evidence after assessment can reopen governance

## Runtime truth

- current proven runtime is the backend in `compassai/backend/server.py`
- staged frontend workbench components are not yet proof of a runnable standalone app

## Acceptance criteria

- every use case has a stable record
- every use case records `known_unknowns`
- every accepted evidence package is hash-verified
- every assessment links back to evidence and cycle lineage
- every governance status exposed to users is supportable by persisted evidence

## Open gaps

- standalone frontend completeness is not currently proven
- automated council runtime remains roadmap
- mixed monolith/router backend shape remains technical debt

## Source anchors

- `docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md`
- `compassai/README.md`
- `compassai/docs/infrafabric-alignment-v2.md`
- `docs/d1-r2-endpoint-mapping.md`
- `compassai/docs/backend-consolidation-plan.md`

