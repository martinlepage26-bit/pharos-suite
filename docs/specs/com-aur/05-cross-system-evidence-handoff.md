# Cross-System Evidence Handoff

## Module purpose

Define the contract between Aurora and CompassAI. This is the narrowest coupling point in the system and the most important place to preserve claim discipline.

## Contract surfaces

Aurora side:

- `POST /api/documents/{doc_id}/evidence-package`
- `POST /api/documents/{doc_id}/handoff-to-compassai`

CompassAI side:

- `POST /api/v1/evidence`
- `GET /api/v1/evidence/use-case/{usecase_id}`

Hosted governance-program API:

- `compassai/docs/governance-program-openapi.yaml` remains the canonical contract for the staged governance-program workbench surface

## Handoff requirements

- evidence package is schema-versioned
- package hash is present
- hash verification is mandatory before governance acceptance
- acceptance is append-only
- failed handoff attempts are auditable
- handoff success does not imply governance approval

## Handoff state model

| State | Meaning |
|---|---|
| `package_created` | evidence envelope exists |
| `handoff_attempted` | Aurora has attempted delivery |
| `handoff_failed` | transport or validation failure occurred |
| `handoff_succeeded` | package reached CompassAI |
| `accepted_for_governance` | CompassAI verified hash/schema and linked package to a use case |
| `rejected_for_governance` | package failed verification or contract checks |

## Failure handling

- transport failure writes a new audit event
- hash mismatch blocks governance promotion
- schema mismatch blocks governance promotion
- retry creates a new attempt record
- payload regeneration creates a new package version rather than mutating the old one

## Security and ownership rules

- Aurora owns package creation and transport attempt logging
- CompassAI owns verification and governance acceptance
- service-token use is a runtime convenience, not proof of governance correctness

## Acceptance criteria

- every accepted package is linked to a stable use case
- every rejected package preserves the rejection reason
- every package can be traced back to source hash and processing run lineage
- no package is treated as approved merely because it was received

## Open gaps

- exactly-once delivery and HA claims remain out of scope while `if.bus` is preview
- hard technical deployment gating through `if.switchboard` remains preview / organizational control territory

## Source anchors

- `docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md`
- `docs/d1-r2-endpoint-mapping.md`
- `docs/govern-suite-operations-runbook.md`
- `compassai/docs/governance-program-openapi.yaml`

