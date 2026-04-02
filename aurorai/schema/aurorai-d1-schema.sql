-- Aurora D1 intake schema
-- Source: Spec 08 — data-lineage-storage-and-recursion

-- ACTIVATED: 2026-03-29 — Module 03 build session
-- Source: Spec 08 §file-intake-table, confirmed against d1-r2-endpoint-mapping.md
-- PRODUCTION GATE: Do not apply to prod D1 until Spec 08 sign-off.
-- DEV MIGRATION: Apply via `wrangler d1 execute aurorai-dev --local --file schema/aurorai-d1-schema.sql`

CREATE TABLE IF NOT EXISTS file_intake (
  artifact_id TEXT PRIMARY KEY,
  r2_key TEXT NOT NULL,
  source_mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  source_filename TEXT NOT NULL,
  received_at TEXT NOT NULL,
  source_channel TEXT NOT NULL,
  operator_or_service_identity TEXT NOT NULL,
  document_type_hint TEXT,
  jurisdiction_context TEXT,
  legal_basis TEXT,
  purpose_of_processing TEXT,
  retention_profile TEXT,
  intake_state TEXT NOT NULL CHECK(intake_state IN ('received','ingested','quarantined','classified_ready','rejected')),
  known_unknowns TEXT NOT NULL,
  rejection_reason TEXT,
  source_hash TEXT NOT NULL
);

-- ACTIVATED: 2026-03-31 — Module 08 build session
-- Purpose: preserve first-class recursive lineage instead of flattening the Worker slice
-- into one mutable artifact record.
CREATE TABLE IF NOT EXISTS artifacts (
  artifact_id TEXT PRIMARY KEY,
  source_channel TEXT NOT NULL,
  source_filename TEXT NOT NULL,
  source_mime_type TEXT NOT NULL,
  operator_or_service_identity TEXT NOT NULL,
  document_type_hint TEXT,
  jurisdiction_context TEXT,
  legal_basis TEXT,
  purpose_of_processing TEXT,
  retention_profile TEXT,
  known_unknowns_json TEXT NOT NULL,
  source_hash TEXT NOT NULL,
  current_state TEXT NOT NULL CHECK(current_state IN (
    'ingested',
    'extracted',
    'review_required',
    'packaged',
    'handoff_failed',
    'handoff_succeeded'
  )),
  current_review_state TEXT NOT NULL CHECK(current_review_state IN ('pending','auto_approved','hitl_required')),
  latest_version_no INTEGER NOT NULL DEFAULT 1,
  latest_version_id TEXT,
  latest_run_id TEXT,
  latest_package_id TEXT,
  latest_handoff_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS artifact_versions (
  version_id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL,
  version_no INTEGER NOT NULL,
  source_object_key TEXT NOT NULL,
  source_hash TEXT NOT NULL,
  source_filename TEXT NOT NULL,
  source_mime_type TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (artifact_id, version_no)
);

CREATE TABLE IF NOT EXISTS processing_runs (
  run_id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL,
  artifact_version_id TEXT NOT NULL,
  parent_run_id TEXT,
  stage TEXT NOT NULL,
  iteration_index INTEGER NOT NULL,
  triggered_by TEXT NOT NULL,
  source_hash TEXT NOT NULL,
  document_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('completed','review_required','failed')),
  started_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS control_checks (
  check_id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  control_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('passed','failed')),
  finding_code TEXT,
  finding_detail_json TEXT,
  triggered_human_review INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS review_decisions (
  decision_id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL,
  run_id TEXT,
  parent_decision_id TEXT,
  review_round INTEGER NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  decision_type TEXT NOT NULL,
  rationale TEXT,
  resulting_state TEXT NOT NULL CHECK(resulting_state IN ('pending','auto_approved','hitl_required')),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS evidence_packages (
  package_id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  use_case_id TEXT NOT NULL,
  session_ref TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  package_hash TEXT NOT NULL,
  lineage_ref TEXT NOT NULL,
  target_system TEXT NOT NULL,
  supersedes_package_id TEXT,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS handoff_history (
  event_id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  package_id TEXT,
  use_case_id TEXT NOT NULL,
  target_system TEXT NOT NULL,
  target_endpoint TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK(event_type IN ('handoff_attempted','handoff_succeeded','handoff_failed')),
  http_status INTEGER,
  error_code TEXT,
  response_body_json TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_events (
  event_id TEXT PRIMARY KEY,
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- ACTIVATED: 2026-03-31 — Module 04 build session
-- Purpose: append-only evidence package + control outcome log for each extraction pass.
-- This remains a compatibility ledger for the existing Worker routes.
CREATE TABLE IF NOT EXISTS extraction_log (
  extraction_id TEXT PRIMARY KEY,
  processing_run_id TEXT NOT NULL,
  artifact_id TEXT NOT NULL,
  parent_run_id TEXT,
  schema_version TEXT NOT NULL,
  source_hash TEXT NOT NULL,
  document_type TEXT NOT NULL,
  processing_timestamp TEXT NOT NULL,
  extraction_results_json TEXT NOT NULL,
  evidence_package_json TEXT NOT NULL,
  mandatory_fields_present INTEGER NOT NULL,
  below_threshold_fields_json TEXT NOT NULL,
  quality_controls_json TEXT NOT NULL,
  audit_trail_json TEXT NOT NULL,
  evidence_items_json TEXT NOT NULL,
  controls_applied_json TEXT NOT NULL,
  review_decision_json TEXT NOT NULL,
  evidence_tier INTEGER NOT NULL,
  package_hash TEXT NOT NULL,
  if_trace_receipt TEXT,
  created_at TEXT NOT NULL
);

-- ACTIVATED: 2026-03-31 — Module 05 build session
-- Purpose: compatibility transport log for AurorA evidence-package delivery attempts.
CREATE TABLE IF NOT EXISTS handoff_audit_log (
  event_id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL,
  extraction_id TEXT NOT NULL,
  payload_id TEXT,
  use_case_id TEXT NOT NULL,
  target_system TEXT NOT NULL,
  target_endpoint TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK(event_type IN ('handoff_attempted','handoff_succeeded','handoff_failed')),
  http_status INTEGER,
  error_code TEXT,
  response_body_json TEXT,
  created_at TEXT NOT NULL
);
