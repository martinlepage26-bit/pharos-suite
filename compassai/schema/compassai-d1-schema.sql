-- COMPASSai D1 Schema
-- Source: Spec 05 — cross-system-evidence-handoff
-- ACTIVATED: 2026-03-31 — bounded Module 05/06/07 worker governance ledger
-- This remains a bounded Worker migration slice and not the full hosted backend schema.

CREATE TABLE IF NOT EXISTS evidence_packages (
  payload_id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  package_hash TEXT NOT NULL,
  source_system TEXT NOT NULL,
  target_system TEXT NOT NULL,
  session_ref TEXT NOT NULL,
  processing_run_id TEXT NOT NULL,
  lineage_ref TEXT NOT NULL,
  artifact_id TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  source_mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  received_at TEXT NOT NULL,
  source_filename TEXT NOT NULL,
  source_hash TEXT NOT NULL,
  document_type TEXT NOT NULL,
  evidence_tier INTEGER NOT NULL,
  admissible INTEGER NOT NULL,
  review_status TEXT NOT NULL,
  review_reason TEXT,
  acceptance_state TEXT NOT NULL CHECK(acceptance_state IN ('accepted_for_governance','rejected_for_governance')),
  rejection_reason TEXT,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  accepted_at TEXT
);

CREATE TABLE IF NOT EXISTS use_case_evidence_links (
  link_id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  evidence_package_id TEXT NOT NULL,
  relation_type TEXT NOT NULL,
  linked_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS use_cases (
  use_case_id TEXT PRIMARY KEY,
  client_id TEXT,
  ai_system_id TEXT,
  name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  business_owner TEXT NOT NULL,
  business_owner_confirmed INTEGER NOT NULL,
  systems_involved_json TEXT NOT NULL,
  data_categories_json TEXT NOT NULL,
  automation_level TEXT NOT NULL,
  decision_impact TEXT,
  regulated_domain INTEGER NOT NULL,
  regulated_domain_notes TEXT,
  scale TEXT NOT NULL,
  known_unknowns_json TEXT NOT NULL,
  status TEXT NOT NULL,
  current_gate TEXT NOT NULL,
  gates_json TEXT NOT NULL,
  gate_reasons_json TEXT NOT NULL,
  current_cycle_id TEXT,
  cycle_index INTEGER NOT NULL,
  latest_risk_tier TEXT,
  latest_assessment_id TEXT,
  evidence_count INTEGER NOT NULL,
  feedback_action_count INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS governance_cycles (
  cycle_id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  parent_cycle_id TEXT,
  cycle_index INTEGER NOT NULL,
  open_reason TEXT NOT NULL,
  status TEXT NOT NULL,
  opened_at TEXT NOT NULL,
  closed_at TEXT
);

CREATE TABLE IF NOT EXISTS use_case_assessments (
  assessment_id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  cycle_id TEXT NOT NULL,
  parent_assessment_id TEXT,
  trigger_type TEXT NOT NULL,
  risk_tier TEXT NOT NULL,
  dimension_scores_json TEXT NOT NULL,
  dimension_rationale_json TEXT NOT NULL,
  uncertainty_fields_json TEXT NOT NULL,
  evidence_count INTEGER NOT NULL,
  gate_status_json TEXT NOT NULL,
  gate_reasons_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS assessment_controls (
  row_id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL,
  control_type TEXT NOT NULL CHECK(control_type IN ('required_control','required_deliverable')),
  control_ref TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback_actions (
  action_id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  cycle_id TEXT NOT NULL,
  source_assessment_id TEXT,
  action_type TEXT NOT NULL,
  requested_state TEXT NOT NULL,
  rationale TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS deliverables (
  deliverable_id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  assessment_id TEXT NOT NULL,
  cycle_id TEXT NOT NULL,
  deliverable_type TEXT NOT NULL,
  template_id TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('draft','pending_approval','approved','rejected','superseded')),
  content_hash TEXT NOT NULL,
  content_json TEXT NOT NULL,
  evidence_citations_json TEXT NOT NULL,
  manual_notes_json TEXT NOT NULL,
  generated_from_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  approved_at TEXT
);

CREATE TABLE IF NOT EXISTS approval_requests (
  request_id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  assessment_id TEXT NOT NULL,
  cycle_id TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  approval_record_deliverable_id TEXT NOT NULL,
  requested_state TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  requested_by_role TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected','overridden')),
  required_roles_json TEXT NOT NULL,
  approvals_received_json TEXT NOT NULL,
  unmet_conditions_json TEXT NOT NULL,
  latest_decision_summary TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  resolved_at TEXT
);

CREATE TABLE IF NOT EXISTS approval_decisions (
  decision_id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL,
  use_case_id TEXT NOT NULL,
  assessment_id TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  decision TEXT NOT NULL CHECK(decision IN ('approved','rejected','override_approved')),
  notes TEXT,
  override_reason TEXT,
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
