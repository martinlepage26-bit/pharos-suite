"""
Router exports for Compass AI backend.
"""
from compassai.backend.routers.auth import router as auth_router
from compassai.backend.routers.clients import router as clients_router
from compassai.backend.routers.ai_systems import router as ai_systems_router
from compassai.backend.routers.admin import router as admin_router
from compassai.backend.routers.governance_program import router as governance_program_router
from compassai.backend.routers.pharos_method import router as pharos_method_router

__all__ = [
    'auth_router',
    'clients_router', 
    'ai_systems_router',
    'admin_router',
    'governance_program_router',
    'pharos_method_router',
]
