"""
AI Systems management routes for Compass AI.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Optional
from datetime import datetime

from config import db
from models import AISystemCreate, AISystem, AuditAction
from utils import require_auth, require_assessor_or_admin, log_audit

router = APIRouter(prefix="/ai-systems", tags=["AI Systems"])


@router.post("", response_model=AISystem)
async def create_ai_system(system_data: AISystemCreate, user: Dict = Depends(require_auth)):
    """Create a new AI system."""
    system_obj = AISystem(**system_data.model_dump())
    doc = system_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.ai_systems.insert_one(doc)
    await log_audit(AuditAction.CREATE, "ai_system", system_obj.id, system_obj.system_name, user=user)
    return system_obj


@router.get("", response_model=List[AISystem])
async def get_ai_systems(client_id: Optional[str] = None):
    """Get all AI systems, optionally filtered by client."""
    query = {"client_id": client_id} if client_id else {}
    systems = await db.ai_systems.find(query, {"_id": 0}).to_list(1000)
    for s in systems:
        if isinstance(s.get('created_at'), str):
            s['created_at'] = datetime.fromisoformat(s['created_at'])
    return systems


@router.get("/{system_id}", response_model=AISystem)
async def get_ai_system(system_id: str):
    """Get a specific AI system by ID."""
    system = await db.ai_systems.find_one({"id": system_id}, {"_id": 0})
    if not system:
        raise HTTPException(status_code=404, detail="AI System not found")
    if isinstance(system.get('created_at'), str):
        system['created_at'] = datetime.fromisoformat(system['created_at'])
    return system


@router.put("/{system_id}", response_model=AISystem)
async def update_ai_system(system_id: str, system_data: AISystemCreate, user: Dict = Depends(require_auth)):
    """Update an existing AI system."""
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


@router.delete("/{system_id}")
async def delete_ai_system(system_id: str, user: Dict = Depends(require_assessor_or_admin())):
    """Delete an AI system."""
    existing = await db.ai_systems.find_one({"id": system_id}, {"_id": 0})
    result = await db.ai_systems.delete_one({"id": system_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="AI System not found")
    await log_audit(AuditAction.DELETE, "ai_system", system_id, existing.get('system_name') if existing else None, user=user)
    return {"message": "AI System deleted"}


@router.get("/{system_id}/assessment-history")
async def get_system_assessment_history(system_id: str):
    """Get assessment history for a specific AI system."""
    # Verify system exists
    system = await db.ai_systems.find_one({"id": system_id}, {"_id": 0})
    if not system:
        raise HTTPException(status_code=404, detail="AI System not found")
    
    # Get assessments
    assessments = await db.assessments.find(
        {"ai_system_id": system_id}, 
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    # Build history
    history = []
    for a in assessments:
        if isinstance(a.get('created_at'), str):
            a['created_at'] = datetime.fromisoformat(a['created_at'])
        result = a.get('result', {})
        history.append({
            "assessment_id": a.get('id'),
            "created_at": a.get('created_at'),
            "score": result.get('score', 0),
            "risk_tier": result.get('risk_tier', 'UNKNOWN'),
            "readiness": result.get('readiness', 'Unknown'),
            "evidence_confidence": result.get('evidence_confidence', 0),
            "category_maturity": result.get('category_maturity', {})
        })
    
    return {
        "system_id": system_id,
        "system_name": system.get('system_name'),
        "total_assessments": len(history),
        "history": history
    }
