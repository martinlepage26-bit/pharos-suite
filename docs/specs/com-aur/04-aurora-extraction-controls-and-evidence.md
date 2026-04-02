# Aurora Extraction, Controls, And Evidence

## Module purpose

Define the governed processing path after intake:

`classification -> extraction -> control checks -> review decision -> evidence package`

## Processing stages

### 1. Classification

- assign category and `document_type`
- record confidence and rationale
- create a new processing run for every reclassification

### 2. Extraction

- extract structured fields
- record per-field confidence
- record missing or ambiguous fields explicitly

### 3. Control checks

- confidence thresholds
- required-field checks
- PII detection and masking
- domain triggers
- HITL trigger logic

### 4. Review decision

- auto-approve if rules permit
- escalate to HITL if configured conditions fire
- record reviewer identity, timestamp, and override reason where applicable

### 5. Evidence package

- produce append-only evidence package
- hash the package
- optionally bind to `if.trace`
- prepare for handoff to CompassAI

## Mandatory output fields

- `extraction_id`
- `schema_version`
- `source_hash`
- `document_type`
- `processing_timestamp`
- `extraction_results.fields`
- `mandatory_fields_present`
- `below_threshold_fields`
- `quality_controls`
- `audit_trail`
- `package_hash`

Recommended when applicable:

- `legal_basis`
- `purpose`
- `jurisdiction_context`
- `retention_profile`
- `if_trace_receipt`

## Control posture

| Control | Minimum spec posture |
|---|---|
| Confidence thresholds | per field and per document type |
| HITL | explicit trigger + recorded decision |
| PII masking | bounded to configured patterns only |
| RBAC | override requires reason |
| Audit logging | append-only within current Aurora scope |
| Hashing | input and package hashing both required |

## Recursive rule

A new pass creates:

- a new `processing_run`
- optionally a new `review_decision`
- optionally a new evidence package version

It does not overwrite the prior pass.

## Claim boundaries

- evidence package proves process state, not extraction correctness
- hash integrity does not prove semantic truth
- configured controls do not prove competent human review unless the review event exists
- `if.trace` is the strongest integrity claim, but null receipt remains the honest default unless configured

## Design targets that remain bounded

- near-real-time processing
- high extraction accuracy on calibrated document sets
- high evidence completeness

These remain design targets until deployment-specific baselines exist.

## Open gaps

- automatic `if.trace` binding per package is not the default
- enterprise IAM/SSO remains a roadmap gap
- multi-host or multi-region Aurora deployment is not a current claim

## Source anchors

- `docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md`
- `aurorai/memory/PRD.md`
- `aurorai/docs/infrafabric-alignment-v2.md`
- `docs/d1-r2-endpoint-mapping.md`

