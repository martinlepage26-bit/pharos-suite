"""
Pydantic models and enums for Compass AI.
"""
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from enum import Enum
import uuid


# ==================== ENUMS ====================
class UserRole(str, Enum):
    ADMIN = "admin"
    ASSESSOR = "assessor"
    VIEWER = "viewer"


class Sector(str, Enum):
    SAAS = "SaaS"
    HEALTHCARE = "Healthcare"
    EDUCATION = "Education"
    PUBLIC = "Public"
    FINANCE = "Finance"
    CONSTRUCTION = "Construction"
    OTHER = "Other"


class EngagementStatus(str, Enum):
    PROSPECT = "Prospect"
    ACTIVE = "Active"
    DELIVERED = "Delivered"
    BLOCKED = "Blocked"
    WITHDRAWN = "Withdrawn"


class DecisionRole(str, Enum):
    INFORMATIONAL = "Informational"
    ADVISORY = "Advisory"
    HITL = "Human-in-the-loop"
    AUTOMATED = "Automated"


class UserType(str, Enum):
    INTERNAL = "Internal"
    EXTERNAL = "External"
    BOTH = "Both"


class QuerySeverity(str, Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    BLOCKING = "BLOCKING"


class QueryStatus(str, Enum):
    OPEN = "Open"
    REMINDER_SENT = "ReminderSent"
    RESOLVED = "Resolved"
    ACCEPTED_RISK = "AcceptedRisk"


class AuditAction(str, Enum):
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    VIEW = "view"
    EXPORT = "export"
    LOGIN = "login"
    LOGOUT = "logout"
    APPROVE = "approve"
    REJECT = "reject"


class ScheduleFrequency(str, Enum):
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    ANNUALLY = "annually"


# ==================== AUTH MODELS ====================
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: UserRole = UserRole.VIEWER


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    role: UserRole
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    notification_email: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]


# ==================== CLIENT MODELS ====================
class Contact(BaseModel):
    name: str
    email: str
    title: Optional[str] = None


class ArtifactTaxonomy(BaseModel):
    domain: str
    control_function: str
    artifact_class: str
    subject_object: str
    lifecycle_stage: str
    evidence_status: str
    formality: str
    file_format: str


class GovernanceArtifactReference(BaseModel):
    artifact_id: str
    artifact_type: str
    title: str
    summary: str = ""
    tags: List[str] = []
    required: bool = False
    linked_control_ids: List[str] = []
    taxonomy: Optional[ArtifactTaxonomy] = None


class AssessmentCriteria(BaseModel):
    assessment_owner: Optional[str] = None
    review_window_days: int = 30
    review_frequency: Optional[str] = None
    approval_threshold: Optional[str] = None
    applicable_policy_ids: List[str] = []
    applicable_standard_refs: List[str] = []
    linked_control_ids: List[str] = []
    committee_required: bool = False
    executive_visibility_required: bool = False


class AssessmentWorkflow(BaseModel):
    current_stage: str = "intake"
    allowed_next_stages: List[str] = ["evidence_collection", "review", "approval", "monitoring"]
    approvals_required: List[str] = []
    approvals_received: List[str] = []
    committee_decision_ids: List[str] = []
    latest_decision_summary: Optional[str] = None


class SystemInventoryProfile(BaseModel):
    business_capability: Optional[str] = None
    lifecycle_stage: Optional[str] = None
    deployment_environment: Optional[str] = None
    vendor_name: Optional[str] = None
    model_provider: Optional[str] = None
    model_family: Optional[str] = None
    deployment_regions: List[str] = []
    data_classifications: List[str] = []
    user_populations: List[str] = []
    downstream_dependencies: List[str] = []
    incident_contact: Optional[str] = None
    review_frequency: Optional[str] = None


class ClientGovernanceProfile(BaseModel):
    executive_sponsor: Optional[Contact] = None
    governance_committee_ids: List[str] = []
    policy_library_status: Optional[str] = None
    training_program_status: Optional[str] = None
    incident_response_owner: Optional[str] = None


class ClientCreate(BaseModel):
    company_name: str
    sector: Sector
    primary_contact: Contact
    jurisdiction: Optional[str] = None
    governance_profile: ClientGovernanceProfile = Field(default_factory=ClientGovernanceProfile)


class Client(ClientCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== AI SYSTEM MODELS ====================
class AISystemCreate(BaseModel):
    client_id: str
    system_name: str
    system_type: str
    system_description: str
    decision_role: DecisionRole
    user_type: UserType
    high_stakes: bool = False
    intended_use: Optional[str] = None
    data_sources: Optional[List[str]] = []
    evaluation_method: Optional[str] = None
    human_override: bool = False
    inventory_profile: SystemInventoryProfile = Field(default_factory=SystemInventoryProfile)
    applicable_policy_ids: List[str] = []
    linked_control_ids: List[str] = []
    training_requirement_ids: List[str] = []


class AISystem(AISystemCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== ASSESSMENT MODELS ====================
class QueryItem(BaseModel):
    query_id: str
    display_name: str
    severity: QuerySeverity
    status: QueryStatus = QueryStatus.OPEN
    evidence_refs: List[str] = []
    doc_status: Optional[str] = None
    impl_status: Optional[str] = None


class GovernanceState(BaseModel):
    scope_locked: bool = False
    allowed_uses_defined: bool = False
    prohibited_uses_defined: bool = False


class ControlAssessment(BaseModel):
    control_id: str
    control_name: str
    category: str
    doc_status: str
    impl_status: str = "Missing"
    maturity: int
    finding: str
    evidence_refs: List[str] = []
    evidence_status: str = "Missing"
    control_library_ref: Optional[str] = None


class AssessmentResult(BaseModel):
    score: int
    readiness: str
    risk_tier: str
    category_weights: Dict[str, float]
    category_maturity: Dict[str, int]
    category_weighted_points: Dict[str, float]
    monitoring_core01: int
    monitoring_core02: int
    monitoring_composite: int
    evidence_confidence: int
    missing_elements: List[str]
    critical_flags: List[str]
    controls: List[ControlAssessment]


class AssessmentCreate(BaseModel):
    client_id: str
    ai_system_id: str
    queries: List[QueryItem] = []
    governance: GovernanceState = GovernanceState()
    strict_mode: bool = True
    criteria: AssessmentCriteria = Field(default_factory=AssessmentCriteria)
    workflow: AssessmentWorkflow = Field(default_factory=AssessmentWorkflow)
    governance_artifacts: List[GovernanceArtifactReference] = []
    training_recommendation_ids: List[str] = []


class Assessment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    ai_system_id: str
    queries: List[QueryItem] = []
    governance: GovernanceState = GovernanceState()
    strict_mode: bool = True
    criteria: AssessmentCriteria = Field(default_factory=AssessmentCriteria)
    workflow: AssessmentWorkflow = Field(default_factory=AssessmentWorkflow)
    governance_artifacts: List[GovernanceArtifactReference] = []
    training_recommendation_ids: List[str] = []
    result: Optional[AssessmentResult] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class GovernanceCommitteeDecision(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    meeting_id: str
    title: str
    decision: str
    rationale: str = ""
    owner: Optional[str] = None
    due_date: Optional[datetime] = None
    votes_for: int = 0
    votes_against: int = 0
    abstentions: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class GovernanceCommitteeMeeting(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    committee_id: str
    title: str
    scheduled_for: datetime
    agenda_items: List[str] = []
    related_assessment_ids: List[str] = []
    status: str = "scheduled"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class GovernanceCommittee(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    charter_artifact_id: Optional[str] = None
    purpose: str = ""
    responsibilities: List[str] = []
    meeting_cadence: Optional[str] = None
    chair_name: Optional[str] = None
    members: List[Contact] = []
    decision_rules: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class GovernancePolicy(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title: str
    artifact_id: Optional[str] = None
    policy_domain: str
    summary: str = ""
    tags: List[str] = []
    linked_control_ids: List[str] = []
    linked_system_ids: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TrainingModule(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title: str
    artifact_id: Optional[str] = None
    summary: str = ""
    competencies: List[str] = []
    linked_control_ids: List[str] = []
    linked_risk_tiers: List[str] = []
    recommended_for_roles: List[str] = []
    duration_minutes: Optional[int] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== DELIVERABLE MODELS ====================
class RemediationRoadmap(BaseModel):
    phases: List[Dict[str, Any]]
    priority_items: List[str]
    quick_wins: List[str]
    estimated_timeline: str


class EvidenceRequestItem(BaseModel):
    control_id: str
    control_name: str
    category: str
    evidence_types: List[str]
    priority: str
    guidance: str


class NormativeAlignment(BaseModel):
    frameworks: List[Dict[str, Any]]
    sector_specific: List[str]
    compliance_gaps: List[str]


class DeliverablePackage(BaseModel):
    assessment_id: str
    generated_at: datetime
    roadmap: RemediationRoadmap
    evidence_requests: List[EvidenceRequestItem]
    normative_alignment: NormativeAlignment
    compliance_checklist: List[Dict[str, Any]]
    summary: Dict[str, Any]


# ==================== EVIDENCE FILE MODEL ====================
class EvidenceFile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    assessment_id: str
    control_id: str
    filename: str
    original_filename: str
    content_type: str
    file_size: int
    uploaded_by: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== AUDIT LOG MODEL ====================
class AuditLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    action: AuditAction
    resource_type: str
    resource_id: Optional[str] = None
    resource_name: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== SCHEDULED ASSESSMENTS ====================
class ScheduledAssessmentCreate(BaseModel):
    client_id: str
    ai_system_id: str
    frequency: ScheduleFrequency
    template_id: Optional[str] = None
    notify_emails: List[str] = []


class ScheduledAssessment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    ai_system_id: str
    frequency: ScheduleFrequency
    next_due: datetime
    last_run: Optional[datetime] = None
    template_id: Optional[str] = None
    notify_emails: List[str] = []
    is_active: bool = True
    created_by: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== SHAREABLE REPORTS ====================
class ShareableReportCreate(BaseModel):
    assessment_id: str
    expires_in_days: int = 7
    require_signature: bool = False
    allowed_emails: List[str] = []


class ShareableReport(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    assessment_id: str
    share_token: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime
    require_signature: bool = False
    allowed_emails: List[str] = []
    signatures: List[Dict[str, Any]] = []
    view_count: int = 0


# ==================== API KEYS ====================
class APIKeyCreate(BaseModel):
    name: str
    scopes: List[str] = ["read"]
    expires_in_days: Optional[int] = 90


class APIKey(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    key_prefix: str
    key_hash: str
    scopes: List[str] = ["read"]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: Optional[datetime] = None
    last_used: Optional[datetime] = None
    is_active: bool = True


# ==================== BENCHMARK DATA ====================
class BenchmarkData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sector: str
    total_assessments: int = 0
    avg_score: float = 0.0
    median_score: float = 0.0
    percentile_25: float = 0.0
    percentile_75: float = 0.0
    percentile_90: float = 0.0
    category_averages: Dict[str, float] = {}
    risk_distribution: Dict[str, int] = {}
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BenchmarkComparison(BaseModel):
    score: float
    sector: str
    percentile: float
    category_comparison: Dict[str, Dict[str, float]]
    strengths: List[str]
    improvement_areas: List[str]
    peer_comparison: str


# ==================== ONBOARDING MODELS ====================
class OnboardingSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    sector: str
    contact_name: str
    contact_email: str
    contact_title: Optional[str] = None
    system_name: str
    system_type: str
    system_description: str
    decision_role: str
    user_type: str
    high_stakes: bool = False
    intended_use: Optional[str] = None
    data_sources: List[str] = []
    status: str = "pending"
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[str] = None
    rejection_reason: Optional[str] = None
    created_client_id: Optional[str] = None
    created_system_id: Optional[str] = None
