# D1 + R2 Endpoint Mapping

## Purpose

This note maps the current `AurorAI` and `CompassAI` backend surfaces onto the simplified `D1 + R2` storage model.

It also keeps one rule explicit: no endpoint should claim a stronger governance state than the persisted evidence can actually support.

It is a migration guide, not a rewrite spec.

## Migration rule

Keep current behavior first.

Change persistence second.

That means:

1. keep endpoint contracts stable where possible
2. replace Mongo and local-disk persistence behind the endpoints
3. preserve recursive state and audit history explicitly
4. if lineage or evidence is missing, downgrade the exposed status rather than synthesize completeness

---

# Part 1: AurorAI mapping

## `POST /api/documents/upload`

Source:

- [server.py](/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/aurorai/server.py#L838)

### Current behavior

- accepts file upload
- writes file to local `uploads`
- extracts basic text preview
- creates a Mongo `Document`

### D1 + R2 target

#### Write to `R2`

- original file -> `govern-artifacts/artifacts/{artifact_id}/v1/source.{ext}`
- derived text -> `govern-artifacts/artifacts/{artifact_id}/v1/text.txt`

#### Write to `D1`

- `artifacts`
- `artifact_versions`
- `audit_events`

#### Minimal record writes

1. insert `artifacts`
2. insert `artifact_versions`
3. insert `audit_events` with `event_type = artifact_uploaded`

### Resulting state

- `artifacts.current_state = ingested`
- `artifacts.current_review_state = pending`

### Claim-boundary rule

If upload succeeds but text extraction or metadata enrichment is incomplete, the artifact still remains `ingested`.

It does not become review-ready by implication.

---

## `POST /api/documents/{doc_id}/categorize`

### Current behavior

- categorizes document
- sets confidence and rationale
- writes to Mongo document

### D1 + R2 target

#### Write to `D1`

1. create `processing_runs` row:
   - `stage = classification`
   - `iteration_index = next iteration`
2. create `extraction_fields` rows if needed for classification signals
3. create `control_checks` if category or confidence triggers review
4. insert `audit_events` for classification completion
5. update `artifacts.category`, `artifacts.document_type`, `artifacts.latest_run_id`

### Recursive rule

If categorization is rerun:

- create a new `processing_runs` row
- set `parent_run_id` to the prior classification run

If the confidence does not support a stable category, keep the category provisional and let the review state carry that uncertainty forward.

---

## `POST /api/documents/{doc_id}/extract`

### Current behavior

- runs extraction
- stores field map inside `Document.extraction`
- computes control checks

### D1 + R2 target

#### Write to `D1`

1. `processing_runs`
   - `stage = extraction`
2. one `extraction_fields` row per extracted field
3. one `control_checks` row per gate result
4. optional `review_decisions` row if extraction is auto-accepted or escalated
5. `audit_events` entry for extraction completion

#### Optional `R2`

- if we want a full extraction JSON snapshot, write:
  - `govern-artifacts/artifacts/{artifact_id}/v{n}/extraction.json`

### Recursive rule

Every re-extraction is a fresh `processing_runs` row, never an overwrite.

If required fields are missing or below threshold, the run can still complete, but the artifact should remain in a review-gated state rather than present itself as fully resolved.

---

## `POST /api/documents/{doc_id}/summary`

### D1 + R2 target

Prefer:

- summary file in `R2`
- summary metadata in `audit_events`

If summary becomes first-class:

- add a later `derived_artifacts` table

For now it can stay a derived artifact rather than a top-level relational object.

---

## `POST /api/documents/{doc_id}/citations`

### D1 + R2 target

Two acceptable options:

1. store citation list as `R2` JSON + audit event
2. add a later `citations` table if citation review becomes core to governance evidence

For the first migration, option `1` is simpler.

---

## `POST /api/documents/{doc_id}/evidence-package`

Source:

- [server.py](/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/aurorai/server.py#L1118)

### Current behavior

- assembles evidence package
- writes record to Mongo

### D1 + R2 target

#### Write to `R2`

- `govern-evidence/evidence/{use_case_id}/{package_id}.json`

#### Write to `D1`

1. `evidence_packages`
2. `audit_events`
3. update `artifacts.latest_package_id`

### Important rule

Evidence packages stay append-only.

If a package is regenerated:

- create a new row
- set `supersedes_package_id`

Do not overwrite package history.

Package creation also does not imply governance acceptance.

It only means a versioned evidence envelope now exists.

---

## `POST /api/documents/{doc_id}/handoff-to-compassai`

Source:

- [server.py](/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/aurorai/server.py#L1130)

### Current behavior

- generates package
- posts to CompassAI
- logs handoff in Mongo

### D1 + R2 target

#### Write to `D1`

1. `evidence_packages`
2. `use_case_evidence_links`
3. `audit_events` with `event_type = evidence_handoff_attempted`
4. `audit_events` with `event_type = evidence_handoff_succeeded` or `failed`

### Recursive rule

If handoff fails and is retried:

- new audit event
- optional new package only if payload changed

Handoff success means the package reached CompassAI.

It does not mean the package has cleared governance review.

---

# Part 2: CompassAI mapping

## `POST /api/v1/use-cases`

Source:

- [server.py](/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/compassai/backend/server.py#L1682)

### Current behavior

- creates canonical use-case record
- logs intake completion

### D1 + R2 target

#### Write to `D1`

1. `use_cases`
2. `governance_cycles`
   - `cycle_index = 1`
   - `open_reason = intake_complete`
3. `audit_events`

### Resulting state

- `status = intake_complete`
- `current_gate = intake_complete`

That is an intake state, not a governance approval state.

---

## `GET /api/v1/use-cases`

### D1 target

Read from:

- `use_cases`

No process change needed.

---

## `GET /api/v1/use-cases/{usecase_id}`

### D1 target

Read from:

- `use_cases`

Optional later enhancement:

- join latest assessment summary

---

## `POST /api/v1/evidence`

Source:

- [server.py](/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/compassai/backend/server.py#L1749)

### Current behavior

- verifies hash
- inserts append-only evidence document
- updates use-case evidence count
- writes audit trail

### D1 + R2 target

#### Read from `R2`

- evidence package JSON if payload arrives as object key reference

#### Write to `D1`

1. `evidence_packages`
2. `use_case_evidence_links`
3. update `use_cases.evidence_count`
4. `audit_events`

### Important rule

Hash verification remains mandatory.

That is part of the governance method, not just a convenience check.

If the hash cannot be verified, the evidence does not get promoted into the governance record.

---

## `GET /api/v1/evidence/use-case/{usecase_id}`

### D1 target

Read from:

- `use_case_evidence_links`
- `evidence_packages`

If clients need the heavy JSON body:

- fetch from `R2` by `payload_object_key`

---

## `POST /api/v1/use-cases/{usecase_id}/assess`

Source:

- [server.py](/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/compassai/backend/server.py#L1841)

### Current behavior

- computes risk tier
- derives controls
- derives deliverables
- creates assessment
- updates use case state
- logs audit

### D1 + R2 target

#### Write to `D1`

1. read current `use_cases`
2. read linked evidence package metadata
3. insert `assessments`
4. insert `assessment_controls`
5. update `use_cases.latest_risk_tier`
6. update `use_cases.latest_assessment_id`
7. update `use_cases.current_gate`
8. insert `audit_events`

### Recursive rule

If the use case is reassessed:

1. create a new `assessments` row
2. set `parent_assessment_id`
3. if reassessment was triggered by new evidence or failure:
   - open a new `governance_cycles` row

This is the governance recursion preserved.

It also preserves the claim boundary.

Each new assessment has to be traceable to the evidence set and cycle that produced it.

---

## `GET /api/v1/use-cases/{usecase_id}/audit-trail`

Source:

- [server.py](/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/compassai/backend/server.py#L1918)

### D1 target

Read from:

- `audit_events`

Optionally filtered by:

- `aggregate_id = usecase_id`
- or related run / package / assessment

---

# Part 3: Recursive process preservation

## The rule we do not break

We never collapse the process into one mutable record.

We always preserve:

- the run that produced a field
- the check that triggered a review
- the decision that reopened the work
- the package that was sent forward
- the assessment that sent feedback back

## The recursive loop in storage terms

1. `processing_runs`
2. `control_checks`
3. `review_decisions`
4. `evidence_packages`
5. `assessments`
6. `feedback_actions`
7. new `processing_runs` or new `governance_cycles`

That is the InfraFabric recursion made concrete in `D1`.

---

# Part 4: Suggested first migration order

## First

Move AurorAI file storage to `R2`

Why:

- easiest high-value simplification
- removes local upload dependency first

## Second

Move evidence package storage to:

- `R2` for payload
- `D1` for metadata

## Third

Move CompassAI use-case and assessment records to `D1`

## Fourth

Move audit events and feedback actions to `D1`

## Fifth

Retire Mongo once reads and writes have both been switched

---

# Plain read

What this would feel like in practice:

- AurorAI still processes documents
- CompassAI still assesses governance
- Pharos Suite still presents the work
- but the system stores files in `R2`, state in `D1`, and recursion in explicit linked rows
- and if a state cannot be supported by those linked rows, the product stays narrow in what it claims

That keeps the method while making the storage model much easier to reason about.
