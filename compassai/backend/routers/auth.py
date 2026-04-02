"""
Authentication routes for Compass AI.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Optional

from compassai.backend.config import db
from compassai.backend.models import UserCreate, UserLogin, User, Token, UserRole, AuditAction
from compassai.backend.utils import (
    verify_password, get_password_hash, create_access_token,
    require_auth, log_audit
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user."""
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=user_data.email,
        name=user_data.name,
        role=user_data.role,
        hashed_password=get_password_hash(user_data.password)
    )
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
    }


@router.post("/login", response_model=Token)
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


@router.get("/me")
async def get_me(user: Dict = Depends(require_auth)):
    """Get current user info."""
    return user


@router.put("/profile")
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
    
    updated_user = await db.users.find_one({"id": user.get('id')}, {"_id": 0, "hashed_password": 0})
    return updated_user


@router.get("/users")
async def list_users(user: Dict = Depends(require_auth)):
    """List all users (admin only)."""
    if user.get('role') != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = await db.users.find({}, {"_id": 0, "hashed_password": 0}).to_list(1000)
    return users
