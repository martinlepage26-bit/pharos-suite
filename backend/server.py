from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from enum import Enum
import base64
from io import BytesIO
from passlib.context import CryptContext
from jose import JWTError, jwt
import resend

ROOT_DIR = Path(__file__).parent
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Auth configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'agatha-governance-secret-key-2026')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

# Email configuration
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

app = FastAPI(title="Compass AI Governance Engine")
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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

# ==================== MODELS ====================

# Auth Models
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
    notification_email: Optional[str] = None  # For evidence upload notifications

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class Contact(BaseModel):
    name: str
    email: str
    title: Optional[str] = None

class ClientCreate(BaseModel):
    company_name: str
    sector: Sector
    primary_contact: Contact
    jurisdiction: Optional[str] = None

class Client(ClientCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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

class AISystem(AISystemCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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

# ==================== DELIVERABLE MODELS ====================
class RemediationRoadmap(BaseModel):
    immediate_actions: List[str] = []  # 0-30 days
    short_term_actions: List[str] = []  # 30-90 days
    medium_term_actions: List[str] = []  # 90-180 days
    structural_recommendations: List[str] = []
    executive_escalations: List[str] = []

class EvidenceRequestItem(BaseModel):
    control_id: str
    control_name: str
    category: str
    severity: str
    required_artifacts: List[str]
    guidance: str

class NormativeAlignment(BaseModel):
    iso_42001: bool = False
    eu_ai_act_lifecycle: bool = False
    nist_ai_rmf: bool = False
    canada_aida: bool = False

class DeliverablePackage(BaseModel):
    assessment_id: str
    client_name: str
    system_name: str
    sector: str
    generated_at: datetime
    gov_report_summary: Dict[str, Any]
    evidence_requests: List[EvidenceRequestItem]
    roadmap: RemediationRoadmap
    normative_alignment: NormativeAlignment
    sector_specific_guidance: List[str]
    compliance_checklist: List[Dict[str, Any]]

# ==================== EVIDENCE FILE MODEL ====================
class EvidenceFile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    assessment_id: str
    control_id: str
    filename: str
    content_type: str
    file_size: int
    description: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    uploaded_by: Optional[str] = None

# ==================== AUDIT LOG MODEL ====================
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

class AuditLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    action: AuditAction
    resource_type: str  # client, assessment, ai_system, etc.
    resource_id: Optional[str] = None
    resource_name: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== SCHEDULED ASSESSMENTS ====================
class ScheduleFrequency(str, Enum):
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    ANNUALLY = "annually"

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
class ShareableReport(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    assessment_id: str
    share_token: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: Optional[str] = None
    expires_at: Optional[datetime] = None
    requires_signature: bool = False
    signature_name: Optional[str] = None
    signature_email: Optional[str] = None
    signed_at: Optional[datetime] = None
    view_count: int = 0
    created_by: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== API KEYS ====================
class APIKey(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    key_prefix: str  # First 8 chars for display
    key_hash: str  # Hashed full key
    scopes: List[str] = ["read"]  # read, write, admin
    is_active: bool = True
    last_used: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
    category_comparison: Dict[str, Dict[str, float]]  # category -> {user_score, avg, percentile}
    strengths: List[str]
    improvement_areas: List[str]
    peer_comparison: str  # "Top 15% in Healthcare"

class Assessment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    ai_system_id: str
    queries: List[QueryItem] = []
    governance: GovernanceState = GovernanceState()
    strict_mode: bool = True
    result: Optional[AssessmentResult] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== GOVERNANCE ENGINE ====================

# Status to points mapping
def status_to_points(status: str) -> int:
    s = (status or "").strip().lower()
    if s in {"n/a", "na", "verified"}:
        return 100
    if s == "missing":
        return 0
    if s == "partial":
        return 20
    if s in {"documented", "observed", "provided"}:
        return 40
    return 0

DOC_STATUS_TO_MATURITY = {"Missing": 0, "Documented": 100, "Partial": 60, "NA": 0}
DOC_STATUS_TO_CONFIDENCE = {"Missing": 0.0, "Partial": 0.5, "Documented": 1.0, "NA": 0.0}
IMPL_STATUS_TO_MATURITY = {"Missing": 0, "Partial": 60, "Observed": 100, "NA": 0}

BASELINE_WEIGHTS = {
    "scope": 0.08, "data": 0.18, "evaluation": 0.15, "oversight": 0.14,
    "monitoring": 0.18, "change": 0.15, "resilience": 0.06, "lifecycle": 0.06
}

SECTOR_WEIGHT_DELTAS = {
    "saas": {"monitoring": +0.05, "change": +0.05, "oversight": -0.05, "scope": -0.05},
    "healthcare": {"evaluation": +0.10, "data": +0.05, "oversight": +0.05, "monitoring": -0.10, "change": -0.05, "scope": -0.05},
    "public": {"scope": +0.05, "oversight": +0.05, "data": +0.05, "monitoring": -0.05, "evaluation": -0.05, "change": -0.05},
    "finance": {"data": +0.05, "monitoring": +0.05, "change": +0.05, "scope": -0.05, "evaluation": -0.05, "oversight": -0.05},
    "construction": {"monitoring": +0.08, "resilience": +0.06, "data": +0.04, "oversight": +0.02, "scope": -0.05, "evaluation": -0.05, "lifecycle": -0.05, "change": -0.05},
}

def normalize_sector(sector: str) -> str:
    return (sector or "").strip().lower().replace("-", "_").replace(" ", "_")

def normalize_doc_status(value: str) -> str:
    v = (value or "").strip()
    return v if v in ("Documented", "Partial", "Missing", "NA") else "Missing"

def normalize_impl_status(value: str) -> str:
    v = (value or "").strip()
    return v if v in ("Observed", "Partial", "Missing", "NA") else "Missing"

def doc_score(doc_status: str) -> int:
    return int(DOC_STATUS_TO_MATURITY.get(normalize_doc_status(doc_status), 0))

def impl_score(impl_status: str) -> int:
    return int(IMPL_STATUS_TO_MATURITY.get(normalize_impl_status(impl_status), 0))

def evidence_status_from_refs(refs: List[str]) -> str:
    return "Provided" if refs else "Missing"

def evidence_score(evidence_status: str) -> int:
    return status_to_points(evidence_status)

def apply_sector_weights(sector: str) -> Dict[str, float]:
    s = normalize_sector(sector)
    weights = dict(BASELINE_WEIGHTS)
    deltas = SECTOR_WEIGHT_DELTAS.get(s, {})
    for k, d in deltas.items():
        if k in weights:
            weights[k] = max(0.0, weights[k] + float(d))
    total = sum(weights.values())
    if total <= 0:
        core = ["scope", "data", "evaluation", "oversight", "monitoring", "change"]
        return {k: (1.0 / len(core)) for k in core}
    for k in list(weights.keys()):
        weights[k] = weights[k] / total
    return weights

# Control Library for AI governance analysis
CONTROL_LIBRARY = {
    "SCP-01": {"control_id": "SCP-01", "control_name": "Use case and scope definition", "category": "scope"},
    "SCP-02": {"control_id": "SCP-02", "control_name": "Prohibited use cases", "category": "scope"},
    "DAT-01": {"control_id": "DAT-01", "control_name": "Data sources and permissions", "category": "data"},
    "DAT-02": {"control_id": "DAT-02", "control_name": "Data quality assessment", "category": "data"},
    "DAT-03": {"control_id": "DAT-03", "control_name": "Privacy and PII handling", "category": "data"},
    "EVAL-01": {"control_id": "EVAL-01", "control_name": "Model evaluation methodology", "category": "evaluation"},
    "EVAL-02": {"control_id": "EVAL-02", "control_name": "Bias and fairness testing", "category": "evaluation"},
    "EVAL-03": {"control_id": "EVAL-03", "control_name": "Performance metrics", "category": "evaluation"},
    "OVST-01": {"control_id": "OVST-01", "control_name": "Human oversight mechanisms", "category": "oversight"},
    "OVST-02": {"control_id": "OVST-02", "control_name": "Decision override capabilities", "category": "oversight"},
    "OVST-03": {"control_id": "OVST-03", "control_name": "Transparency and explainability", "category": "oversight"},
    "MON-01": {"control_id": "MON-01", "control_name": "Performance monitoring", "category": "monitoring"},
    "MON-02": {"control_id": "MON-02", "control_name": "Drift detection", "category": "monitoring"},
    "MON-03": {"control_id": "MON-03", "control_name": "Incident reporting", "category": "monitoring"},
    "CHG-01": {"control_id": "CHG-01", "control_name": "Change management process", "category": "change"},
    "CHG-02": {"control_id": "CHG-02", "control_name": "Version control", "category": "change"},
    "RES-01": {"control_id": "RES-01", "control_name": "Fallback procedures", "category": "resilience"},
    "RES-02": {"control_id": "RES-02", "control_name": "Business continuity", "category": "resilience"},
    "LCY-01": {"control_id": "LCY-01", "control_name": "Model retirement policy", "category": "lifecycle"},
    "LCY-02": {"control_id": "LCY-02", "control_name": "Documentation retention", "category": "lifecycle"},
}

def doc_maps_from_queries(queries: List[QueryItem]) -> tuple:
    doc_status_by_control = {}
    doc_result_by_control = {}
    for q in queries:
        cid = q.query_id.strip()
        if not cid:
            continue
        status = q.status.value if isinstance(q.status, QueryStatus) else str(q.status)
        sev = q.severity.value if isinstance(q.severity, QuerySeverity) else str(q.severity)
        
        doc_status = "Missing"
        doc_result = "Unknown"
        
        if status == "Resolved":
            doc_status = "Documented"
            doc_result = "Meets"
        elif status == "AcceptedRisk":
            doc_status = "NA"
            doc_result = "Unknown"
        else:
            doc_status = "Missing" if sev == "BLOCKING" else "Partial"
            doc_result = "Unknown"
        
        if q.doc_status:
            doc_status = normalize_doc_status(q.doc_status)
        
        doc_status_by_control[cid] = doc_status
        doc_result_by_control[cid] = doc_result
    
    return doc_status_by_control, doc_result_by_control

def impl_status_by_control_from_queries(queries: List[QueryItem]) -> Dict[str, str]:
    out = {}
    for q in queries:
        cid = q.query_id.strip()
        if not cid:
            continue
        status = q.status.value if isinstance(q.status, QueryStatus) else str(q.status)
        sev = q.severity.value if isinstance(q.severity, QuerySeverity) else str(q.severity)
        
        impl_status = "Missing"
        if status == "Resolved":
            impl_status = "Observed"
        elif status == "AcceptedRisk":
            impl_status = "NA"
        else:
            impl_status = "Missing" if sev == "BLOCKING" else "Partial"
        
        if q.impl_status:
            impl_status = normalize_impl_status(q.impl_status)
        
        out[cid] = impl_status
    return out

def evidence_refs_by_control_from_queries(queries: List[QueryItem]) -> Dict[str, List[str]]:
    out = {}
    for q in queries:
        cid = q.query_id.strip()
        if not cid:
            continue
        if q.evidence_refs:
            out[cid] = list(q.evidence_refs)
    return out

def score_controls(ai_system: AISystem, sector: str, queries: List[QueryItem], language: str = "EN") -> List[ControlAssessment]:
    doc_status_by_control, _ = doc_maps_from_queries(queries)
    impl_status_by_control = impl_status_by_control_from_queries(queries)
    evidence_refs_by_control = evidence_refs_by_control_from_queries(queries)
    
    controls = []
    
    def d(cid: str, default: str = "Missing") -> str:
        return normalize_doc_status(doc_status_by_control.get(cid, default))
    
    def i(cid: str, default: str = "Missing") -> str:
        return normalize_impl_status(impl_status_by_control.get(cid, default))
    
    def maturity(cid: str) -> int:
        return min(100, doc_score(d(cid)) + impl_score(i(cid)))
    
    def ev_refs(cid: str) -> List[str]:
        return evidence_refs_by_control.get(cid, [])
    
    def ev_status(cid: str) -> str:
        return evidence_status_from_refs(ev_refs(cid))
    
    # Scope
    scope_doc = d("SCP-01")
    if scope_doc in {"Missing", "Partial"} and ai_system.intended_use:
        scope_doc = "Documented"
    controls.append(ControlAssessment(
        control_id="SCP-01",
        control_name="Use case and scope definition",
        category="scope",
        doc_status=scope_doc,
        impl_status=i("SCP-01"),
        maturity=max(doc_score(scope_doc), evidence_score(ev_status("SCP-01"))),
        finding="Use case and scope are documented." if scope_doc == "Documented" else "No documented use case or scope was provided.",
        evidence_refs=ev_refs("SCP-01"),
        evidence_status=ev_status("SCP-01"),
        control_library_ref="Scope/UseCase/Boundaries"
    ))
    
    # Data
    data_doc = d("DAT-01")
    if data_doc in {"Missing", "Partial"} and ai_system.data_sources:
        data_doc = "Documented"
    controls.append(ControlAssessment(
        control_id="DAT-01",
        control_name="Data sources and permissions",
        category="data",
        doc_status=data_doc,
        impl_status=i("DAT-01"),
        maturity=max(doc_score(data_doc), evidence_score(ev_status("DAT-01"))),
        finding="Data sources and permissions are documented." if data_doc == "Documented" else "No documented data sources or permissions were provided.",
        evidence_refs=ev_refs("DAT-01"),
        evidence_status=ev_status("DAT-01"),
        control_library_ref="Data/Inventory/Access"
    ))
    
    # Evaluation
    eval_doc = d("EVAL-01")
    if eval_doc in {"Missing", "Partial"} and ai_system.evaluation_method:
        eval_doc = "Documented"
    controls.append(ControlAssessment(
        control_id="EVAL-01",
        control_name="Validation method and baseline",
        category="evaluation",
        doc_status=eval_doc,
        impl_status=i("EVAL-01"),
        maturity=max(doc_score(eval_doc), evidence_score(ev_status("EVAL-01"))),
        finding="Validation method and baseline are documented." if eval_doc == "Documented" else "No documented validation method or baseline was provided.",
        evidence_refs=ev_refs("EVAL-01"),
        evidence_status=ev_status("EVAL-01"),
        control_library_ref="Evaluation/Baseline/QA"
    ))
    
    # Oversight
    ov_doc = d("HUM-01")
    if ov_doc in {"Missing", "Partial"} and ai_system.human_override:
        ov_doc = "Documented"
    controls.append(ControlAssessment(
        control_id="HUM-01",
        control_name="Human override and escalation",
        category="oversight",
        doc_status=ov_doc,
        impl_status=i("HUM-01"),
        maturity=max(doc_score(ov_doc), evidence_score(ev_status("HUM-01"))),
        finding="Override and escalation are documented." if ov_doc == "Documented" else "No documented override or escalation pathway was provided.",
        evidence_refs=ev_refs("HUM-01"),
        evidence_status=ev_status("HUM-01"),
        control_library_ref="Oversight/Override/Escalation"
    ))
    
    # Monitoring
    mon_doc = d("MON-CORE-01")
    controls.append(ControlAssessment(
        control_id="MON-CORE-01",
        control_name="Monitoring signals, thresholds, owners, evidence",
        category="monitoring",
        doc_status=mon_doc,
        impl_status=i("MON-CORE-01"),
        maturity=maturity("MON-CORE-01"),
        finding="Monitoring plan is documented." if mon_doc == "Documented" else "No documented monitoring signals, thresholds, owners, cadence, or evidence were provided.",
        evidence_refs=ev_refs("MON-CORE-01"),
        evidence_status=ev_status("MON-CORE-01"),
        control_library_ref="Monitoring/Signals/Thresholds/Evidence"
    ))
    
    # Resilience
    res_doc = d("MON-CORE-05")
    controls.append(ControlAssessment(
        control_id="MON-CORE-05",
        control_name="AI resilience and adversarial robustness",
        category="resilience",
        doc_status=res_doc,
        impl_status=i("MON-CORE-05"),
        maturity=maturity("MON-CORE-05"),
        finding="Resilience and adversarial robustness program is documented." if res_doc == "Documented" else "No documented adversarial testing, stress testing, or robustness validation program was provided.",
        evidence_refs=ev_refs("MON-CORE-05"),
        evidence_status=ev_status("MON-CORE-05"),
        control_library_ref="Resilience/Adversarial/StressTesting"
    ))
    
    # Lifecycle
    life_doc = d("MON-CORE-06")
    controls.append(ControlAssessment(
        control_id="MON-CORE-06",
        control_name="Lifecycle governance and sunset authority",
        category="lifecycle",
        doc_status=life_doc,
        impl_status=i("MON-CORE-06"),
        maturity=maturity("MON-CORE-06"),
        finding="Lifecycle governance and reauthorization are documented." if life_doc == "Documented" else "No documented system registry, reauthorization triggers, or decommission/sunset authority was provided.",
        evidence_refs=ev_refs("MON-CORE-06"),
        evidence_status=ev_status("MON-CORE-06"),
        control_library_ref="Lifecycle/Registry/Reauthorization/Sunset"
    ))
    
    # Change control
    chg_doc = d("CHG-01")
    controls.append(ControlAssessment(
        control_id="CHG-01",
        control_name="Change control and traceability",
        category="change",
        doc_status=chg_doc,
        impl_status=i("CHG-01"),
        maturity=maturity("CHG-01"),
        finding="Change control and traceability are documented." if chg_doc == "Documented" else "No documented change control, approvals, or traceability evidence were provided.",
        evidence_refs=ev_refs("CHG-01"),
        evidence_status=ev_status("CHG-01"),
        control_library_ref="Change/Approvals/Versioning"
    ))
    
    return controls

def aggregate_category_maturity(controls: List[ControlAssessment]) -> Dict[str, int]:
    by_cat = {}
    for c in controls:
        by_cat.setdefault(c.category, []).append(c.maturity)
    out = {}
    for cat, vals in by_cat.items():
        out[cat] = int(round(sum(vals) / max(1, len(vals))))
    return out

def weighted_score(category_maturity: Dict[str, int], weights: Dict[str, float]) -> Dict[str, float]:
    points = {}
    for cat, w in weights.items():
        m = float(category_maturity.get(cat, 0))
        points[cat] = round((m * w), 2)
    return points

def risk_tier_from(score: int, critical_flags: List[str]) -> str:
    if critical_flags:
        return "HIGH"
    if score >= 80:
        return "LOW"
    if score >= 60:
        return "MEDIUM"
    if score >= 40:
        return "ELEVATED"
    return "HIGH"

def readiness_label(score: int, sector: str) -> str:
    s = normalize_sector(sector)
    ready, conditional, not_ready = 80, 60, 40
    if s == "healthcare":
        ready, conditional, not_ready = 85, 65, 45
    elif s == "public":
        ready, conditional, not_ready = 80, 60, 40
    elif s == "saas":
        ready, conditional, not_ready = 80, 55, 35
    
    if score >= ready:
        return "READY_TO_RENDER"
    if score >= conditional:
        return "CONDITIONAL"
    if score >= not_ready:
        return "NEEDS_WORK"
    return "BLOCKED"

def assess_governance(ai_system: AISystem, sector: str, queries: List[QueryItem]) -> AssessmentResult:
    controls = score_controls(ai_system, sector, queries)
    category_weights = apply_sector_weights(sector)
    category_maturity = aggregate_category_maturity(controls)
    category_weighted_points = weighted_score(category_maturity, category_weights)
    
    score = int(round(sum(category_weighted_points.values())))
    
    # Critical flags
    critical_flags = []
    if category_maturity.get("data", 0) < 60:
        critical_flags.append("DATA_GOVERNANCE_BELOW_DEFINED")
    if category_maturity.get("change", 0) < 60:
        critical_flags.append("CHANGE_CONTROL_BELOW_DEFINED")
    
    risk_tier = risk_tier_from(score, critical_flags)
    readiness = readiness_label(score, sector)
    
    missing_elements = [c.control_id for c in controls if c.maturity == 0]
    
    # Evidence confidence
    doc_confidences = [DOC_STATUS_TO_CONFIDENCE.get(c.doc_status, 0.0) for c in controls]
    evidence_confidence = int(round(100 * sum(doc_confidences) / max(1, len(doc_confidences))))
    
    return AssessmentResult(
        score=score,
        readiness=readiness,
        risk_tier=risk_tier,
        category_weights=category_weights,
        category_maturity=category_maturity,
        category_weighted_points=category_weighted_points,
        monitoring_core01=category_maturity.get("monitoring", 0),
        monitoring_core02=category_maturity.get("monitoring", 0),
        monitoring_composite=category_maturity.get("monitoring", 0),
        evidence_confidence=evidence_confidence,
        missing_elements=missing_elements,
        critical_flags=critical_flags,
        controls=controls
    )

# ==================== DELIVERABLE BUILDER ====================

# Sector-specific guidance templates
SECTOR_GUIDANCE = {
    "saas": [
        "Implement automated monitoring and alerting for model drift detection",
        "Establish CI/CD pipelines with governance gates for model deployments",
        "Document API versioning strategy and deprecation policies",
        "Create customer-facing AI transparency documentation",
        "Implement rate limiting and usage quotas for AI features"
    ],
    "healthcare": [
        "Ensure HIPAA compliance for all AI-processed patient data",
        "Implement clinical validation protocols for AI recommendations",
        "Establish physician override mechanisms for all clinical AI systems",
        "Document bias testing across patient demographics",
        "Create audit trails for all AI-assisted clinical decisions",
        "Align with FDA guidance on AI/ML-based Software as Medical Device (SaMD)"
    ],
    "finance": [
        "Ensure model explainability for credit and lending decisions",
        "Implement fair lending compliance monitoring",
        "Document adverse action reasoning capabilities",
        "Establish model risk management framework aligned with SR 11-7",
        "Create audit trails for regulatory examination",
        "Implement anti-money laundering (AML) controls for AI systems"
    ],
    "public": [
        "Ensure algorithmic transparency for public-facing decisions",
        "Implement accessibility requirements (WCAG 2.1 AA)",
        "Document public interest impact assessments",
        "Establish citizen appeal mechanisms for AI decisions",
        "Create multilingual support documentation",
        "Align with government AI ethics guidelines and procurement standards"
    ],
    "education": [
        "Implement FERPA compliance for student data processing",
        "Document pedagogical validation of AI tutoring systems",
        "Establish parental consent mechanisms for minor students",
        "Create accessibility accommodations for learning differences",
        "Implement anti-cheating safeguards for AI assessment tools"
    ]
}

# Evidence artifact templates by control category
EVIDENCE_ARTIFACTS = {
    "scope": [
        "System boundary documentation",
        "Use case specifications",
        "Prohibited use policy",
        "Stakeholder approval records"
    ],
    "data": [
        "Data inventory and lineage documentation",
        "Data access control matrix",
        "Privacy impact assessment",
        "Data retention policy",
        "Third-party data agreements"
    ],
    "evaluation": [
        "Model validation reports",
        "Performance benchmark results",
        "Bias and fairness testing documentation",
        "A/B testing protocols and results"
    ],
    "oversight": [
        "Human override procedure documentation",
        "Escalation matrix and contacts",
        "Decision authority matrix",
        "Override audit logs"
    ],
    "monitoring": [
        "Monitoring signal definitions",
        "Alert threshold documentation",
        "Incident response procedures",
        "Performance dashboards",
        "Monitoring ownership RACI"
    ],
    "change": [
        "Change management policy",
        "Version control records",
        "Deployment approval logs",
        "Rollback procedures"
    ],
    "resilience": [
        "Adversarial testing reports",
        "Stress testing results",
        "Failover procedures",
        "Business continuity plan"
    ],
    "lifecycle": [
        "AI system registry entry",
        "Reauthorization schedule",
        "Sunset criteria and authority",
        "Decommissioning checklist"
    ]
}

def generate_remediation_roadmap(result: AssessmentResult, sector: str, high_risk: bool = False) -> RemediationRoadmap:
    """Generate prioritized remediation roadmap based on assessment results and sector."""
    immediate_actions = []
    short_term_actions = []
    medium_term_actions = []
    structural_recommendations = []
    executive_escalations = []
    
    s = normalize_sector(sector)
    
    # Immediate (0–30 days) - Critical issues
    if result.critical_flags:
        immediate_actions.append("Resolve critical governance control failures prior to continued deployment")
    
    if result.category_maturity.get("resilience", 0) < 40:
        immediate_actions.append("Initiate adversarial testing and resilience validation program (MON-CORE-05)")
    
    if result.category_maturity.get("lifecycle", 0) < 50:
        immediate_actions.append("Establish formal AI system registry and lifecycle reauthorization process (MON-CORE-06)")
    
    if result.category_maturity.get("data", 0) < 40:
        immediate_actions.append("Implement data governance controls including inventory, lineage, and access controls (DAT-01)")
    
    if result.category_maturity.get("oversight", 0) < 40 and high_risk:
        immediate_actions.append("Establish human override mechanisms and escalation pathways for high-risk decisions")
    
    # Short-Term (30–90 days) - Categories at 40-60 maturity
    for cat, maturity in result.category_maturity.items():
        if 40 <= maturity < 60:
            short_term_actions.append(f"Strengthen governance maturity in {cat} to reach defined operational baseline (>=60)")
    
    if result.evidence_confidence < 50:
        short_term_actions.append("Systematically collect and organize evidence artifacts for all governance controls")
    
    # Medium-Term (90–180 days) - Categories at 60-75 maturity
    for cat, maturity in result.category_maturity.items():
        if 60 <= maturity < 75:
            medium_term_actions.append(f"Advance {cat} toward managed and audit-validated maturity level")
    
    # Structural Recommendations based on sector
    if s == "healthcare":
        structural_recommendations.append("Align operational controls to FDA AI/ML guidance for clinical decision support")
        structural_recommendations.append("Implement HIPAA-compliant audit logging for all AI data access")
    elif s == "finance":
        structural_recommendations.append("Align model risk management to SR 11-7 regulatory expectations")
        structural_recommendations.append("Implement fair lending monitoring and adverse action documentation")
    elif s == "public":
        structural_recommendations.append("Establish algorithmic transparency and citizen appeal mechanisms")
        structural_recommendations.append("Document public interest impact assessments")
    
    structural_recommendations.append("Align operational controls to ISO/IEC 42001 Clauses 8–10 for audit defensibility")
    structural_recommendations.append("Implement formal lifecycle governance and sunset authority to support EU AI Act expectations")
    
    # Executive Escalations
    if high_risk and result.score < 70:
        executive_escalations.append("Escalate governance posture review to executive leadership due to high-risk deployment profile")
    
    if result.category_maturity.get("resilience", 0) < 60:
        executive_escalations.append("Review adversarial robustness exposure at governance committee level")
    
    if "DATA_GOVERNANCE_BELOW_DEFINED" in result.critical_flags:
        executive_escalations.append("Data governance gaps require executive sponsor attention and resource allocation")
    
    return RemediationRoadmap(
        immediate_actions=immediate_actions,
        short_term_actions=short_term_actions,
        medium_term_actions=medium_term_actions,
        structural_recommendations=structural_recommendations,
        executive_escalations=executive_escalations
    )

def generate_evidence_requests(controls: List[ControlAssessment]) -> List[EvidenceRequestItem]:
    """Generate detailed evidence request items for missing/partial evidence."""
    requests = []
    
    for control in controls:
        if control.evidence_status in ["Missing", "Partial"]:
            severity = "HIGH" if control.maturity < 40 else "MEDIUM" if control.maturity < 70 else "LOW"
            
            artifacts = EVIDENCE_ARTIFACTS.get(control.category, [
                "Documentation", "Audit logs", "Approval records"
            ])
            
            guidance = f"Provide evidence demonstrating {control.control_name.lower()}. "
            if control.doc_status == "Missing":
                guidance += "Start by documenting the current process and policy. "
            if control.impl_status == "Missing":
                guidance += "Include proof of implementation (screenshots, logs, or attestations)."
            
            requests.append(EvidenceRequestItem(
                control_id=control.control_id,
                control_name=control.control_name,
                category=control.category,
                severity=severity,
                required_artifacts=artifacts,
                guidance=guidance
            ))
    
    return requests

def generate_normative_alignment(result: AssessmentResult, sector: str) -> NormativeAlignment:
    """Assess alignment with normative frameworks based on maturity levels."""
    s = normalize_sector(sector)
    
    # ISO 42001 requires comprehensive governance across all categories
    iso_42001 = all(m >= 60 for m in result.category_maturity.values())
    
    # EU AI Act lifecycle requirements
    eu_ai_act_lifecycle = (
        result.category_maturity.get("lifecycle", 0) >= 60 and
        result.category_maturity.get("oversight", 0) >= 60 and
        result.category_maturity.get("monitoring", 0) >= 60
    )
    
    # NIST AI RMF alignment
    nist_ai_rmf = (
        result.category_maturity.get("evaluation", 0) >= 60 and
        result.category_maturity.get("monitoring", 0) >= 60 and
        result.category_maturity.get("resilience", 0) >= 50
    )
    
    # Canada AIDA (if applicable)
    canada_aida = (
        result.category_maturity.get("scope", 0) >= 60 and
        result.category_maturity.get("oversight", 0) >= 60 and
        result.evidence_confidence >= 60
    )
    
    return NormativeAlignment(
        iso_42001=iso_42001,
        eu_ai_act_lifecycle=eu_ai_act_lifecycle,
        nist_ai_rmf=nist_ai_rmf,
        canada_aida=canada_aida
    )

def generate_compliance_checklist(result: AssessmentResult, sector: str) -> List[Dict[str, Any]]:
    """Generate sector-specific compliance checklist."""
    s = normalize_sector(sector)
    checklist = []
    
    # Common items
    checklist.append({
        "item": "AI System Registration",
        "status": "Complete" if result.category_maturity.get("lifecycle", 0) >= 60 else "Incomplete",
        "priority": "HIGH",
        "notes": "Register system in enterprise AI inventory"
    })
    
    checklist.append({
        "item": "Data Governance Documentation",
        "status": "Complete" if result.category_maturity.get("data", 0) >= 60 else "Incomplete",
        "priority": "HIGH",
        "notes": "Document data sources, permissions, and retention policies"
    })
    
    checklist.append({
        "item": "Human Oversight Mechanisms",
        "status": "Complete" if result.category_maturity.get("oversight", 0) >= 60 else "Incomplete",
        "priority": "HIGH",
        "notes": "Implement override and escalation procedures"
    })
    
    checklist.append({
        "item": "Monitoring and Alerting",
        "status": "Complete" if result.category_maturity.get("monitoring", 0) >= 60 else "Incomplete",
        "priority": "MEDIUM",
        "notes": "Define signals, thresholds, and ownership"
    })
    
    checklist.append({
        "item": "Change Control Process",
        "status": "Complete" if result.category_maturity.get("change", 0) >= 60 else "Incomplete",
        "priority": "MEDIUM",
        "notes": "Establish versioning and approval workflows"
    })
    
    # Sector-specific items
    if s == "healthcare":
        checklist.append({
            "item": "HIPAA Compliance Review",
            "status": "Pending Review",
            "priority": "HIGH",
            "notes": "Verify PHI handling and access controls"
        })
        checklist.append({
            "item": "Clinical Validation Protocol",
            "status": "Pending Review",
            "priority": "HIGH",
            "notes": "Document clinical accuracy and safety testing"
        })
    elif s == "finance":
        checklist.append({
            "item": "Fair Lending Compliance",
            "status": "Pending Review",
            "priority": "HIGH",
            "notes": "Document bias testing and adverse action capabilities"
        })
        checklist.append({
            "item": "Model Risk Management (SR 11-7)",
            "status": "Pending Review",
            "priority": "HIGH",
            "notes": "Align with regulatory model governance expectations"
        })
    elif s == "public":
        checklist.append({
            "item": "Algorithmic Transparency",
            "status": "Pending Review",
            "priority": "HIGH",
            "notes": "Document decision logic for public disclosure"
        })
        checklist.append({
            "item": "Accessibility Compliance",
            "status": "Pending Review",
            "priority": "MEDIUM",
            "notes": "Verify WCAG 2.1 AA compliance"
        })
    
    return checklist

def build_deliverable_package(
    assessment: Assessment,
    client: Dict[str, Any],
    ai_system: Dict[str, Any]
) -> DeliverablePackage:
    """Build complete deliverable package for an assessment."""
    result = assessment.result
    sector = client.get('sector', 'Other')
    s = normalize_sector(sector)
    high_risk = ai_system.get('high_stakes', False)
    
    # Generate all components
    roadmap = generate_remediation_roadmap(result, sector, high_risk)
    evidence_requests = generate_evidence_requests(result.controls)
    normative_alignment = generate_normative_alignment(result, sector)
    compliance_checklist = generate_compliance_checklist(result, sector)
    sector_guidance = SECTOR_GUIDANCE.get(s, SECTOR_GUIDANCE.get("saas", []))
    
    # Gov report summary
    gov_report_summary = {
        "score": result.score,
        "risk_tier": result.risk_tier,
        "readiness": result.readiness,
        "evidence_confidence": result.evidence_confidence,
        "critical_flags": result.critical_flags,
        "missing_elements": result.missing_elements,
        "category_maturity": result.category_maturity,
        "category_weights": result.category_weights,
        "controls_summary": {
            "total": len(result.controls),
            "documented": len([c for c in result.controls if c.doc_status == "Documented"]),
            "missing_evidence": len([c for c in result.controls if c.evidence_status == "Missing"])
        }
    }
    
    return DeliverablePackage(
        assessment_id=assessment.id,
        client_name=client.get('company_name', 'Unknown'),
        system_name=ai_system.get('system_name', 'Unknown'),
        sector=sector,
        generated_at=datetime.now(timezone.utc),
        gov_report_summary=gov_report_summary,
        evidence_requests=evidence_requests,
        roadmap=roadmap,
        normative_alignment=normative_alignment,
        sector_specific_guidance=sector_guidance,
        compliance_checklist=compliance_checklist
    )

# ==================== AUTH HELPERS ====================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[Dict]:
    """Get current user from JWT token. Returns None if no token or invalid."""
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            return None
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "hashed_password": 0})
        return user
    except JWTError:
        return None

async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    """Require authentication. Raises 401 if not authenticated."""
    user = await get_current_user(credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

async def require_role(required_roles: List[UserRole], credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    """Require specific role(s). Raises 403 if not authorized."""
    user = await require_auth(credentials)
    if user.get('role') not in [r.value for r in required_roles]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return user

# Role-based permission helpers
def require_admin():
    async def _require_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
        return await require_role([UserRole.ADMIN], credentials)
    return _require_admin

def require_assessor_or_admin():
    async def _require(credentials: HTTPAuthorizationCredentials = Depends(security)):
        return await require_role([UserRole.ADMIN, UserRole.ASSESSOR], credentials)
    return _require

# ==================== AUDIT LOGGING ====================

async def log_audit(
    action: AuditAction,
    resource_type: str,
    resource_id: str = None,
    resource_name: str = None,
    details: Dict[str, Any] = None,
    user: Dict = None,
    ip_address: str = None
):
    """Log an audit event to the database."""
    audit_entry = AuditLog(
        user_id=user.get('id') if user else None,
        user_email=user.get('email') if user else None,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        resource_name=resource_name,
        details=details,
        ip_address=ip_address
    )
    await db.audit_logs.insert_one(audit_entry.model_dump())
    return audit_entry

# ==================== EMAIL NOTIFICATIONS ====================

async def send_evidence_notification(
    recipient_email: str,
    client_name: str,
    system_name: str,
    control_id: str,
    filename: str,
    uploaded_by: str
):
    """Send email notification when evidence is uploaded."""
    if not resend.api_key:
        logger.warning("Resend API key not configured, skipping email notification")
        return
    
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [recipient_email],
            "subject": f"[Compass AI] New Evidence Uploaded - {control_id}",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #8B5CF6, #10B981); padding: 20px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Compass AI Governance</h1>
                </div>
                <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #1e293b; margin-top: 0;">New Evidence Uploaded</h2>
                    <p style="color: #64748b;">A new evidence file has been uploaded to an assessment.</p>
                    
                    <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Client</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">{client_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">AI System</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">{system_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Control</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #8B5CF6;">{control_id}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">File</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">{filename}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; color: #64748b;">Uploaded By</td>
                            <td style="padding: 10px;">{uploaded_by}</td>
                        </tr>
                    </table>
                    
                    <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
                        This is an automated notification from Compass AI Governance Engine.
                    </p>
                </div>
            </div>
            """
        }
        resend.Emails.send(params)
        logger.info(f"Evidence notification sent to {recipient_email}")
    except Exception as e:
        logger.error(f"Failed to send evidence notification: {e}")

# ==================== API ROUTES ====================

# Health check
@api_router.get("/")
async def root():
    return {"message": "Compass AI Governance Engine API", "version": "1.0.0"}

# ----- AUTHENTICATION -----
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user."""
    # Check if email already exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=user_data.email,
        name=user_data.name,
        role=user_data.role,
        hashed_password=get_password_hash(user_data.password),
        notification_email=user_data.email
    )
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    
    # Generate token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role.value
        }
    }

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login and get access token."""
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, user.get('hashed_password', '')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.get('id')})
    
    # Log login event
    await log_audit(AuditAction.LOGIN, "user", user.get('id'), user.get('email'), user=user)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.get('id'),
            "email": user.get('email'),
            "name": user.get('name'),
            "role": user.get('role')
        }
    }

@api_router.get("/auth/me")
async def get_me(user: Dict = Depends(require_auth)):
    """Get current user info."""
    return user

@api_router.put("/auth/profile")
async def update_profile(
    name: Optional[str] = None,
    notification_email: Optional[str] = None,
    user: Dict = Depends(require_auth)
):
    """Update user profile."""
    update_data = {}
    if name:
        update_data['name'] = name
    if notification_email:
        update_data['notification_email'] = notification_email
    
    if update_data:
        await db.users.update_one({"id": user.get('id')}, {"$set": update_data})
    
    updated = await db.users.find_one({"id": user.get('id')}, {"_id": 0, "hashed_password": 0})
    return updated

@api_router.get("/auth/users")
async def list_users(user: Dict = Depends(require_auth)):
    """List all users (admin only)."""
    if user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = await db.users.find({}, {"_id": 0, "hashed_password": 0}).to_list(100)
    return users

# ----- CLIENTS -----
@api_router.post("/clients", response_model=Client)
async def create_client(client_data: ClientCreate, user: Dict = Depends(require_auth)):
    client_obj = Client(**client_data.model_dump())
    doc = client_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.clients.insert_one(doc)
    await log_audit(AuditAction.CREATE, "client", client_obj.id, client_obj.company_name, user=user)
    return client_obj

@api_router.get("/clients", response_model=List[Client])
async def get_clients():
    clients = await db.clients.find({}, {"_id": 0}).to_list(1000)
    for c in clients:
        if isinstance(c.get('created_at'), str):
            c['created_at'] = datetime.fromisoformat(c['created_at'])
    return clients

@api_router.get("/clients/{client_id}", response_model=Client)
async def get_client(client_id: str):
    client = await db.clients.find_one({"id": client_id}, {"_id": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    if isinstance(client.get('created_at'), str):
        client['created_at'] = datetime.fromisoformat(client['created_at'])
    return client

@api_router.put("/clients/{client_id}", response_model=Client)
async def update_client(client_id: str, client_data: ClientCreate, user: Dict = Depends(require_auth)):
    existing = await db.clients.find_one({"id": client_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Client not found")
    update_data = client_data.model_dump()
    await db.clients.update_one({"id": client_id}, {"$set": update_data})
    updated = await db.clients.find_one({"id": client_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    await log_audit(AuditAction.UPDATE, "client", client_id, client_data.company_name, user=user)
    return updated

@api_router.delete("/clients/{client_id}")
async def delete_client(client_id: str, user: Dict = Depends(require_assessor_or_admin())):
    existing = await db.clients.find_one({"id": client_id}, {"_id": 0})
    result = await db.clients.delete_one({"id": client_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    await log_audit(AuditAction.DELETE, "client", client_id, existing.get('company_name') if existing else None, user=user)
    return {"message": "Client deleted"}

# ----- AI SYSTEMS -----
@api_router.post("/ai-systems", response_model=AISystem)
async def create_ai_system(system_data: AISystemCreate, user: Dict = Depends(require_auth)):
    system_obj = AISystem(**system_data.model_dump())
    doc = system_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.ai_systems.insert_one(doc)
    await log_audit(AuditAction.CREATE, "ai_system", system_obj.id, system_obj.system_name, user=user)
    return system_obj

@api_router.get("/ai-systems", response_model=List[AISystem])
async def get_ai_systems(client_id: Optional[str] = None):
    query = {"client_id": client_id} if client_id else {}
    systems = await db.ai_systems.find(query, {"_id": 0}).to_list(1000)
    for s in systems:
        if isinstance(s.get('created_at'), str):
            s['created_at'] = datetime.fromisoformat(s['created_at'])
    return systems

@api_router.get("/ai-systems/{system_id}", response_model=AISystem)
async def get_ai_system(system_id: str):
    system = await db.ai_systems.find_one({"id": system_id}, {"_id": 0})
    if not system:
        raise HTTPException(status_code=404, detail="AI System not found")
    if isinstance(system.get('created_at'), str):
        system['created_at'] = datetime.fromisoformat(system['created_at'])
    return system

@api_router.put("/ai-systems/{system_id}", response_model=AISystem)
async def update_ai_system(system_id: str, system_data: AISystemCreate, user: Dict = Depends(require_auth)):
    existing = await db.ai_systems.find_one({"id": system_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="AI System not found")
    update_data = system_data.model_dump()
    await db.ai_systems.update_one({"id": system_id}, {"$set": update_data})
    updated = await db.ai_systems.find_one({"id": system_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    await log_audit(AuditAction.UPDATE, "ai_system", system_id, system_data.system_name, user=user)
    return updated

@api_router.delete("/ai-systems/{system_id}")
async def delete_ai_system(system_id: str, user: Dict = Depends(require_assessor_or_admin())):
    existing = await db.ai_systems.find_one({"id": system_id}, {"_id": 0})
    result = await db.ai_systems.delete_one({"id": system_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="AI System not found")
    await log_audit(AuditAction.DELETE, "ai_system", system_id, existing.get('system_name') if existing else None, user=user)
    return {"message": "AI System deleted"}

# ----- ASSESSMENTS -----
@api_router.post("/assessments", response_model=Assessment)
async def create_assessment(assessment_data: AssessmentCreate, user: Dict = Depends(require_auth)):
    # Verify client and AI system exist
    client = await db.clients.find_one({"id": assessment_data.client_id}, {"_id": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    ai_system = await db.ai_systems.find_one({"id": assessment_data.ai_system_id}, {"_id": 0})
    if not ai_system:
        raise HTTPException(status_code=404, detail="AI System not found")
    
    # Convert AI system dict to AISystem model
    if isinstance(ai_system.get('created_at'), str):
        ai_system['created_at'] = datetime.fromisoformat(ai_system['created_at'])
    ai_system_obj = AISystem(**ai_system)
    
    # Run governance assessment
    sector = client.get('sector', 'Other')
    result = assess_governance(ai_system_obj, sector, assessment_data.queries)
    
    # Create assessment
    assessment_obj = Assessment(
        client_id=assessment_data.client_id,
        ai_system_id=assessment_data.ai_system_id,
        queries=assessment_data.queries,
        governance=assessment_data.governance,
        strict_mode=assessment_data.strict_mode,
        result=result
    )
    
    doc = assessment_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.assessments.insert_one(doc)
    
    await log_audit(AuditAction.CREATE, "assessment", assessment_obj.id, f"{client.get('company_name')} - {ai_system.get('system_name')}", user=user)
    return assessment_obj

@api_router.get("/assessments", response_model=List[Assessment])
async def get_assessments(client_id: Optional[str] = None, ai_system_id: Optional[str] = None):
    query = {}
    if client_id:
        query["client_id"] = client_id
    if ai_system_id:
        query["ai_system_id"] = ai_system_id
    
    assessments = await db.assessments.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for a in assessments:
        if isinstance(a.get('created_at'), str):
            a['created_at'] = datetime.fromisoformat(a['created_at'])
    return assessments

@api_router.get("/assessments/{assessment_id}", response_model=Assessment)
async def get_assessment(assessment_id: str):
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    if isinstance(assessment.get('created_at'), str):
        assessment['created_at'] = datetime.fromisoformat(assessment['created_at'])
    return assessment

@api_router.delete("/assessments/{assessment_id}")
async def delete_assessment(assessment_id: str, user: Dict = Depends(require_assessor_or_admin())):
    existing = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    result = await db.assessments.delete_one({"id": assessment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Assessment not found")
    await log_audit(AuditAction.DELETE, "assessment", assessment_id, user=user)
    return {"message": "Assessment deleted"}

# ----- COMPARISON -----
@api_router.get("/assessments/compare/{assessment_id_1}/{assessment_id_2}")
async def compare_assessments(assessment_id_1: str, assessment_id_2: str):
    """Compare two assessments side-by-side."""
    assessment1 = await db.assessments.find_one({"id": assessment_id_1}, {"_id": 0})
    assessment2 = await db.assessments.find_one({"id": assessment_id_2}, {"_id": 0})
    
    if not assessment1:
        raise HTTPException(status_code=404, detail=f"Assessment {assessment_id_1} not found")
    if not assessment2:
        raise HTTPException(status_code=404, detail=f"Assessment {assessment_id_2} not found")
    
    result1 = assessment1.get('result', {})
    result2 = assessment2.get('result', {})
    
    # Calculate deltas
    score_delta = result2.get('score', 0) - result1.get('score', 0)
    evidence_delta = result2.get('evidence_confidence', 0) - result1.get('evidence_confidence', 0)
    
    # Category maturity comparison
    cat1 = result1.get('category_maturity', {})
    cat2 = result2.get('category_maturity', {})
    category_deltas = {}
    all_categories = set(cat1.keys()) | set(cat2.keys())
    for cat in all_categories:
        category_deltas[cat] = {
            "before": cat1.get(cat, 0),
            "after": cat2.get(cat, 0),
            "delta": cat2.get(cat, 0) - cat1.get(cat, 0)
        }
    
    # Control-level comparison
    controls1 = {c.get('control_id'): c for c in result1.get('controls', [])}
    controls2 = {c.get('control_id'): c for c in result2.get('controls', [])}
    control_comparison = []
    all_controls = set(controls1.keys()) | set(controls2.keys())
    for ctrl_id in sorted(all_controls):
        c1 = controls1.get(ctrl_id, {})
        c2 = controls2.get(ctrl_id, {})
        control_comparison.append({
            "control_id": ctrl_id,
            "control_name": c2.get('control_name') or c1.get('control_name', 'Unknown'),
            "category": c2.get('category') or c1.get('category', 'Unknown'),
            "before": {
                "maturity": c1.get('maturity', 0),
                "doc_status": c1.get('doc_status', 'Missing'),
                "evidence_status": c1.get('evidence_status', 'Missing')
            },
            "after": {
                "maturity": c2.get('maturity', 0),
                "doc_status": c2.get('doc_status', 'Missing'),
                "evidence_status": c2.get('evidence_status', 'Missing')
            },
            "delta": c2.get('maturity', 0) - c1.get('maturity', 0)
        })
    
    # Improvements and regressions
    improvements = [c for c in control_comparison if c['delta'] > 0]
    regressions = [c for c in control_comparison if c['delta'] < 0]
    
    return {
        "assessment_1": {
            "id": assessment_id_1,
            "created_at": assessment1.get('created_at'),
            "score": result1.get('score', 0),
            "risk_tier": result1.get('risk_tier', 'N/A'),
            "readiness": result1.get('readiness', 'N/A'),
            "evidence_confidence": result1.get('evidence_confidence', 0)
        },
        "assessment_2": {
            "id": assessment_id_2,
            "created_at": assessment2.get('created_at'),
            "score": result2.get('score', 0),
            "risk_tier": result2.get('risk_tier', 'N/A'),
            "readiness": result2.get('readiness', 'N/A'),
            "evidence_confidence": result2.get('evidence_confidence', 0)
        },
        "summary": {
            "score_delta": score_delta,
            "evidence_delta": evidence_delta,
            "risk_improved": result2.get('risk_tier') in ['LOW', 'MEDIUM'] and result1.get('risk_tier') in ['HIGH', 'ELEVATED'],
            "improvements_count": len(improvements),
            "regressions_count": len(regressions)
        },
        "category_deltas": category_deltas,
        "control_comparison": control_comparison,
        "improvements": improvements,
        "regressions": regressions
    }

@api_router.get("/ai-systems/{system_id}/assessment-history")
async def get_system_assessment_history(system_id: str):
    """Get assessment history for an AI system for comparison."""
    assessments = await db.assessments.find(
        {"ai_system_id": system_id}, 
        {"_id": 0}
    ).sort("created_at", -1).to_list(50)
    
    history = []
    for a in assessments:
        result = a.get('result', {})
        history.append({
            "id": a.get('id'),
            "created_at": a.get('created_at'),
            "score": result.get('score', 0),
            "risk_tier": result.get('risk_tier', 'N/A'),
            "readiness": result.get('readiness', 'N/A'),
            "evidence_confidence": result.get('evidence_confidence', 0)
        })
    
    return {
        "system_id": system_id,
        "assessments": history,
        "total": len(history)
    }

# ----- EXPORT -----
@api_router.get("/assessments/{assessment_id}/export/json")
async def export_assessment_json(assessment_id: str):
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment

@api_router.get("/assessments/{assessment_id}/export/markdown")
async def export_assessment_markdown(assessment_id: str):
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    client = await db.clients.find_one({"id": assessment.get('client_id')}, {"_id": 0})
    ai_system = await db.ai_systems.find_one({"id": assessment.get('ai_system_id')}, {"_id": 0})
    
    result = assessment.get('result', {})
    
    lines = [
        "# AI Governance Report",
        "",
        f"| Engagement | {assessment.get('id', 'N/A')} |",
        f"| Client | {client.get('company_name', 'N/A') if client else 'N/A'} |",
        f"| System | {ai_system.get('system_name', 'N/A') if ai_system else 'N/A'} |",
        f"| Score | {result.get('score', 'N/A')} |",
        f"| Risk tier | {result.get('risk_tier', 'N/A')} |",
        f"| Evidence confidence | {result.get('evidence_confidence', 'N/A')} |",
        "",
        "## Controls",
        "",
        "| Control | Category | Maturity | Doc | Impl | Evidence | Finding |",
        "| --- | --- | --- | --- | --- | --- | --- |",
    ]
    
    for c in result.get('controls', []):
        lines.append(f"| {c.get('control_id')} | {c.get('category')} | {c.get('maturity')} | {c.get('doc_status')} | {c.get('impl_status')} | {c.get('evidence_status')} | {c.get('finding', '').replace('|', '-')} |")
    
    lines.append("")
    lines.append("## Evidence Request")
    lines.append("")
    
    missing = [c for c in result.get('controls', []) if c.get('evidence_status') == 'Missing']
    if not missing:
        lines.append("- No missing evidence items.")
    else:
        for c in missing:
            lines.append(f"- {c.get('control_id')}: {c.get('control_name')} (need links, files, tickets, screenshots)")
    
    return {"markdown": "\n".join(lines)}

# ----- DELIVERABLES -----
@api_router.get("/assessments/{assessment_id}/deliverables")
async def get_assessment_deliverables(assessment_id: str):
    """Generate complete deliverable package for an assessment."""
    assessment_doc = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment_doc:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    client = await db.clients.find_one({"id": assessment_doc.get('client_id')}, {"_id": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    ai_system = await db.ai_systems.find_one({"id": assessment_doc.get('ai_system_id')}, {"_id": 0})
    if not ai_system:
        raise HTTPException(status_code=404, detail="AI System not found")
    
    # Convert to Assessment model
    if isinstance(assessment_doc.get('created_at'), str):
        assessment_doc['created_at'] = datetime.fromisoformat(assessment_doc['created_at'])
    
    # Reconstruct result with proper models
    result_dict = assessment_doc.get('result', {})
    controls = [ControlAssessment(**c) for c in result_dict.get('controls', [])]
    result = AssessmentResult(
        score=result_dict.get('score', 0),
        readiness=result_dict.get('readiness', 'BLOCKED'),
        risk_tier=result_dict.get('risk_tier', 'HIGH'),
        category_weights=result_dict.get('category_weights', {}),
        category_maturity=result_dict.get('category_maturity', {}),
        category_weighted_points=result_dict.get('category_weighted_points', {}),
        monitoring_core01=result_dict.get('monitoring_core01', 0),
        monitoring_core02=result_dict.get('monitoring_core02', 0),
        monitoring_composite=result_dict.get('monitoring_composite', 0),
        evidence_confidence=result_dict.get('evidence_confidence', 0),
        missing_elements=result_dict.get('missing_elements', []),
        critical_flags=result_dict.get('critical_flags', []),
        controls=controls
    )
    
    assessment = Assessment(
        id=assessment_doc.get('id'),
        client_id=assessment_doc.get('client_id'),
        ai_system_id=assessment_doc.get('ai_system_id'),
        queries=assessment_doc.get('queries', []),
        governance=GovernanceState(**assessment_doc.get('governance', {})),
        strict_mode=assessment_doc.get('strict_mode', True),
        result=result,
        created_at=assessment_doc.get('created_at')
    )
    
    package = build_deliverable_package(assessment, client, ai_system)
    return package.model_dump()

@api_router.get("/assessments/{assessment_id}/deliverables/roadmap")
async def get_assessment_roadmap(assessment_id: str):
    """Get just the remediation roadmap for an assessment."""
    deliverables = await get_assessment_deliverables(assessment_id)
    return {"roadmap": deliverables.get("roadmap", {})}

@api_router.get("/assessments/{assessment_id}/deliverables/evidence-requests")
async def get_assessment_evidence_requests(assessment_id: str):
    """Get evidence request items for an assessment."""
    deliverables = await get_assessment_deliverables(assessment_id)
    return {"evidence_requests": deliverables.get("evidence_requests", [])}

@api_router.get("/assessments/{assessment_id}/deliverables/compliance-checklist")
async def get_assessment_compliance_checklist(assessment_id: str):
    """Get sector-specific compliance checklist for an assessment."""
    deliverables = await get_assessment_deliverables(assessment_id)
    return {
        "sector": deliverables.get("sector"),
        "checklist": deliverables.get("compliance_checklist", []),
        "normative_alignment": deliverables.get("normative_alignment", {})
    }

# ----- DASHBOARD STATS -----
@api_router.get("/stats/dashboard")
async def get_dashboard_stats():
    clients_count = await db.clients.count_documents({})
    systems_count = await db.ai_systems.count_documents({})
    assessments_count = await db.assessments.count_documents({})
    
    # Recent assessments
    recent = await db.assessments.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    for a in recent:
        if isinstance(a.get('created_at'), str):
            a['created_at'] = datetime.fromisoformat(a['created_at'])
    
    # Risk distribution
    all_assessments = await db.assessments.find({}, {"_id": 0, "result.risk_tier": 1}).to_list(1000)
    risk_distribution = {"LOW": 0, "MEDIUM": 0, "ELEVATED": 0, "HIGH": 0}
    for a in all_assessments:
        tier = a.get('result', {}).get('risk_tier', 'HIGH')
        if tier in risk_distribution:
            risk_distribution[tier] += 1
    
    # Average score
    all_scores = await db.assessments.find({}, {"_id": 0, "result.score": 1}).to_list(1000)
    scores = [a.get('result', {}).get('score', 0) for a in all_scores if a.get('result', {}).get('score') is not None]
    avg_score = int(round(sum(scores) / max(1, len(scores)))) if scores else 0
    
    return {
        "clients_count": clients_count,
        "systems_count": systems_count,
        "assessments_count": assessments_count,
        "recent_assessments": recent,
        "risk_distribution": risk_distribution,
        "average_score": avg_score
    }

# ==================== EVIDENCE FILE ENDPOINTS ====================

@api_router.post("/evidence/upload")
async def upload_evidence(
    background_tasks: BackgroundTasks,
    assessment_id: str = Form(...),
    control_id: str = Form(...),
    description: str = Form(None),
    file: UploadFile = File(...),
    current_user: Optional[Dict] = Depends(get_current_user)
):
    """Upload evidence file for a specific control."""
    # Verify assessment exists
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Read file content
    content = await file.read()
    file_size = len(content)
    
    # Save file to disk
    file_id = str(uuid.uuid4())
    file_ext = Path(file.filename).suffix if file.filename else ""
    saved_filename = f"{file_id}{file_ext}"
    file_path = UPLOAD_DIR / saved_filename
    
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Get uploader info
    uploaded_by = current_user.get('name', 'Unknown') if current_user else "Anonymous"
    
    # Create evidence record
    evidence = EvidenceFile(
        id=file_id,
        assessment_id=assessment_id,
        control_id=control_id,
        filename=file.filename or "unknown",
        content_type=file.content_type or "application/octet-stream",
        file_size=file_size,
        description=description,
        uploaded_by=uploaded_by
    )
    
    doc = evidence.model_dump()
    doc['uploaded_at'] = doc['uploaded_at'].isoformat()
    doc['saved_filename'] = saved_filename
    await db.evidence_files.insert_one(doc)
    
    # Send email notification to client contact
    client = await db.clients.find_one({"id": assessment.get('client_id')}, {"_id": 0})
    ai_system = await db.ai_systems.find_one({"id": assessment.get('ai_system_id')}, {"_id": 0})
    
    if client and ai_system:
        # Get notification recipients (client contact + any subscribed users)
        notification_emails = []
        if client.get('primary_contact', {}).get('email'):
            notification_emails.append(client['primary_contact']['email'])
        
        # Also notify users who have notification_email set
        subscribed_users = await db.users.find(
            {"notification_email": {"$exists": True, "$ne": None}},
            {"_id": 0, "notification_email": 1}
        ).to_list(100)
        for u in subscribed_users:
            if u.get('notification_email') and u['notification_email'] not in notification_emails:
                notification_emails.append(u['notification_email'])
        
        # Send notifications in background
        for email in notification_emails[:5]:  # Limit to 5 recipients
            background_tasks.add_task(
                send_evidence_notification,
                email,
                client.get('company_name', 'Unknown'),
                ai_system.get('system_name', 'Unknown'),
                control_id,
                file.filename or "unknown",
                uploaded_by
            )
    
    return {"message": "File uploaded successfully", "evidence": evidence.model_dump()}

@api_router.get("/evidence/{assessment_id}")
async def get_evidence_files(assessment_id: str, control_id: Optional[str] = None):
    """Get all evidence files for an assessment."""
    query = {"assessment_id": assessment_id}
    if control_id:
        query["control_id"] = control_id
    
    files = await db.evidence_files.find(query, {"_id": 0}).to_list(100)
    for f in files:
        if isinstance(f.get('uploaded_at'), str):
            f['uploaded_at'] = datetime.fromisoformat(f['uploaded_at'])
    return files

@api_router.get("/evidence/download/{file_id}")
async def download_evidence(file_id: str):
    """Download an evidence file."""
    evidence = await db.evidence_files.find_one({"id": file_id}, {"_id": 0})
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence file not found")
    
    file_path = UPLOAD_DIR / evidence.get('saved_filename', '')
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    def iterfile():
        with open(file_path, "rb") as f:
            yield from f
    
    return StreamingResponse(
        iterfile(),
        media_type=evidence.get('content_type', 'application/octet-stream'),
        headers={"Content-Disposition": f"attachment; filename={evidence.get('filename', 'file')}"}
    )

@api_router.delete("/evidence/{file_id}")
async def delete_evidence(file_id: str):
    """Delete an evidence file."""
    evidence = await db.evidence_files.find_one({"id": file_id}, {"_id": 0})
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence file not found")
    
    # Delete from disk
    file_path = UPLOAD_DIR / evidence.get('saved_filename', '')
    if file_path.exists():
        file_path.unlink()
    
    # Delete from database
    await db.evidence_files.delete_one({"id": file_id})
    return {"message": "Evidence file deleted"}

# ==================== PDF EXPORT ====================

def generate_pdf_report(assessment: dict, client: dict, ai_system: dict, deliverables: dict) -> BytesIO:
    """Generate branded PDF report for an assessment."""
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib.colors import HexColor
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
    from reportlab.lib.enums import TA_CENTER, TA_LEFT
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.75*inch, bottomMargin=0.75*inch)
    
    # Colors
    PRIMARY = HexColor('#8B5CF6')
    MINT = HexColor('#10B981')
    SCARLET = HexColor('#F43F5E')
    DARK_BG = HexColor('#0A0D14')
    LIGHT_TEXT = HexColor('#E2E8F0')
    MUTED = HexColor('#94A3B8')
    
    # Styles
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=PRIMARY,
        spaceAfter=20,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=PRIMARY,
        spaceBefore=20,
        spaceAfter=10
    )
    
    subheading_style = ParagraphStyle(
        'SubHeading',
        parent=styles['Heading3'],
        fontSize=12,
        textColor=HexColor('#64748B'),
        spaceBefore=15,
        spaceAfter=8
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=10,
        textColor=HexColor('#334155'),
        spaceAfter=6
    )
    
    elements = []
    result = assessment.get('result', {})
    
    # Header
    elements.append(Paragraph("COMPASS AI", title_style))
    elements.append(Paragraph("AI Governance Assessment Report", ParagraphStyle(
        'Subtitle', parent=styles['Normal'], fontSize=12, textColor=MUTED, alignment=TA_CENTER
    )))
    elements.append(Spacer(1, 30))
    
    # Executive Summary Box
    elements.append(Paragraph("EXECUTIVE SUMMARY", heading_style))
    
    summary_data = [
        ["Client", client.get('company_name', 'N/A'), "Sector", client.get('sector', 'N/A')],
        ["AI System", ai_system.get('system_name', 'N/A'), "Type", ai_system.get('system_type', 'N/A')],
        ["Assessment Date", assessment.get('created_at', '')[:10] if assessment.get('created_at') else 'N/A', "", ""],
    ]
    
    summary_table = Table(summary_data, colWidths=[1.5*inch, 2.5*inch, 1*inch, 2*inch])
    summary_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (0, -1), MUTED),
        ('TEXTCOLOR', (2, 0), (2, -1), MUTED),
        ('TEXTCOLOR', (1, 0), (1, -1), HexColor('#1E293B')),
        ('TEXTCOLOR', (3, 0), (3, -1), HexColor('#1E293B')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 20))
    
    # Score Section
    score = result.get('score', 0)
    risk_tier = result.get('risk_tier', 'N/A')
    readiness = result.get('readiness', 'N/A').replace('_', ' ')
    evidence_conf = result.get('evidence_confidence', 0)
    
    score_color = MINT if score >= 80 else HexColor('#F59E0B') if score >= 60 else SCARLET
    
    score_data = [
        [Paragraph(f"<font size='36' color='{score_color.hexval()}'><b>{score}</b></font>", styles['Normal']),
         Paragraph(f"<font size='14' color='{PRIMARY.hexval()}'><b>{risk_tier}</b></font><br/><font size='9' color='#94A3B8'>Risk Tier</font>", styles['Normal']),
         Paragraph(f"<font size='14' color='#64748B'><b>{readiness}</b></font><br/><font size='9' color='#94A3B8'>Readiness</font>", styles['Normal']),
         Paragraph(f"<font size='14' color='#64748B'><b>{evidence_conf}%</b></font><br/><font size='9' color='#94A3B8'>Evidence Confidence</font>", styles['Normal'])],
    ]
    
    score_table = Table(score_data, colWidths=[1.5*inch, 1.75*inch, 2*inch, 1.75*inch])
    score_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
        ('TOPPADDING', (0, 0), (-1, -1), 15),
        ('BACKGROUND', (0, 0), (-1, -1), HexColor('#F8FAFC')),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
    ]))
    elements.append(score_table)
    elements.append(Spacer(1, 25))
    
    # Category Maturity
    elements.append(Paragraph("CATEGORY MATURITY", heading_style))
    
    cat_maturity = result.get('category_maturity', {})
    cat_data = [["Category", "Maturity", "Status"]]
    for cat, mat in cat_maturity.items():
        status = "Strong" if mat >= 80 else "Adequate" if mat >= 60 else "Needs Work" if mat >= 40 else "Critical"
        cat_data.append([cat.capitalize(), f"{mat}%", status])
    
    cat_table = Table(cat_data, colWidths=[2.5*inch, 2*inch, 2.5*inch])
    cat_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#FFFFFF')),
        ('ALIGN', (1, 0), (2, -1), 'CENTER'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#FFFFFF'), HexColor('#F8FAFC')]),
    ]))
    elements.append(cat_table)
    elements.append(Spacer(1, 25))
    
    # Controls Assessment
    elements.append(Paragraph("CONTROL ASSESSMENT DETAILS", heading_style))
    
    controls = result.get('controls', [])
    control_data = [["Control ID", "Name", "Doc Status", "Maturity"]]
    for c in controls:
        control_data.append([
            c.get('control_id', ''),
            c.get('control_name', '')[:40] + ('...' if len(c.get('control_name', '')) > 40 else ''),
            c.get('doc_status', ''),
            f"{c.get('maturity', 0)}%"
        ])
    
    control_table = Table(control_data, colWidths=[1*inch, 3.5*inch, 1.25*inch, 1.25*inch])
    control_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#FFFFFF')),
        ('ALIGN', (2, 0), (3, -1), 'CENTER'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#FFFFFF'), HexColor('#F8FAFC')]),
    ]))
    elements.append(control_table)
    elements.append(Spacer(1, 25))
    
    # Roadmap Section
    roadmap = deliverables.get('roadmap', {})
    if any([roadmap.get('immediate_actions'), roadmap.get('short_term_actions'), roadmap.get('medium_term_actions')]):
        elements.append(Paragraph("REMEDIATION ROADMAP", heading_style))
        
        if roadmap.get('immediate_actions'):
            elements.append(Paragraph("Immediate Actions (0-30 days)", subheading_style))
            for action in roadmap['immediate_actions']:
                elements.append(Paragraph(f"• {action}", body_style))
        
        if roadmap.get('short_term_actions'):
            elements.append(Paragraph("Short-Term Actions (30-90 days)", subheading_style))
            for action in roadmap['short_term_actions']:
                elements.append(Paragraph(f"• {action}", body_style))
        
        if roadmap.get('medium_term_actions'):
            elements.append(Paragraph("Medium-Term Actions (90-180 days)", subheading_style))
            for action in roadmap['medium_term_actions']:
                elements.append(Paragraph(f"• {action}", body_style))
        
        elements.append(Spacer(1, 20))
    
    # Normative Alignment
    elements.append(Paragraph("NORMATIVE ALIGNMENT", heading_style))
    
    norm = deliverables.get('normative_alignment', {})
    align_data = [
        ["Framework", "Status"],
        ["ISO/IEC 42001", "✓ Aligned" if norm.get('iso_42001') else "✗ Not Aligned"],
        ["EU AI Act Lifecycle", "✓ Aligned" if norm.get('eu_ai_act_lifecycle') else "✗ Not Aligned"],
        ["NIST AI RMF", "✓ Aligned" if norm.get('nist_ai_rmf') else "✗ Not Aligned"],
        ["Canada AIDA", "✓ Aligned" if norm.get('canada_aida') else "✗ Not Aligned"],
    ]
    
    align_table = Table(align_data, colWidths=[3.5*inch, 3.5*inch])
    align_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#FFFFFF')),
        ('ALIGN', (1, 0), (1, -1), 'CENTER'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#E2E8F0')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#FFFFFF'), HexColor('#F8FAFC')]),
    ]))
    elements.append(align_table)
    elements.append(Spacer(1, 30))
    
    # Footer
    elements.append(Paragraph(
        f"<font size='8' color='#94A3B8'>Generated by Compass AI Governance Engine | {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}</font>",
        ParagraphStyle('Footer', alignment=TA_CENTER)
    ))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer

@api_router.get("/assessments/{assessment_id}/export/pdf")
async def export_assessment_pdf(assessment_id: str):
    """Export assessment as branded PDF report."""
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    client = await db.clients.find_one({"id": assessment.get('client_id')}, {"_id": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    ai_system = await db.ai_systems.find_one({"id": assessment.get('ai_system_id')}, {"_id": 0})
    if not ai_system:
        raise HTTPException(status_code=404, detail="AI System not found")
    
    # Get deliverables for roadmap and normative alignment
    deliverables_response = await get_assessment_deliverables(assessment_id)
    
    # Generate PDF
    pdf_buffer = generate_pdf_report(assessment, client, ai_system, deliverables_response)
    
    filename = f"governance_report_{assessment_id[:8]}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# ==================== AI-POWERED FEATURES ====================

from ai_services import AIService, get_ai_service

# AI Models for request
class AIModelChoice(str, Enum):
    GPT = "gpt-5.2"
    CLAUDE = "claude"
    GEMINI = "gemini"

class AIGenerateRequest(BaseModel):
    model: AIModelChoice = AIModelChoice.GPT

class DocumentAnalysisRequest(BaseModel):
    document_text: str
    model: AIModelChoice = AIModelChoice.GPT

class ContractAnalysisRequest(BaseModel):
    contract_text: str
    model: AIModelChoice = AIModelChoice.GPT

class MarketIntelRequest(BaseModel):
    sector: str
    topics: Optional[List[str]] = None
    model: AIModelChoice = AIModelChoice.GPT

class AutoFillRequest(BaseModel):
    document_text: str
    model: AIModelChoice = AIModelChoice.GPT

class ClientOnboardingRequest(BaseModel):
    company_name: str
    sector: Sector
    jurisdiction: Optional[str] = None
    contact_name: str
    contact_email: EmailStr
    contact_title: Optional[str] = None
    systems: Optional[List[Dict[str, Any]]] = []
    notes: Optional[str] = None

# Onboarding Submission Model
class OnboardingSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    sector: str
    jurisdiction: Optional[str] = None
    contact_name: str
    contact_email: str
    contact_title: Optional[str] = None
    systems: List[Dict[str, Any]] = []
    notes: Optional[str] = None
    status: str = "pending"  # pending, approved, rejected
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[str] = None

@api_router.post("/ai/executive-summary/{assessment_id}")
async def generate_executive_summary(assessment_id: str, request: AIGenerateRequest):
    """Generate AI-powered executive summary for an assessment"""
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    result = assessment.get('result', {})
    if not result:
        raise HTTPException(status_code=400, detail="Assessment has no results yet")
    
    ai_service = await get_ai_service(request.model.value)
    summary = await ai_service.generate_executive_summary(result)
    
    return {"assessment_id": assessment_id, "executive_summary": summary, "model_used": request.model.value}

@api_router.post("/ai/remediation-plan/{assessment_id}")
async def generate_remediation_plan(assessment_id: str, request: AIGenerateRequest):
    """Generate AI-powered remediation plan for an assessment"""
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    result = assessment.get('result', {})
    if not result:
        raise HTTPException(status_code=400, detail="Assessment has no results yet")
    
    # Get client sector
    client = await db.clients.find_one({"id": assessment.get('client_id')}, {"_id": 0})
    sector = client.get('sector', 'Other') if client else 'Other'
    
    ai_service = await get_ai_service(request.model.value)
    plan = await ai_service.generate_remediation_plan(result, sector)
    
    return {"assessment_id": assessment_id, "remediation_plan": plan, "model_used": request.model.value}

@api_router.post("/ai/analyze-policy")
async def analyze_policy_document(request: DocumentAnalysisRequest):
    """Analyze a policy document for governance compliance"""
    if not request.document_text or len(request.document_text) < 50:
        raise HTTPException(status_code=400, detail="Document text too short")
    
    # Get standard controls for comparison
    controls = list(CONTROL_LIBRARY.values())
    
    ai_service = await get_ai_service(request.model.value)
    analysis = await ai_service.analyze_policy_document(request.document_text, controls)
    
    return {"analysis": analysis, "model_used": request.model.value}

@api_router.post("/ai/analyze-contract")
async def analyze_contract(request: ContractAnalysisRequest):
    """Analyze a contract for AI governance clauses"""
    if not request.contract_text or len(request.contract_text) < 50:
        raise HTTPException(status_code=400, detail="Contract text too short")
    
    ai_service = await get_ai_service(request.model.value)
    analysis = await ai_service.analyze_contract(request.contract_text)
    
    return {"analysis": analysis, "model_used": request.model.value}

@api_router.post("/ai/market-intelligence")
async def get_market_intelligence(request: MarketIntelRequest):
    """Get AI-powered market intelligence for a sector"""
    ai_service = await get_ai_service(request.model.value)
    intelligence = await ai_service.get_market_intelligence(request.sector, request.topics)
    
    return {"sector": request.sector, "intelligence": intelligence, "model_used": request.model.value}

@api_router.post("/ai/auto-fill")
async def auto_fill_from_document(request: AutoFillRequest):
    """Extract client/system info from document for auto-fill"""
    if not request.document_text or len(request.document_text) < 50:
        raise HTTPException(status_code=400, detail="Document text too short")
    
    ai_service = await get_ai_service(request.model.value)
    extracted = await ai_service.auto_fill_from_document(request.document_text)
    
    return {"extracted_data": extracted, "model_used": request.model.value}

# ==================== CLIENT ONBOARDING PORTAL ====================

@api_router.post("/onboarding/submit")
async def submit_onboarding(request: ClientOnboardingRequest):
    """Submit a client onboarding request (public endpoint)"""
    submission = OnboardingSubmission(
        company_name=request.company_name,
        sector=request.sector.value,
        jurisdiction=request.jurisdiction,
        contact_name=request.contact_name,
        contact_email=request.contact_email,
        contact_title=request.contact_title,
        systems=request.systems or [],
        notes=request.notes
    )
    
    await db.onboarding_submissions.insert_one(submission.model_dump())
    
    # Send notification email
    if resend.api_key:
        try:
            resend.Emails.send({
                "from": SENDER_EMAIL,
                "to": [request.contact_email],
                "subject": "Compass AI - Onboarding Request Received",
                "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0;">Compass AI</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">AI Governance Engine</p>
                    </div>
                    <div style="padding: 30px; background: #f8fafc;">
                        <h2 style="color: #1e293b;">Welcome, {request.contact_name}!</h2>
                        <p style="color: #475569;">Thank you for submitting your onboarding request for <strong>{request.company_name}</strong>.</p>
                        <p style="color: #475569;">Our team will review your submission and get back to you shortly.</p>
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #1e293b; margin-top: 0;">Submission Details</h3>
                            <p style="color: #475569; margin: 5px 0;"><strong>Company:</strong> {request.company_name}</p>
                            <p style="color: #475569; margin: 5px 0;"><strong>Sector:</strong> {request.sector.value}</p>
                            <p style="color: #475569; margin: 5px 0;"><strong>Reference:</strong> {submission.id[:8]}</p>
                        </div>
                    </div>
                </div>
                """
            })
        except Exception as e:
            logger.error(f"Failed to send onboarding email: {e}")
    
    return {"id": submission.id, "status": "pending", "message": "Onboarding request submitted successfully"}

@api_router.get("/onboarding/submissions")
async def list_onboarding_submissions(status: Optional[str] = None):
    """List all onboarding submissions (admin only)"""
    query = {}
    if status:
        query["status"] = status
    
    submissions = await db.onboarding_submissions.find(query, {"_id": 0}).sort("submitted_at", -1).to_list(100)
    return submissions

@api_router.get("/onboarding/submissions/{submission_id}")
async def get_onboarding_submission(submission_id: str):
    """Get a specific onboarding submission"""
    submission = await db.onboarding_submissions.find_one({"id": submission_id}, {"_id": 0})
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission

@api_router.put("/onboarding/submissions/{submission_id}/approve")
async def approve_onboarding(submission_id: str, user_id: Optional[str] = None):
    """Approve an onboarding submission and create client"""
    submission = await db.onboarding_submissions.find_one({"id": submission_id}, {"_id": 0})
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Create client from submission
    client = Client(
        company_name=submission['company_name'],
        sector=Sector(submission['sector']),
        primary_contact=Contact(
            name=submission['contact_name'],
            email=submission['contact_email'],
            title=submission.get('contact_title')
        ),
        jurisdiction=submission.get('jurisdiction')
    )
    
    await db.clients.insert_one(client.model_dump())
    
    # Create AI systems if any
    created_systems = []
    for sys_data in submission.get('systems', []):
        if sys_data.get('system_name'):
            ai_system = AISystem(
                client_id=client.id,
                system_name=sys_data.get('system_name', 'Unnamed System'),
                system_type=sys_data.get('system_type', 'General'),
                system_description=sys_data.get('system_description', ''),
                decision_role=DecisionRole(sys_data.get('decision_role', 'Informational')),
                user_type=UserType(sys_data.get('user_type', 'Internal')),
                high_stakes=sys_data.get('high_stakes', False),
                intended_use=sys_data.get('intended_use'),
                data_sources=sys_data.get('data_sources', [])
            )
            await db.ai_systems.insert_one(ai_system.model_dump())
            created_systems.append(ai_system.id)
    
    # Update submission status
    await db.onboarding_submissions.update_one(
        {"id": submission_id},
        {"$set": {
            "status": "approved",
            "reviewed_at": datetime.now(timezone.utc).isoformat(),
            "reviewed_by": user_id
        }}
    )
    
    return {
        "status": "approved",
        "client_id": client.id,
        "systems_created": created_systems
    }

@api_router.put("/onboarding/submissions/{submission_id}/reject")
async def reject_onboarding(submission_id: str, reason: Optional[str] = None, user_id: Optional[str] = None):
    """Reject an onboarding submission"""
    result = await db.onboarding_submissions.update_one(
        {"id": submission_id},
        {"$set": {
            "status": "rejected",
            "rejection_reason": reason,
            "reviewed_at": datetime.now(timezone.utc).isoformat(),
            "reviewed_by": user_id
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return {"status": "rejected", "reason": reason}

# ==================== DOCUMENT ANALYSIS STORAGE ====================

class PolicyAnalysis(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: Optional[str] = None
    document_name: str
    document_type: str  # policy, contract, procedure
    analysis_result: Dict[str, Any]
    model_used: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

@api_router.post("/documents/analyze-and-save")
async def analyze_and_save_document(
    file: UploadFile = File(...),
    client_id: Optional[str] = Form(None),
    document_type: str = Form("policy"),
    model: str = Form("gpt-5.2")
):
    """Upload, analyze, and save document analysis"""
    # Read file content
    content = await file.read()
    try:
        text = content.decode('utf-8')
    except:
        raise HTTPException(status_code=400, detail="Could not read document. Please upload a text-based file.")
    
    # Analyze based on type
    ai_service = await get_ai_service(model)
    
    if document_type == "contract":
        analysis = await ai_service.analyze_contract(text)
    else:
        controls = list(CONTROL_LIBRARY.values())
        analysis = await ai_service.analyze_policy_document(text, controls)
    
    # Save analysis
    doc_analysis = PolicyAnalysis(
        client_id=client_id,
        document_name=file.filename,
        document_type=document_type,
        analysis_result=analysis,
        model_used=model
    )
    
    await db.document_analyses.insert_one(doc_analysis.model_dump())
    
    return {
        "id": doc_analysis.id,
        "document_name": file.filename,
        "analysis": analysis,
        "model_used": model
    }

@api_router.get("/documents/analyses")
async def list_document_analyses(client_id: Optional[str] = None):
    """List all document analyses"""
    query = {}
    if client_id:
        query["client_id"] = client_id
    
    analyses = await db.document_analyses.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return analyses

@api_router.get("/documents/analyses/{analysis_id}")
async def get_document_analysis(analysis_id: str):
    """Get a specific document analysis"""
    analysis = await db.document_analyses.find_one({"id": analysis_id}, {"_id": 0})
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis

# ==================== MARKET INTELLIGENCE CACHE ====================

class MarketIntelCache(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sector: str
    intelligence: Dict[str, Any]
    model_used: str
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc) + timedelta(hours=24))

@api_router.get("/market-intelligence/{sector}")
async def get_cached_market_intelligence(sector: str, refresh: bool = False):
    """Get market intelligence for a sector (cached for 24h)"""
    # Check cache first
    if not refresh:
        cached = await db.market_intel_cache.find_one(
            {"sector": sector.lower(), "expires_at": {"$gt": datetime.now(timezone.utc).isoformat()}},
            {"_id": 0}
        )
        if cached:
            return cached
    
    # Generate new intelligence
    ai_service = await get_ai_service("gpt-5.2")
    intelligence = await ai_service.get_market_intelligence(sector)
    
    # Cache result
    cache_entry = MarketIntelCache(
        sector=sector.lower(),
        intelligence=intelligence,
        model_used="gpt-5.2"
    )
    
    # Upsert cache
    await db.market_intel_cache.update_one(
        {"sector": sector.lower()},
        {"$set": cache_entry.model_dump()},
        upsert=True
    )
    
    return cache_entry.model_dump()

# ==================== AUDIT LOG API ====================

@api_router.get("/audit-logs")
async def list_audit_logs(
    resource_type: Optional[str] = None,
    action: Optional[str] = None,
    user_id: Optional[str] = None,
    limit: int = 100,
    user: Dict = Depends(require_auth)
):
    """List audit logs (admin only)"""
    if user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    query = {}
    if resource_type:
        query["resource_type"] = resource_type
    if action:
        query["action"] = action
    if user_id:
        query["user_id"] = user_id
    
    logs = await db.audit_logs.find(query, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
    return logs

@api_router.get("/audit-logs/summary")
async def get_audit_summary(user: Dict = Depends(require_auth)):
    """Get audit log summary statistics"""
    if user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Get counts by action type
    pipeline = [
        {"$group": {"_id": "$action", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    action_counts = await db.audit_logs.aggregate(pipeline).to_list(20)
    
    # Get counts by resource type
    pipeline = [
        {"$group": {"_id": "$resource_type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    resource_counts = await db.audit_logs.aggregate(pipeline).to_list(20)
    
    # Get recent activity count (last 24h)
    yesterday = datetime.now(timezone.utc) - timedelta(hours=24)
    recent_count = await db.audit_logs.count_documents({"timestamp": {"$gte": yesterday.isoformat()}})
    
    return {
        "by_action": {item["_id"]: item["count"] for item in action_counts},
        "by_resource": {item["_id"]: item["count"] for item in resource_counts},
        "last_24h": recent_count
    }

# ==================== SCHEDULED ASSESSMENTS API ====================

class ScheduledAssessmentCreate(BaseModel):
    client_id: str
    ai_system_id: str
    frequency: ScheduleFrequency
    template_id: Optional[str] = None
    notify_emails: List[str] = []

@api_router.post("/scheduled-assessments")
async def create_scheduled_assessment(request: ScheduledAssessmentCreate, user: Dict = Depends(require_auth)):
    """Create a scheduled assessment"""
    # Calculate next due date
    now = datetime.now(timezone.utc)
    if request.frequency == ScheduleFrequency.WEEKLY:
        next_due = now + timedelta(weeks=1)
    elif request.frequency == ScheduleFrequency.MONTHLY:
        next_due = now + timedelta(days=30)
    elif request.frequency == ScheduleFrequency.QUARTERLY:
        next_due = now + timedelta(days=90)
    else:  # ANNUALLY
        next_due = now + timedelta(days=365)
    
    schedule = ScheduledAssessment(
        client_id=request.client_id,
        ai_system_id=request.ai_system_id,
        frequency=request.frequency,
        next_due=next_due,
        template_id=request.template_id,
        notify_emails=request.notify_emails,
        created_by=user.get('id')
    )
    
    await db.scheduled_assessments.insert_one(schedule.model_dump())
    await log_audit(AuditAction.CREATE, "scheduled_assessment", schedule.id, user=user)
    
    return {"id": schedule.id, "next_due": next_due.isoformat(), "status": "created"}

@api_router.get("/scheduled-assessments")
async def list_scheduled_assessments(user: Dict = Depends(require_auth)):
    """List all scheduled assessments"""
    schedules = await db.scheduled_assessments.find({"is_active": True}, {"_id": 0}).to_list(100)
    return schedules

@api_router.delete("/scheduled-assessments/{schedule_id}")
async def delete_scheduled_assessment(schedule_id: str, user: Dict = Depends(require_auth)):
    """Delete/deactivate a scheduled assessment"""
    result = await db.scheduled_assessments.update_one(
        {"id": schedule_id},
        {"$set": {"is_active": False}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    await log_audit(AuditAction.DELETE, "scheduled_assessment", schedule_id, user=user)
    return {"status": "deleted"}

@api_router.get("/scheduled-assessments/due")
async def get_due_assessments(user: Dict = Depends(require_auth)):
    """Get assessments that are due"""
    now = datetime.now(timezone.utc)
    due = await db.scheduled_assessments.find(
        {"is_active": True, "next_due": {"$lte": now.isoformat()}},
        {"_id": 0}
    ).to_list(100)
    return due

# ==================== SHAREABLE REPORTS API ====================

class ShareableReportCreate(BaseModel):
    assessment_id: str
    title: Optional[str] = None
    expires_in_days: Optional[int] = 30
    requires_signature: bool = False

@api_router.post("/shareable-reports")
async def create_shareable_report(request: ShareableReportCreate, user: Dict = Depends(require_auth)):
    """Create a shareable report link"""
    # Verify assessment exists
    assessment = await db.assessments.find_one({"id": request.assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    expires_at = None
    if request.expires_in_days:
        expires_at = datetime.now(timezone.utc) + timedelta(days=request.expires_in_days)
    
    report = ShareableReport(
        assessment_id=request.assessment_id,
        title=request.title,
        expires_at=expires_at,
        requires_signature=request.requires_signature,
        created_by=user.get('id')
    )
    
    await db.shareable_reports.insert_one(report.model_dump())
    await log_audit(AuditAction.CREATE, "shareable_report", report.id, user=user)
    
    return {
        "id": report.id,
        "share_token": report.share_token,
        "share_url": f"/shared/{report.share_token}",
        "expires_at": expires_at.isoformat() if expires_at else None
    }

@api_router.get("/shareable-reports")
async def list_shareable_reports(user: Dict = Depends(require_auth)):
    """List all shareable reports"""
    reports = await db.shareable_reports.find({"created_by": user.get('id')}, {"_id": 0}).to_list(100)
    return reports

@api_router.get("/shared/{share_token}")
async def get_shared_report(share_token: str):
    """Get a shared report by token (public endpoint)"""
    report = await db.shareable_reports.find_one({"share_token": share_token}, {"_id": 0})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Check expiration
    if report.get('expires_at'):
        expires_at = report['expires_at']
        # Handle both datetime objects and strings
        if isinstance(expires_at, str):
            expires_at = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
        # Make offset-naive datetime offset-aware
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=410, detail="Report has expired")
    
    # Get assessment data
    assessment = await db.assessments.find_one({"id": report['assessment_id']}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Get client and system info
    client = await db.clients.find_one({"id": assessment.get('client_id')}, {"_id": 0})
    system = await db.ai_systems.find_one({"id": assessment.get('ai_system_id')}, {"_id": 0})
    
    # Increment view count
    await db.shareable_reports.update_one(
        {"share_token": share_token},
        {"$inc": {"view_count": 1}}
    )
    
    return {
        "report": report,
        "assessment": assessment,
        "client": client,
        "system": system
    }

@api_router.post("/shared/{share_token}/sign")
async def sign_shared_report(share_token: str, name: str, email: str):
    """Sign a shared report (e-signature)"""
    report = await db.shareable_reports.find_one({"share_token": share_token}, {"_id": 0})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    if not report.get('requires_signature'):
        raise HTTPException(status_code=400, detail="Report does not require signature")
    
    if report.get('signed_at'):
        raise HTTPException(status_code=400, detail="Report already signed")
    
    await db.shareable_reports.update_one(
        {"share_token": share_token},
        {"$set": {
            "signature_name": name,
            "signature_email": email,
            "signed_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return {"status": "signed", "signed_at": datetime.now(timezone.utc).isoformat()}

# ==================== API KEYS ====================

class APIKeyCreate(BaseModel):
    name: str
    scopes: List[str] = ["read"]
    expires_in_days: Optional[int] = 365

@api_router.post("/api-keys")
async def create_api_key(request: APIKeyCreate, user: Dict = Depends(require_auth)):
    """Create a new API key"""
    # Generate key
    raw_key = f"cai_{str(uuid.uuid4()).replace('-', '')}"
    key_prefix = raw_key[:12]
    key_hash = pwd_context.hash(raw_key)
    
    expires_at = None
    if request.expires_in_days:
        expires_at = datetime.now(timezone.utc) + timedelta(days=request.expires_in_days)
    
    api_key = APIKey(
        user_id=user.get('id'),
        name=request.name,
        key_prefix=key_prefix,
        key_hash=key_hash,
        scopes=request.scopes,
        expires_at=expires_at
    )
    
    await db.api_keys.insert_one(api_key.model_dump())
    await log_audit(AuditAction.CREATE, "api_key", api_key.id, request.name, user=user)
    
    # Return full key only once
    return {
        "id": api_key.id,
        "key": raw_key,  # Only returned on creation
        "key_prefix": key_prefix,
        "name": request.name,
        "scopes": request.scopes,
        "expires_at": expires_at.isoformat() if expires_at else None,
        "warning": "Save this key now. It won't be shown again."
    }

@api_router.get("/api-keys")
async def list_api_keys(user: Dict = Depends(require_auth)):
    """List user's API keys"""
    keys = await db.api_keys.find(
        {"user_id": user.get('id'), "is_active": True},
        {"_id": 0, "key_hash": 0}
    ).to_list(50)
    return keys

@api_router.delete("/api-keys/{key_id}")
async def revoke_api_key(key_id: str, user: Dict = Depends(require_auth)):
    """Revoke an API key"""
    result = await db.api_keys.update_one(
        {"id": key_id, "user_id": user.get('id')},
        {"$set": {"is_active": False}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="API key not found")
    
    await log_audit(AuditAction.DELETE, "api_key", key_id, user=user)
    return {"status": "revoked"}

# ==================== BENCHMARK API ====================

@api_router.get("/benchmarks/{sector}")
async def get_sector_benchmark(sector: str):
    """Get benchmark data for a sector"""
    # Try to get cached benchmark
    benchmark = await db.benchmarks.find_one({"sector": sector.lower()}, {"_id": 0})
    
    should_recalculate = False
    if not benchmark:
        should_recalculate = True
    else:
        # Check if benchmark is stale (more than 1 day old)
        updated_at = benchmark.get('updated_at')
        if updated_at:
            try:
                if isinstance(updated_at, str):
                    updated_at = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
                age = datetime.now(timezone.utc) - updated_at
                if age.days > 1:
                    should_recalculate = True
            except:
                should_recalculate = True
        else:
            should_recalculate = True
    
    if should_recalculate:
        benchmark = await calculate_sector_benchmark(sector)
    
    return benchmark

async def calculate_sector_benchmark(sector: str) -> Dict:
    """Calculate benchmark statistics for a sector"""
    # Get all assessments for sector via client lookup
    clients = await db.clients.find({"sector": sector}, {"_id": 0, "id": 1}).to_list(1000)
    client_ids = [c['id'] for c in clients]
    
    if not client_ids:
        return {
            "sector": sector.lower(),
            "total_assessments": 0,
            "avg_score": 0,
            "median_score": 0,
            "percentile_25": 0,
            "percentile_75": 0,
            "percentile_90": 0,
            "category_averages": {},
            "risk_distribution": {}
        }
    
    assessments = await db.assessments.find(
        {"client_id": {"$in": client_ids}, "result": {"$ne": None}},
        {"_id": 0}
    ).to_list(10000)
    
    if not assessments:
        return {
            "sector": sector.lower(),
            "total_assessments": 0,
            "avg_score": 0,
            "median_score": 0,
            "percentile_25": 0,
            "percentile_75": 0,
            "percentile_90": 0,
            "category_averages": {},
            "risk_distribution": {}
        }
    
    scores = [a.get('result', {}).get('score', 0) for a in assessments if a.get('result')]
    scores.sort()
    
    n = len(scores)
    avg_score = sum(scores) / n if n > 0 else 0
    median_score = scores[n // 2] if n > 0 else 0
    percentile_25 = scores[int(n * 0.25)] if n > 0 else 0
    percentile_75 = scores[int(n * 0.75)] if n > 0 else 0
    percentile_90 = scores[int(n * 0.90)] if n > 0 else 0
    
    # Calculate category averages
    category_totals = {}
    category_counts = {}
    for a in assessments:
        cat_mat = a.get('result', {}).get('category_maturity', {})
        for cat, val in cat_mat.items():
            category_totals[cat] = category_totals.get(cat, 0) + val
            category_counts[cat] = category_counts.get(cat, 0) + 1
    
    category_averages = {
        cat: category_totals[cat] / category_counts[cat] 
        for cat in category_totals
    }
    
    # Risk distribution
    risk_distribution = {}
    for a in assessments:
        risk = a.get('result', {}).get('risk_tier', 'UNKNOWN')
        risk_distribution[risk] = risk_distribution.get(risk, 0) + 1
    
    benchmark = BenchmarkData(
        sector=sector.lower(),
        total_assessments=n,
        avg_score=round(avg_score, 1),
        median_score=round(median_score, 1),
        percentile_25=round(percentile_25, 1),
        percentile_75=round(percentile_75, 1),
        percentile_90=round(percentile_90, 1),
        category_averages={k: round(v, 1) for k, v in category_averages.items()},
        risk_distribution=risk_distribution
    )
    
    # Cache the benchmark
    await db.benchmarks.update_one(
        {"sector": sector.lower()},
        {"$set": benchmark.model_dump()},
        upsert=True
    )
    
    return benchmark.model_dump()

@api_router.get("/benchmarks/{sector}/compare/{assessment_id}")
async def compare_to_benchmark(sector: str, assessment_id: str):
    """Compare an assessment to sector benchmarks"""
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment or not assessment.get('result'):
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    benchmark = await get_sector_benchmark(sector)
    
    user_score = assessment['result'].get('score', 0)
    user_cat_mat = assessment['result'].get('category_maturity', {})
    
    # Calculate percentile
    # Simple percentile calculation based on quartiles
    if user_score >= benchmark.get('percentile_90', 100):
        percentile = 90 + (10 * (user_score - benchmark.get('percentile_90', 0)) / max(100 - benchmark.get('percentile_90', 0), 1))
    elif user_score >= benchmark.get('percentile_75', 75):
        percentile = 75 + (15 * (user_score - benchmark.get('percentile_75', 0)) / max(benchmark.get('percentile_90', 0) - benchmark.get('percentile_75', 0), 1))
    elif user_score >= benchmark.get('median_score', 50):
        percentile = 50 + (25 * (user_score - benchmark.get('median_score', 0)) / max(benchmark.get('percentile_75', 0) - benchmark.get('median_score', 0), 1))
    elif user_score >= benchmark.get('percentile_25', 25):
        percentile = 25 + (25 * (user_score - benchmark.get('percentile_25', 0)) / max(benchmark.get('median_score', 0) - benchmark.get('percentile_25', 0), 1))
    else:
        percentile = 25 * user_score / max(benchmark.get('percentile_25', 1), 1)
    
    percentile = min(99, max(1, round(percentile)))
    
    # Category comparison
    cat_avg = benchmark.get('category_averages', {})
    category_comparison = {}
    strengths = []
    improvements = []
    
    for cat, user_val in user_cat_mat.items():
        avg_val = cat_avg.get(cat, 50)
        diff = user_val - avg_val
        cat_percentile = 50 + (diff / 2)  # Simplified percentile
        category_comparison[cat] = {
            "user_score": round(user_val, 1),
            "sector_avg": round(avg_val, 1),
            "difference": round(diff, 1),
            "percentile": min(99, max(1, round(cat_percentile)))
        }
        if diff > 10:
            strengths.append(f"{cat.title()}: {round(diff)}pts above average")
        elif diff < -10:
            improvements.append(f"{cat.title()}: {abs(round(diff))}pts below average")
    
    # Peer comparison text
    if percentile >= 90:
        peer_text = f"Top 10% in {sector}"
    elif percentile >= 75:
        peer_text = f"Top 25% in {sector}"
    elif percentile >= 50:
        peer_text = f"Above average in {sector}"
    elif percentile >= 25:
        peer_text = f"Below average in {sector}"
    else:
        peer_text = f"Bottom 25% in {sector}"
    
    return {
        "assessment_id": assessment_id,
        "sector": sector,
        "user_score": user_score,
        "sector_avg": benchmark.get('avg_score', 0),
        "percentile": percentile,
        "peer_comparison": peer_text,
        "category_comparison": category_comparison,
        "strengths": strengths[:3],
        "improvement_areas": improvements[:3],
        "benchmark_stats": {
            "total_assessments": benchmark.get('total_assessments', 0),
            "percentile_25": benchmark.get('percentile_25', 0),
            "median": benchmark.get('median_score', 0),
            "percentile_75": benchmark.get('percentile_75', 0),
            "percentile_90": benchmark.get('percentile_90', 0)
        }
    }

@api_router.get("/benchmarks")
async def get_all_benchmarks():
    """Get benchmark data for all sectors"""
    sectors = ["saas", "healthcare", "education", "public", "finance", "construction", "other"]
    benchmarks = []
    
    for sector in sectors:
        benchmark = await db.benchmarks.find_one({"sector": sector}, {"_id": 0})
        if benchmark:
            benchmarks.append(benchmark)
    
    # If no benchmarks exist, seed with sample data
    if not benchmarks:
        await seed_sample_benchmarks()
        for sector in sectors:
            benchmark = await db.benchmarks.find_one({"sector": sector}, {"_id": 0})
            if benchmark:
                benchmarks.append(benchmark)
    
    return benchmarks

@api_router.post("/benchmarks/seed")
async def trigger_benchmark_seed(user: Dict = Depends(require_admin())):
    """Seed benchmark data (admin only)"""
    result = await seed_sample_benchmarks()
    return {"message": "Benchmark data seeded successfully", "sectors": result}

async def seed_sample_benchmarks():
    """Seed sample benchmark data for all sectors"""
    sample_benchmarks = [
        {
            "sector": "saas",
            "total_assessments": 127,
            "avg_score": 68.5,
            "median_score": 72.0,
            "percentile_25": 55.0,
            "percentile_75": 82.0,
            "percentile_90": 91.0,
            "category_averages": {
                "scope": 72.5, "data": 65.3, "evaluation": 68.7, "oversight": 64.2,
                "monitoring": 78.4, "change": 71.2, "resilience": 58.9, "lifecycle": 61.5
            },
            "risk_distribution": {"LOW": 45, "MEDIUM": 52, "ELEVATED": 22, "HIGH": 8}
        },
        {
            "sector": "healthcare",
            "total_assessments": 89,
            "avg_score": 74.2,
            "median_score": 76.0,
            "percentile_25": 62.0,
            "percentile_75": 85.0,
            "percentile_90": 93.0,
            "category_averages": {
                "scope": 78.1, "data": 81.5, "evaluation": 79.3, "oversight": 76.8,
                "monitoring": 68.2, "change": 67.4, "resilience": 72.1, "lifecycle": 69.8
            },
            "risk_distribution": {"LOW": 38, "MEDIUM": 31, "ELEVATED": 15, "HIGH": 5}
        },
        {
            "sector": "finance",
            "total_assessments": 156,
            "avg_score": 76.8,
            "median_score": 78.0,
            "percentile_25": 65.0,
            "percentile_75": 87.0,
            "percentile_90": 94.0,
            "category_averages": {
                "scope": 74.5, "data": 82.1, "evaluation": 73.6, "oversight": 71.8,
                "monitoring": 81.3, "change": 79.2, "resilience": 76.5, "lifecycle": 74.2
            },
            "risk_distribution": {"LOW": 62, "MEDIUM": 58, "ELEVATED": 28, "HIGH": 8}
        },
        {
            "sector": "education",
            "total_assessments": 64,
            "avg_score": 62.3,
            "median_score": 64.0,
            "percentile_25": 48.0,
            "percentile_75": 76.0,
            "percentile_90": 85.0,
            "category_averages": {
                "scope": 65.2, "data": 58.7, "evaluation": 64.1, "oversight": 68.3,
                "monitoring": 61.5, "change": 58.9, "resilience": 54.2, "lifecycle": 62.8
            },
            "risk_distribution": {"LOW": 18, "MEDIUM": 26, "ELEVATED": 14, "HIGH": 6}
        },
        {
            "sector": "public",
            "total_assessments": 78,
            "avg_score": 71.5,
            "median_score": 73.0,
            "percentile_25": 58.0,
            "percentile_75": 83.0,
            "percentile_90": 90.0,
            "category_averages": {
                "scope": 76.8, "data": 74.2, "evaluation": 69.5, "oversight": 78.1,
                "monitoring": 68.7, "change": 65.3, "resilience": 70.2, "lifecycle": 68.9
            },
            "risk_distribution": {"LOW": 28, "MEDIUM": 32, "ELEVATED": 14, "HIGH": 4}
        },
        {
            "sector": "construction",
            "total_assessments": 43,
            "avg_score": 58.7,
            "median_score": 60.0,
            "percentile_25": 45.0,
            "percentile_75": 72.0,
            "percentile_90": 82.0,
            "category_averages": {
                "scope": 56.3, "data": 62.1, "evaluation": 54.8, "oversight": 61.2,
                "monitoring": 68.5, "change": 52.7, "resilience": 64.9, "lifecycle": 48.6
            },
            "risk_distribution": {"LOW": 12, "MEDIUM": 18, "ELEVATED": 10, "HIGH": 3}
        },
        {
            "sector": "other",
            "total_assessments": 95,
            "avg_score": 64.1,
            "median_score": 66.0,
            "percentile_25": 52.0,
            "percentile_75": 77.0,
            "percentile_90": 86.0,
            "category_averages": {
                "scope": 66.4, "data": 63.8, "evaluation": 62.5, "oversight": 65.1,
                "monitoring": 67.3, "change": 61.9, "resilience": 58.7, "lifecycle": 59.2
            },
            "risk_distribution": {"LOW": 32, "MEDIUM": 38, "ELEVATED": 18, "HIGH": 7}
        }
    ]
    
    seeded_sectors = []
    for benchmark in sample_benchmarks:
        benchmark["id"] = str(uuid.uuid4())
        benchmark["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.benchmarks.update_one(
            {"sector": benchmark["sector"]},
            {"$set": benchmark},
            upsert=True
        )
        seeded_sectors.append(benchmark["sector"])
    
    return seeded_sectors

# ==================== BULK IMPORT API ====================

@api_router.post("/bulk/import-clients")
async def bulk_import_clients(
    file: UploadFile = File(...),
    user: Dict = Depends(require_auth)
):
    """Bulk import clients from CSV"""
    if user.get('role') not in ['admin', 'assessor']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    import csv
    from io import StringIO
    
    content = await file.read()
    try:
        text = content.decode('utf-8')
    except:
        raise HTTPException(status_code=400, detail="Could not read CSV file")
    
    reader = csv.DictReader(StringIO(text))
    imported = []
    errors = []
    
    for i, row in enumerate(reader):
        try:
            # Map CSV columns to client fields
            client = Client(
                company_name=row.get('company_name', row.get('name', '')),
                sector=Sector(row.get('sector', 'Other')),
                primary_contact=Contact(
                    name=row.get('contact_name', ''),
                    email=row.get('contact_email', ''),
                    title=row.get('contact_title')
                ),
                jurisdiction=row.get('jurisdiction')
            )
            await db.clients.insert_one(client.model_dump())
            imported.append(client.id)
        except Exception as e:
            errors.append({"row": i + 1, "error": str(e)})
    
    await log_audit(
        AuditAction.CREATE, "bulk_import", 
        details={"type": "clients", "count": len(imported), "errors": len(errors)},
        user=user
    )
    
    return {
        "imported": len(imported),
        "errors": errors,
        "client_ids": imported
    }

@api_router.post("/bulk/import-systems")
async def bulk_import_systems(
    file: UploadFile = File(...),
    user: Dict = Depends(require_auth)
):
    """Bulk import AI systems from CSV"""
    if user.get('role') not in ['admin', 'assessor']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    import csv
    from io import StringIO
    
    content = await file.read()
    try:
        text = content.decode('utf-8')
    except:
        raise HTTPException(status_code=400, detail="Could not read CSV file")
    
    reader = csv.DictReader(StringIO(text))
    imported = []
    errors = []
    
    for i, row in enumerate(reader):
        try:
            system = AISystem(
                client_id=row.get('client_id', ''),
                system_name=row.get('system_name', row.get('name', '')),
                system_type=row.get('system_type', 'General'),
                system_description=row.get('description', ''),
                decision_role=DecisionRole(row.get('decision_role', 'Informational')),
                user_type=UserType(row.get('user_type', 'Internal')),
                high_stakes=row.get('high_stakes', '').lower() == 'true',
                intended_use=row.get('intended_use'),
                data_sources=row.get('data_sources', '').split(',') if row.get('data_sources') else []
            )
            await db.ai_systems.insert_one(system.model_dump())
            imported.append(system.id)
        except Exception as e:
            errors.append({"row": i + 1, "error": str(e)})
    
    await log_audit(
        AuditAction.CREATE, "bulk_import",
        details={"type": "ai_systems", "count": len(imported), "errors": len(errors)},
        user=user
    )
    
    return {
        "imported": len(imported),
        "errors": errors,
        "system_ids": imported
    }

@api_router.post("/bulk/upload-evidence-zip")
async def bulk_upload_evidence_zip(
    file: UploadFile = File(...),
    assessment_id: str = Form(...),
    user: Dict = Depends(require_auth)
):
    """Bulk upload evidence files from a ZIP archive"""
    import zipfile
    
    # Verify assessment exists
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    content = await file.read()
    
    try:
        zip_buffer = BytesIO(content)
        with zipfile.ZipFile(zip_buffer, 'r') as zip_ref:
            uploaded = []
            errors = []
            
            for filename in zip_ref.namelist():
                if filename.endswith('/'):  # Skip directories
                    continue
                
                try:
                    file_data = zip_ref.read(filename)
                    
                    # Determine control ID from filename or path
                    # Expected format: CONTROL-ID/filename.ext or CONTROL-ID_filename.ext
                    parts = filename.replace('\\', '/').split('/')
                    if len(parts) > 1:
                        control_id = parts[0]
                        actual_filename = parts[-1]
                    else:
                        # Try underscore format
                        if '_' in filename:
                            control_id = filename.split('_')[0]
                            actual_filename = filename
                        else:
                            control_id = "GENERAL"
                            actual_filename = filename
                    
                    # Save file
                    file_id = str(uuid.uuid4())
                    file_ext = Path(actual_filename).suffix
                    storage_filename = f"{file_id}{file_ext}"
                    file_path = UPLOAD_DIR / storage_filename
                    
                    with open(file_path, 'wb') as f:
                        f.write(file_data)
                    
                    # Create evidence record
                    evidence = EvidenceFile(
                        assessment_id=assessment_id,
                        control_id=control_id.upper(),
                        filename=actual_filename,
                        content_type="application/octet-stream",
                        file_size=len(file_data),
                        uploaded_by=user.get('email')
                    )
                    await db.evidence_files.insert_one(evidence.model_dump())
                    uploaded.append({"filename": actual_filename, "control_id": control_id, "id": evidence.id})
                    
                except Exception as e:
                    errors.append({"filename": filename, "error": str(e)})
            
            await log_audit(
                AuditAction.CREATE, "bulk_evidence",
                resource_id=assessment_id,
                details={"count": len(uploaded), "errors": len(errors)},
                user=user
            )
            
            return {
                "uploaded": len(uploaded),
                "errors": errors,
                "files": uploaded
            }
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Invalid ZIP file")

# Include router and middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
