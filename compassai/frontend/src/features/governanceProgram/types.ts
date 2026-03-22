export interface ArtifactTaxonomy {
  domain: string;
  control_function: string;
  artifact_class: string;
  subject_object: string;
  lifecycle_stage: string;
  evidence_status: string;
  formality: string;
  file_format: string;
}

export interface GovernanceArtifactReference {
  artifact_id: string;
  artifact_type: string;
  title: string;
  summary?: string;
  tags?: string[];
  required?: boolean;
  linked_control_ids?: string[];
  taxonomy?: ArtifactTaxonomy | null;
}

export interface GovernanceArtifactRecord extends GovernanceArtifactReference {
  id: string;
  slug: string;
  filename: string;
  policy_domain?: string | null;
  competencies?: string[];
  content_markdown?: string;
  content_hash?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GovernancePolicy {
  id: string;
  slug: string;
  title: string;
  artifact_id?: string | null;
  policy_domain: string;
  summary?: string;
  tags?: string[];
  linked_control_ids?: string[];
  linked_system_ids?: string[];
}

export interface TrainingModule {
  id: string;
  slug: string;
  title: string;
  artifact_id?: string | null;
  summary?: string;
  competencies?: string[];
  linked_control_ids?: string[];
  linked_risk_tiers?: string[];
  recommended_for_roles?: string[];
  duration_minutes?: number | null;
}

export interface AssessmentCriteria {
  assessment_owner?: string | null;
  review_window_days: number;
  review_frequency?: string | null;
  approval_threshold?: string | null;
  applicable_policy_ids: string[];
  applicable_standard_refs: string[];
  linked_control_ids: string[];
  committee_required: boolean;
  executive_visibility_required: boolean;
}

export interface AssessmentWorkflow {
  current_stage: string;
  allowed_next_stages: string[];
  approvals_required: string[];
  approvals_received: string[];
  committee_decision_ids: string[];
  latest_decision_summary?: string | null;
}

export interface AssessmentGovernanceContext {
  assessment_id: string;
  criteria: AssessmentCriteria;
  workflow: AssessmentWorkflow;
  governance_artifacts: GovernanceArtifactReference[];
  training_recommendation_ids: string[];
  artifact_attachments?: GovernanceArtifactRecord[];
}

export interface Contact {
  name: string;
  email: string;
  title?: string | null;
}

export interface GovernanceCommittee {
  id: string;
  name: string;
  charter_artifact_id?: string | null;
  purpose?: string;
  responsibilities?: string[];
  meeting_cadence?: string | null;
  chair_name?: string | null;
  members?: Contact[];
  decision_rules?: string[];
}

export interface GovernanceCommitteeMeeting {
  id: string;
  committee_id: string;
  title: string;
  scheduled_for: string;
  agenda_items: string[];
  related_assessment_ids: string[];
  status: string;
}

export interface GovernanceCommitteeDecision {
  id: string;
  meeting_id: string;
  title: string;
  decision: string;
  rationale?: string;
  owner?: string | null;
  due_date?: string | null;
  votes_for?: number;
  votes_against?: number;
  abstentions?: number;
}

export interface ExecutiveDashboardSummary {
  total_assessments: number;
  governance_committees: number;
  policies: number;
  training_modules: number;
  average_evidence_confidence: number;
  training_links_generated: number;
}

export interface ExecutiveDashboardData {
  summary: ExecutiveDashboardSummary;
  risk_distribution: Record<string, number>;
  readiness_distribution: Record<string, number>;
}

export interface SystemInventoryProfile {
  business_capability?: string;
  lifecycle_stage?: string;
  deployment_environment?: string;
  vendor_name?: string;
  model_provider?: string;
  model_family?: string;
  deployment_regions?: string[];
  data_classifications?: string[];
  user_populations?: string[];
  downstream_dependencies?: string[];
  incident_contact?: string;
  review_frequency?: string;
}

export interface AISystemCreatePayload {
  client_id: string;
  system_name: string;
  system_type: string;
  system_description: string;
  decision_role: string;
  user_type: string;
  high_stakes: boolean;
  intended_use?: string;
  data_sources?: string[];
  evaluation_method?: string;
  human_override: boolean;
  inventory_profile: SystemInventoryProfile;
  applicable_policy_ids: string[];
  linked_control_ids: string[];
  training_requirement_ids: string[];
}
