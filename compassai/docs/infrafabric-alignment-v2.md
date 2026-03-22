# CompassAI InfraFabric Alignment v2

## What changed in this pass

This pass aligns CompassAI more closely with the COM-AUR v3 structure and the InfraFabric governance-cycle model.

It does not replace the current Mongo implementation.

It does make cycle lineage and reassessment pressure visible instead of flattening everything into the latest assessment only.

## New first-class state now tracked

- `current_cycle_id`
- `cycle_index`
- `feedback_action_count`
- `governance_cycles` collection
- `feedback_actions` collection
- assessment fields:
  - `cycle_id`
  - `parent_assessment_id`
  - `trigger_type`

## Why this matters

CompassAI already had:

- use-case records
- append-only evidence ingest
- assessment records
- audit trail records

What it lacked was explicit lineage between:

1. one governance cycle and the next
2. one assessment and the reassessment that superseded it
3. a new evidence arrival and the reopen pressure it creates

## Stage mapping

| CompassAI route | InfraFabric-aligned state now produced |
|---|---|
| `POST /api/v1/use-cases` | initial governance cycle opened at intake |
| `POST /api/v1/evidence` | append-only evidence record + optional reassessment feedback action |
| `POST /api/v1/use-cases/{usecase_id}/assess` | assessment record with cycle linkage and parent assessment linkage |
| `GET /api/v1/use-cases/{usecase_id}/audit-trail` | still the primary readable event stream |

## What is still not finished

- no dedicated review-seat orchestration yet
- no `if.story`-structured deliverable chain yet
- no explicit closeout route for governance cycles yet
- no policy-rule version collection yet
- no D1 or R2 persistence yet

## Design rule preserved

New evidence after an assessment should create reassessment pressure.

It should not disappear into the same flattened use-case record as if governance history were reversible.
