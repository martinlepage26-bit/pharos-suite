"""
Router exports for Compass AI backend.
"""
from routers.auth import router as auth_router
from routers.clients import router as clients_router
from routers.ai_systems import router as ai_systems_router
from routers.admin import router as admin_router
from routers.governance_program import router as governance_program_router

__all__ = [
    'auth_router',
    'clients_router', 
    'ai_systems_router',
    'admin_router',
    'governance_program_router',
]
