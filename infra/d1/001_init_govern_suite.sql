-- govern_suite D1 bootstrap
-- InfraFabric-preserving schema with recursive processing, review, and assessment state

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS artifacts (
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

CREATE TABLE IF NOT EXISTS artifact_versions (
  id TEXT PRIMARY KEY,
  artifact_id TEXT NOT NULL,
  version_no INTEGER NOT NULL,
  source_object_key TEXT NOT NULL,
  derived_text_object_key TEXT,
  sha256 TEXT NOT NULL,
  file_size_bytes INTEGER,
  page_count INTEGER,
  created_at TEXT NOT NULL,
  UNIQUE (artifact_id, version_no),
  FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS governance_cycles (
  id TEXT PRIMARY KEY,
  use_case_id TEXT,
  parent_cycle_id TEXT,
  cycle_index INTEGER NOT NULL,
  opened_by_event_id TEXT,
  open_reason TEXT NOT NULL,
  status TEXT NOT NULL,
  opened_at TEXT NOT NULL,
  closed_at TEXT,
  FOREIGN KEY (parent_cycle_id) REFERENCES governance_cycles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS processing_runs (
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
  completed_at TEXT,
  FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE,
  FOREIGN KEY (artifact_version_id) REFERENCES artifact_versions(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_run_id) REFERENCES processing_runs(id) ON DELETE SET NULL,
  FOREIGN KEY (cycle_id) REFERENCES governance_cycles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS extraction_fields (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  field_value_json TEXT,
  normalized_value TEXT,
  confidence REAL,
  is_mandatory INTEGER NOT NULL DEFAULT 0,
  below_threshold INTEGER NOT NULL DEFAULT 0,
  pii_flag INTEGER NOT NULL DEFAULT 0,
  anomaly_flag INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (run_id) REFERENCES processing_runs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS control_checks (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  check_type TEXT NOT NULL,
  status TEXT NOT NULL,
  finding_code TEXT,
  finding_detail_json TEXT,
  triggered_human_review INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (run_id) REFERENCES processing_runs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS review_decisions (
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
  created_at TEXT NOT NULL,
  FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE,
  FOREIGN KEY (run_id) REFERENCES processing_runs(id) ON DELETE SET NULL,
  FOREIGN KEY (parent_decision_id) REFERENCES review_decisions(id) ON DELETE SET NULL,
  FOREIGN KEY (cycle_id) REFERENCES governance_cycles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS evidence_packages (
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
  created_at TEXT NOT NULL,
  FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE,
  FOREIGN KEY (run_id) REFERENCES processing_runs(id) ON DELETE CASCADE,
  FOREIGN KEY (supersedes_package_id) REFERENCES evidence_packages(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS use_cases (
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

CREATE TABLE IF NOT EXISTS use_case_evidence_links (
  id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  evidence_package_id TEXT NOT NULL,
  relation_type TEXT NOT NULL DEFAULT 'primary',
  linked_at TEXT NOT NULL,
  FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE,
  FOREIGN KEY (evidence_package_id) REFERENCES evidence_packages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assessments (
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
  created_at TEXT NOT NULL,
  FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE,
  FOREIGN KEY (cycle_id) REFERENCES governance_cycles(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_assessment_id) REFERENCES assessments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS assessment_controls (
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
  control_library_ref TEXT,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feedback_actions (
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
  resolved_at TEXT,
  FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE,
  FOREIGN KEY (cycle_id) REFERENCES governance_cycles(id) ON DELETE CASCADE,
  FOREIGN KEY (source_assessment_id) REFERENCES assessments(id) ON DELETE SET NULL,
  FOREIGN KEY (target_artifact_id) REFERENCES artifacts(id) ON DELETE SET NULL,
  FOREIGN KEY (resolved_by_run_id) REFERENCES processing_runs(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS audit_events (
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
  created_at TEXT NOT NULL,
  FOREIGN KEY (cycle_id) REFERENCES governance_cycles(id) ON DELETE SET NULL,
  FOREIGN KEY (related_run_id) REFERENCES processing_runs(id) ON DELETE SET NULL,
  FOREIGN KEY (related_assessment_id) REFERENCES assessments(id) ON DELETE SET NULL,
  FOREIGN KEY (related_package_id) REFERENCES evidence_packages(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_artifact_versions_artifact ON artifact_versions(artifact_id, version_no);
CREATE INDEX IF NOT EXISTS idx_processing_runs_artifact ON processing_runs(artifact_id, started_at);
CREATE INDEX IF NOT EXISTS idx_processing_runs_cycle ON processing_runs(cycle_id, iteration_index);
CREATE INDEX IF NOT EXISTS idx_extraction_fields_run ON extraction_fields(run_id);
CREATE INDEX IF NOT EXISTS idx_control_checks_run ON control_checks(run_id);
CREATE INDEX IF NOT EXISTS idx_review_decisions_artifact ON review_decisions(artifact_id, created_at);
CREATE INDEX IF NOT EXISTS idx_review_decisions_cycle ON review_decisions(cycle_id, review_round);
CREATE INDEX IF NOT EXISTS idx_evidence_packages_use_case ON evidence_packages(use_case_id, created_at);
CREATE INDEX IF NOT EXISTS idx_use_case_evidence_links_use_case ON use_case_evidence_links(use_case_id, linked_at);
CREATE INDEX IF NOT EXISTS idx_governance_cycles_use_case ON governance_cycles(use_case_id, cycle_index);
CREATE INDEX IF NOT EXISTS idx_assessments_use_case ON assessments(use_case_id, created_at);
CREATE INDEX IF NOT EXISTS idx_assessment_controls_assessment ON assessment_controls(assessment_id);
CREATE INDEX IF NOT EXISTS idx_feedback_actions_use_case ON feedback_actions(use_case_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_events_aggregate ON audit_events(aggregate_type, aggregate_id, created_at);
