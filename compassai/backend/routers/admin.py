"""
Admin routes for Compass AI - Audit Logs, API Keys, Benchmarks, Scheduled Assessments.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Optional, Any
from datetime import datetime, timezone, timedelta
import uuid
import secrets
import hashlib

from compassai.backend.config import db
from compassai.backend.models import (
    AuditAction, AuditLog, APIKeyCreate, APIKey, 
    ScheduledAssessmentCreate, ScheduledAssessment, ScheduleFrequency,
    ShareableReportCreate, ShareableReport, BenchmarkData, UserRole
)
from compassai.backend.utils import require_auth, require_admin, log_audit

router = APIRouter(tags=["Admin"])


# ==================== AUDIT LOGS ====================
@router.get("/audit-logs")
async def list_audit_logs(
    action: Optional[str] = None,
    resource_type: Optional[str] = None,
    limit: int = 100,
    user: Dict = Depends(require_auth)
):
    """Get audit logs with optional filters."""
    query = {}
    if action:
        query["action"] = action
    if resource_type:
        query["resource_type"] = resource_type
    
    logs = await db.audit_logs.find(query, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
    return logs


@router.get("/audit-logs/summary")
async def audit_log_summary(user: Dict = Depends(require_auth)):
    """Get audit log summary statistics."""
    yesterday = datetime.now(timezone.utc) - timedelta(days=1)
    
    # Action counts
    pipeline = [
        {"$group": {"_id": "$action", "count": {"$sum": 1}}}
    ]
    action_counts = await db.audit_logs.aggregate(pipeline).to_list(20)
    
    # Resource counts
    pipeline = [
        {"$group": {"_id": "$resource_type", "count": {"$sum": 1}}}
    ]
    resource_counts = await db.audit_logs.aggregate(pipeline).to_list(20)
    
    # Recent count
    recent_count = await db.audit_logs.count_documents({"timestamp": {"$gte": yesterday.isoformat()}})
    
    return {
        "by_action": {a["_id"]: a["count"] for a in action_counts if a["_id"]},
        "by_resource": {r["_id"]: r["count"] for r in resource_counts if r["_id"]},
        "last_24h": recent_count
    }


# ==================== API KEYS ====================
@router.post("/api-keys")
async def create_api_key(request: APIKeyCreate, user: Dict = Depends(require_auth)):
    """Create a new API key."""
    # Generate key
    raw_key = secrets.token_urlsafe(32)
    key_prefix = raw_key[:8]
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    
    # Calculate expiration
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
    
    doc = api_key.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    if doc.get('expires_at'):
        doc['expires_at'] = doc['expires_at'].isoformat()
    await db.api_keys.insert_one(doc)
    
    await log_audit(AuditAction.CREATE, "api_key", api_key.id, request.name, user=user)
    
    # Return the raw key ONLY on creation
    return {
        "id": api_key.id,
        "name": api_key.name,
        "key": raw_key,  # Only returned once!
        "key_prefix": key_prefix,
        "scopes": api_key.scopes,
        "expires_at": expires_at.isoformat() if expires_at else None,
        "message": "Save this key now - it won't be shown again!"
    }


@router.get("/api-keys")
async def list_api_keys(user: Dict = Depends(require_auth)):
    """List user's API keys (without the actual key values)."""
    keys = await db.api_keys.find(
        {"user_id": user.get('id'), "is_active": True},
        {"_id": 0, "key_hash": 0}
    ).to_list(100)
    return keys


@router.delete("/api-keys/{key_id}")
async def revoke_api_key(key_id: str, user: Dict = Depends(require_auth)):
    """Revoke an API key."""
    key = await db.api_keys.find_one({"id": key_id, "user_id": user.get('id')}, {"_id": 0})
    if not key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    await db.api_keys.update_one({"id": key_id}, {"$set": {"is_active": False}})
    await log_audit(AuditAction.DELETE, "api_key", key_id, user=user)
    
    return {"message": "API key revoked"}


# ==================== SCHEDULED ASSESSMENTS ====================
def calculate_next_due(frequency: ScheduleFrequency) -> datetime:
    """Calculate next due date based on frequency."""
    now = datetime.now(timezone.utc)
    if frequency == ScheduleFrequency.WEEKLY:
        return now + timedelta(days=7)
    elif frequency == ScheduleFrequency.MONTHLY:
        return now + timedelta(days=30)
    elif frequency == ScheduleFrequency.QUARTERLY:
        return now + timedelta(days=90)
    else:  # ANNUALLY
        return now + timedelta(days=365)


@router.post("/scheduled-assessments")
async def create_scheduled_assessment(request: ScheduledAssessmentCreate, user: Dict = Depends(require_auth)):
    """Create a scheduled assessment."""
    # Verify client and system exist
    client = await db.clients.find_one({"id": request.client_id}, {"_id": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    system = await db.ai_systems.find_one({"id": request.ai_system_id}, {"_id": 0})
    if not system:
        raise HTTPException(status_code=404, detail="AI System not found")
    
    schedule = ScheduledAssessment(
        client_id=request.client_id,
        ai_system_id=request.ai_system_id,
        frequency=request.frequency,
        next_due=calculate_next_due(request.frequency),
        template_id=request.template_id,
        notify_emails=request.notify_emails,
        created_by=user.get('id')
    )
    
    doc = schedule.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['next_due'] = doc['next_due'].isoformat()
    await db.scheduled_assessments.insert_one(doc)
    
    await log_audit(AuditAction.CREATE, "scheduled_assessment", schedule.id, user=user)
    
    return schedule


@router.get("/scheduled-assessments")
async def list_scheduled_assessments(user: Dict = Depends(require_auth)):
    """List all scheduled assessments."""
    schedules = await db.scheduled_assessments.find({"is_active": True}, {"_id": 0}).to_list(100)
    return schedules


@router.delete("/scheduled-assessments/{schedule_id}")
async def delete_scheduled_assessment(schedule_id: str, user: Dict = Depends(require_auth)):
    """Delete a scheduled assessment."""
    result = await db.scheduled_assessments.update_one(
        {"id": schedule_id},
        {"$set": {"is_active": False}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    await log_audit(AuditAction.DELETE, "scheduled_assessment", schedule_id, user=user)
    return {"message": "Schedule deleted"}


@router.get("/scheduled-assessments/due")
async def get_due_assessments(user: Dict = Depends(require_auth)):
    """Get assessments that are due to run."""
    now = datetime.now(timezone.utc).isoformat()
    due = await db.scheduled_assessments.find(
        {"is_active": True, "next_due": {"$lte": now}},
        {"_id": 0}
    ).to_list(100)
    return due


# ==================== SHAREABLE REPORTS ====================
@router.post("/shareable-reports")
async def create_shareable_report(request: ShareableReportCreate, user: Dict = Depends(require_auth)):
    """Create a shareable report link."""
    # Verify assessment exists
    assessment = await db.assessments.find_one({"id": request.assessment_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    expires_at = datetime.now(timezone.utc) + timedelta(days=request.expires_in_days)
    
    report = ShareableReport(
        assessment_id=request.assessment_id,
        created_by=user.get('id'),
        expires_at=expires_at,
        require_signature=request.require_signature,
        allowed_emails=request.allowed_emails
    )
    
    doc = report.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['expires_at'] = doc['expires_at'].isoformat()
    await db.shareable_reports.insert_one(doc)
    
    await log_audit(AuditAction.CREATE, "shareable_report", report.id, user=user)
    
    return {
        "id": report.id,
        "share_token": report.share_token,
        "share_url": f"/shared/{report.share_token}",
        "expires_at": expires_at.isoformat()
    }


@router.get("/shareable-reports")
async def list_shareable_reports(user: Dict = Depends(require_auth)):
    """List shareable reports created by the user."""
    reports = await db.shareable_reports.find(
        {"created_by": user.get('id')},
        {"_id": 0}
    ).to_list(100)
    return reports


@router.get("/shared/{share_token}")
async def get_shared_report(share_token: str):
    """Get a shared report by token (public endpoint)."""
    report = await db.shareable_reports.find_one({"share_token": share_token}, {"_id": 0})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Check expiration
    expires_at = report.get('expires_at')
    if expires_at:
        if isinstance(expires_at, str):
            expires_at = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
        if datetime.now(timezone.utc) > expires_at:
            raise HTTPException(status_code=410, detail="Report link has expired")
    
    # Get the assessment
    assessment = await db.assessments.find_one({"id": report.get('assessment_id')}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Get related data
    client = await db.clients.find_one({"id": assessment.get('client_id')}, {"_id": 0})
    system = await db.ai_systems.find_one({"id": assessment.get('ai_system_id')}, {"_id": 0})
    
    # Increment view count
    await db.shareable_reports.update_one(
        {"share_token": share_token},
        {"$inc": {"view_count": 1}}
    )
    
    return {
        "assessment": assessment,
        "client": client,
        "system": system,
        "report_info": {
            "expires_at": report.get('expires_at'),
            "require_signature": report.get('require_signature'),
            "signatures": report.get('signatures', []),
            "view_count": report.get('view_count', 0) + 1
        }
    }


@router.post("/shared/{share_token}/sign")
async def sign_shared_report(share_token: str, signature_data: Dict[str, Any]):
    """Add a signature to a shared report."""
    report = await db.shareable_reports.find_one({"share_token": share_token}, {"_id": 0})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    signature = {
        "name": signature_data.get("name"),
        "email": signature_data.get("email"),
        "title": signature_data.get("title"),
        "signed_at": datetime.now(timezone.utc).isoformat(),
        "ip_address": signature_data.get("ip_address")
    }
    
    await db.shareable_reports.update_one(
        {"share_token": share_token},
        {"$push": {"signatures": signature}}
    )
    
    return {"message": "Signature added", "signature": signature}


# ==================== BENCHMARKS ====================
@router.get("/benchmarks")
async def get_all_benchmarks():
    """Get benchmark data for all sectors."""
    sectors = ["saas", "healthcare", "education", "public", "finance", "construction", "other"]
    benchmarks = []
    
    for sector in sectors:
        benchmark = await db.benchmarks.find_one({"sector": sector}, {"_id": 0})
        if benchmark:
            benchmarks.append(benchmark)

    return benchmarks


@router.get("/benchmarks/{sector}")
async def get_sector_benchmark(sector: str):
    """Get benchmark data for a sector."""
    benchmark = await db.benchmarks.find_one({"sector": sector.lower()}, {"_id": 0})
    
    should_recalculate = False
    if not benchmark:
        should_recalculate = True
    else:
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
    """Calculate benchmark statistics for a sector."""
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
    doc = benchmark.model_dump()
    doc['updated_at'] = datetime.now(timezone.utc).isoformat()
    await db.benchmarks.update_one(
        {"sector": sector.lower()},
        {"$set": doc},
        upsert=True
    )
    
    return doc


@router.get("/benchmarks/{sector}/compare/{assessment_id}")
async def compare_to_benchmark(sector: str, assessment_id: str):
    """Compare an assessment to sector benchmarks."""
    assessment = await db.assessments.find_one({"id": assessment_id}, {"_id": 0})
    if not assessment or not assessment.get('result'):
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    benchmark = await get_sector_benchmark(sector)
    
    user_score = assessment['result'].get('score', 0)
    user_cat_mat = assessment['result'].get('category_maturity', {})
    
    # Calculate percentile
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
        category_comparison[cat] = {
            "user_score": user_val,
            "sector_avg": round(avg_val, 1),
            "difference": round(diff, 1)
        }
        if diff > 10:
            strengths.append(f"Strong {cat} governance (+{round(diff)} above average)")
        elif diff < -10:
            improvements.append(f"Improve {cat} ({round(abs(diff))} below average)")
    
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


@router.post("/benchmarks/seed")
async def trigger_benchmark_seed(user: Dict = Depends(require_admin())):
    """Seed benchmark data (admin only)."""
    result = await seed_sample_benchmarks()
    return {"message": "Benchmark data seeded successfully", "sectors": result}


async def seed_sample_benchmarks():
    """Seed sample benchmark data for all sectors."""
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
