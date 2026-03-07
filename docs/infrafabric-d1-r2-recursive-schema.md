# InfraFabric-Preserving D1 + R2 Schema

## Purpose

This note shows what a simplified Cloudflare-native storage model would look like **without collapsing the InfraFabric governance process** or widening capability claims beyond what the storage and processing layers can actually support.

The goal is not to simplify the governance.

The goal is to simplify the storage and persistence layer while keeping:

- provenance
- recursion
- review gates
- evidence lineage
- governance assessment
- auditability

It also keeps the fail-closed posture intact:

- if lineage is missing, the claim narrows
- if review evidence is incomplete, the state stays provisional
- if a package cannot be traced to a version and a run, it does not become governance evidence

## Core principle

We keep the process intact by preserving these first-class objects:

1. `Artifact`
2. `Processing Run`
3. `Review Decision`
4. `Evidence Package`
5. `Use Case`
6. `Assessment`
7. `Audit Event`

If those seven objects remain explicit, the InfraFabric logic survives the storage rewrite.

## Claim-boundary rule

Storage is not just plumbing here.

The storage layer sets the floor for what the products are allowed to claim.

That means:

- no artifact is treated as review-ready without a versioned source
- no extraction is treated as authoritative without a recorded run
- no evidence package is treated as current without append-only lineage
- no governance outcome is treated as complete if the audit trail cannot show how it was reached

## Storage split

### D1

Use `D1` for:

- structured records
- links between records
- status and gate state
- audit events
- version lineage
- recursive loop state

### R2

Use `R2` for:

- original uploaded files
- derived text files
- JSON evidence package snapshots
- generated deliverables
- ZIP bundles

## Why this split is necessary

`D1` is good for metadata and workflow state.

`R2` is where the heavy objects belong.

This split also preserves evidentiary honesty.

`D1` carries the states, links, and gates that let us say what is true right now.

`R2` carries the heavy objects those claims depend on.

Do not try to store:

- PDFs
- large JSON evidence blobs
- ZIP bundles
- extracted text corpora

directly inside `D1`.

## Recommended D1 database

Use a single database at first:

- `govern_suite`

This keeps relationships simple while the system is still small, but it does not loosen the recursive lineage model.

## Recommended R2 buckets

Use two buckets:

- `govern-artifacts`
- `govern-evidence`

Suggested object keys:

- `artifacts/{artifact_id}/v{version}/source.{ext}`
- `artifacts/{artifact_id}/v{version}/text.txt`
- `evidence/{use_case_id}/{package_id}.json`
- `deliverables/{use_case_id}/{assessment_id}/{filename}`

## Canonical D1 schema

### 1. artifacts

One logical source artifact.

```sql
CREATE TABLE artifacts (
  id TEXT PRIMARY KEY,
  client_id TEXT,
  source_kind TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT,
  category TEXT,
  document_type TEXT,
  latest_version_no INTEGER NOT NULL DEFAULT 1,
  current_state TEXT NOT NULL DEFAULT 'ingested',
  current_review_state TEXT NOT NULL DEFAULT 'pending',
  latest_run_id TEXT,
  latest_package_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### 2. artifact_versions

Versioned source and derivative file references.

```sql
CREATE TABLE artifact_versions (
  id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL,
  version_no INTEGER NOT NULL,
  source_object_key TEXT NOT NULL,
  derived_text_object_key TEXT,
  sha256 TEXT NOT NULL,
  file_size_bytes INTEGER,
  page_count INTEGER,
  created_at TEXT NOT NULL,
  UNIQUE (artifact_id, version_no)
);
```

### 3. processing_runs

This is the first major recursion table.

Every extract, re-extract, validation pass, or package pass gets a row.

```sql
CREATE TABLE processing_runs (
  id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL,
  artifact_version_id TEXT NOT NULL,
  parent_run_id TEXT,
  cycle_id TEXT,
  stage TEXT NOT NULL,
  iteration_index INTEGER NOT NULL DEFAULT 1,
  triggered_by TEXT NOT NULL,
  trigger_event_id TEXT,
  model_name TEXT,
  model_version TEXT,
  status TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT
);
```

`parent_run_id` is what preserves re-entry instead of flattening each run into one terminal state.

### 4. extraction_fields

Normalized field-level output from a run.

```sql
CREATE TABLE extraction_fields (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  field_value_json TEXT,
  normalized_value TEXT,
  confidence REAL,
  is_mandatory INTEGER NOT NULL DEFAULT 0,
  below_threshold INTEGER NOT NULL DEFAULT 0,
  pii_flag INTEGER NOT NULL DEFAULT 0,
  anomaly_flag INTEGER NOT NULL DEFAULT 0
);
```

### 5. control_checks

One row per gate or control check outcome.

```sql
CREATE TABLE control_checks (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  check_type TEXT NOT NULL,
  status TEXT NOT NULL,
  finding_code TEXT,
  finding_detail_json TEXT,
  triggered_human_review INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
```

### 6. review_decisions

This is the second major recursion table.

It records every accept, reject, escalate, reopen, or reprocess decision.

```sql
CREATE TABLE review_decisions (
  id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL,
  run_id TEXT,
  parent_decision_id TEXT,
  cycle_id TEXT,
  review_round INTEGER NOT NULL DEFAULT 1,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  decision_type TEXT NOT NULL,
  rationale TEXT,
  resulting_state TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

### 7. evidence_packages

Append-only evidence envelopes.

Keep the heavy JSON snapshot in `R2`.

```sql
CREATE TABLE evidence_packages (
  id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  use_case_id TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  producer TEXT NOT NULL,
  artifact_type TEXT NOT NULL,
  payload_object_key TEXT NOT NULL,
  package_hash TEXT NOT NULL,
  supersedes_package_id TEXT,
  created_at TEXT NOT NULL
);
```

### 8. use_cases

Canonical governance registry row.

```sql
CREATE TABLE use_cases (
  id TEXT PRIMARY KEY,
  client_id TEXT,
  name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  business_owner TEXT NOT NULL,
  business_owner_confirmed INTEGER NOT NULL DEFAULT 0,
  systems_involved_json TEXT NOT NULL,
  data_categories_json TEXT NOT NULL,
  automation_level TEXT NOT NULL,
  decision_impact TEXT,
  regulated_domain INTEGER NOT NULL DEFAULT 0,
  regulated_domain_notes TEXT,
  scale TEXT,
  known_unknowns_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'intake_complete',
  current_gate TEXT NOT NULL DEFAULT 'intake_complete',
  latest_risk_tier TEXT,
  latest_assessment_id TEXT,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### 9. use_case_evidence_links

Separate the evidence object from the use-case linkage.

```sql
CREATE TABLE use_case_evidence_links (
  id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  evidence_package_id TEXT NOT NULL,
  relation_type TEXT NOT NULL DEFAULT 'primary',
  linked_at TEXT NOT NULL
);
```

### 10. governance_cycles

This is the main InfraFabric recursion anchor.

Every reopened loop gets a new cycle row linked to the parent.

```sql
CREATE TABLE governance_cycles (
  id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  parent_cycle_id TEXT,
  cycle_index INTEGER NOT NULL,
  opened_by_event_id TEXT,
  open_reason TEXT NOT NULL,
  status TEXT NOT NULL,
  opened_at TEXT NOT NULL,
  closed_at TEXT
);
```

### 11. assessments

Versioned, append-only governance assessments.

```sql
CREATE TABLE assessments (
  id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  cycle_id TEXT NOT NULL,
  parent_assessment_id TEXT,
  trigger_type TEXT NOT NULL,
  risk_tier TEXT NOT NULL,
  dimension_scores_json TEXT NOT NULL,
  dimension_rationale_json TEXT NOT NULL,
  uncertainty_fields_json TEXT NOT NULL,
  required_controls_json TEXT NOT NULL,
  required_deliverables_json TEXT NOT NULL,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  gate_status_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

### 12. assessment_controls

Control-level results stay explicit.

```sql
CREATE TABLE assessment_controls (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL,
  control_id TEXT NOT NULL,
  control_name TEXT NOT NULL,
  category TEXT NOT NULL,
  doc_status TEXT NOT NULL,
  impl_status TEXT NOT NULL,
  maturity INTEGER NOT NULL,
  finding TEXT,
  evidence_refs_json TEXT NOT NULL,
  evidence_status TEXT,
  control_library_ref TEXT
);
```

### 13. feedback_actions

This preserves the recursive governance-to-execution loop.

If an assessment triggers more extraction, more evidence, or more human review, it gets recorded here.

```sql
CREATE TABLE feedback_actions (
  id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  cycle_id TEXT NOT NULL,
  source_assessment_id TEXT,
  target_artifact_id TEXT,
  action_type TEXT NOT NULL,
  requested_state TEXT NOT NULL,
  rationale TEXT,
  status TEXT NOT NULL,
  resolved_by_run_id TEXT,
  resolved_at TEXT
);
```

### 14. audit_events

Append-only event log across the whole system.

```sql
CREATE TABLE audit_events (
  id TEXT PRIMARY KEY,
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  cycle_id TEXT,
  related_run_id TEXT,
  related_assessment_id TEXT,
  related_package_id TEXT,
  event_payload_json TEXT,
  created_at TEXT NOT NULL
);
```

## What recursion looks like in this model

### Example

#### Cycle 1

1. A PDF is uploaded as `artifact A1`
2. Version `A1-v1` is written to `R2`
3. `processing_run R1` performs extraction
4. `control_check C1` flags a low-confidence invoice total
5. `review_decision D1` says `reprocess`
6. `feedback_action F1` requests another extraction pass

#### Cycle 1, recursive pass

7. `processing_run R2` is created with:
   - `parent_run_id = R1`
   - `cycle_id = cycle-1`
   - `iteration_index = 2`
8. A reviewer validates the missing field
9. `review_decision D2` says `accepted`
10. `evidence_package P1` is created

#### Governance phase

11. `P1` is linked to `use_case U1`
12. `assessment S1` assigns risk tier `T2`
13. `assessment_controls` are generated
14. `feedback_action F2` requests one more supporting artifact

#### Cycle 2

15. `governance_cycle cycle-2` opens with:
   - `parent_cycle_id = cycle-1`
   - `open_reason = additional_evidence_requested`
16. A second artifact `A2` is uploaded
17. New extraction and review runs occur
18. `assessment S2` is created with:
   - `parent_assessment_id = S1`
   - `cycle_id = cycle-2`

This is the recursion process preserved explicitly.

Nothing gets flattened into "latest state only."

## Mapping from current AurorAI records

### Current `Document`

Source:

- [server.py](/home/cerebrhoe/repos/AurorAI/server.py#L75)

Mapping:

- `Document.id` -> `artifacts.id`
- `filename`, `original_filename` -> `artifacts` + `artifact_versions`
- `category`, `document_type` -> `artifacts`
- `file_size`, `page_count`, `source_hash` -> `artifact_versions`
- `text_preview` -> optional small preview field or generated text object in `R2`
- `summary` -> optional derived artifact in `R2` plus summary metadata row
- `extraction` -> `processing_runs` + `extraction_fields`
- `control_checks` -> `control_checks`
- `review_required` -> latest `review_decisions` / `feedback_actions`
- `audit_log` -> `audit_events`

### Current `ReadingList`

Source:

- [server.py](/home/cerebrhoe/repos/AurorAI/server.py#L114)

Mapping:

- either keep as:
  - `collections`
  - `collection_items`
- or defer if it is not core to the governance path

### Current evidence package generation

Source:

- [server.py](/home/cerebrhoe/repos/AurorAI/server.py#L1118)
- [server.py](/home/cerebrhoe/repos/AurorAI/server.py#L1130)

Mapping:

- payload snapshot -> `R2`
- metadata -> `evidence_packages`
- handoff log -> `audit_events`

## Mapping from current CompassAI records

### Current `UseCaseRecord`

Source:

- [server.py](/home/cerebrhoe/repos/CompassAI/backend/server.py#L367)
- [server.py](/home/cerebrhoe/repos/CompassAI/backend/server.py#L1682)

Mapping:

- nearly direct into `use_cases`

### Current use-case evidence

Source:

- [server.py](/home/cerebrhoe/repos/CompassAI/backend/server.py#L1749)

Mapping:

- `payload` large body -> `R2`
- `hash`, `schema_version`, `producer`, `artifact_type`, `version` -> `evidence_packages`
- use case relation -> `use_case_evidence_links`

### Current assessments

Source:

- [server.py](/home/cerebrhoe/repos/CompassAI/backend/server.py#L1841)

Mapping:

- top-level result -> `assessments`
- required controls and findings -> `assessment_controls`
- gate state -> `assessments.gate_status_json` and denormalized `use_cases.current_gate`

### Current audit trail

Source:

- [server.py](/home/cerebrhoe/repos/CompassAI/backend/server.py#L1918)

Mapping:

- direct into `audit_events`

## What must not be simplified away

If we want to stay faithful to the current InfraFabric posture, do **not** remove:

- parent-child linkage between runs
- parent-child linkage between assessments
- explicit cycle rows
- evidence package versioning
- append-only audit events
- feedback actions that reopen work
- hash-based artifact integrity

Those are the parts that preserve recursion, not just storage.

## What can be simplified safely

- Mongo collections -> D1 tables
- nested payloads -> JSON columns plus normalized supporting tables
- local file writes -> R2 object keys
- duplicate "latest" state fields -> denormalized convenience fields on `artifacts` and `use_cases`

## Minimal migration order

1. Keep current Python logic
2. Define this schema as the target contract
3. Move files to `R2`
4. Mirror metadata into `D1`
5. Replace Mongo writes one bounded object family at a time:
   - `AurorAI artifacts`
   - `evidence packages`
   - `CompassAI use cases`
   - `assessments`
   - `audit events`

## Plain-language read

What this would feel like:

- AurorAI still ingests and extracts
- CompassAI still assesses and derives controls
- Govern AI still remains the shell
- the recursive loop still exists
- the difference is that files live in `R2` and the state graph lives in `D1`

That keeps the method intact while simplifying the plumbing.
