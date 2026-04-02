"""
Client management routes for Compass AI.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
from datetime import datetime

from compassai.backend.config import db
from compassai.backend.models import ClientCreate, Client, AuditAction
from compassai.backend.utils import require_auth, require_assessor_or_admin, log_audit

router = APIRouter(prefix="/clients", tags=["Clients"])


@router.post("", response_model=Client)
async def create_client(client_data: ClientCreate, user: Dict = Depends(require_auth)):
    """Create a new client."""
    client_obj = Client(**client_data.model_dump())
    doc = client_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.clients.insert_one(doc)
    await log_audit(AuditAction.CREATE, "client", client_obj.id, client_obj.company_name, user=user)
    return client_obj


@router.get("", response_model=List[Client])
async def get_clients():
    """Get all clients."""
    clients = await db.clients.find({}, {"_id": 0}).to_list(1000)
    for c in clients:
        if isinstance(c.get('created_at'), str):
            c['created_at'] = datetime.fromisoformat(c['created_at'])
    return clients


@router.get("/{client_id}", response_model=Client)
async def get_client(client_id: str):
    """Get a specific client by ID."""
    client = await db.clients.find_one({"id": client_id}, {"_id": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    if isinstance(client.get('created_at'), str):
        client['created_at'] = datetime.fromisoformat(client['created_at'])
    return client


@router.put("/{client_id}", response_model=Client)
async def update_client(client_id: str, client_data: ClientCreate, user: Dict = Depends(require_auth)):
    """Update an existing client."""
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


@router.delete("/{client_id}")
async def delete_client(client_id: str, user: Dict = Depends(require_assessor_or_admin())):
    """Delete a client."""
    existing = await db.clients.find_one({"id": client_id}, {"_id": 0})
    result = await db.clients.delete_one({"id": client_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    await log_audit(AuditAction.DELETE, "client", client_id, existing.get('company_name') if existing else None, user=user)
    return {"message": "Client deleted"}
