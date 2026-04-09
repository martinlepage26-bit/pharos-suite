from __future__ import annotations

import copy
import os
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

import pytest
from fastapi.testclient import TestClient


REPO_ROOT = Path(__file__).resolve().parents[3]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
os.environ.setdefault("DB_NAME", "compassai_test")
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-unit-tests-only")
os.environ.setdefault("OPENAI_API_KEY", "test-openai-key")
os.environ.setdefault("RESEND_API_KEY", "")


def _get_value(document: Dict[str, Any], path: str) -> Any:
    current: Any = document
    for part in path.split("."):
        if not isinstance(current, dict):
            return None
        current = current.get(part)
    return current


def _set_value(document: Dict[str, Any], path: str, value: Any) -> None:
    current = document
    parts = path.split(".")
    for part in parts[:-1]:
        current = current.setdefault(part, {})
    current[parts[-1]] = value


def _delete_value(document: Dict[str, Any], path: str) -> None:
    current = document
    parts = path.split(".")
    for part in parts[:-1]:
        current = current.get(part)
        if not isinstance(current, dict):
            return
    if isinstance(current, dict):
        current.pop(parts[-1], None)


def _coerce_pair(left: Any, right: Any) -> tuple[Any, Any]:
    if isinstance(left, datetime) and isinstance(right, str):
        return left.isoformat(), right
    if isinstance(left, str) and isinstance(right, datetime):
        return left, right.isoformat()
    return left, right


def _matches_query(document: Dict[str, Any], query: Dict[str, Any]) -> bool:
    for key, expected in query.items():
        actual = _get_value(document, key)
        if isinstance(expected, dict) and any(part.startswith("$") for part in expected):
            for operator, operand in expected.items():
                left, right = _coerce_pair(actual, operand)
                if operator == "$in" and left not in right:
                    return False
                if operator == "$ne" and left == right:
                    return False
                if operator == "$gt" and not (left is not None and left > right):
                    return False
                if operator == "$gte" and not (left is not None and left >= right):
                    return False
                if operator == "$lt" and not (left is not None and left < right):
                    return False
                if operator == "$lte" and not (left is not None and left <= right):
                    return False
        else:
            left, right = _coerce_pair(actual, expected)
            if left != right:
                return False
    return True


def _apply_projection(document: Dict[str, Any], projection: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    if not projection:
        return copy.deepcopy(document)

    include_paths = [path for path, enabled in projection.items() if enabled and path != "_id"]
    if include_paths:
        projected: Dict[str, Any] = {}
        for path in include_paths:
            value = _get_value(document, path)
            if value is not None:
                _set_value(projected, path, copy.deepcopy(value))
        return projected

    projected = copy.deepcopy(document)
    for path, enabled in projection.items():
        if not enabled:
            _delete_value(projected, path)
    return projected


@dataclass
class InsertOneResult:
    inserted_id: Optional[str]


@dataclass
class UpdateOneResult:
    matched_count: int
    modified_count: int
    upserted_id: Optional[str] = None


@dataclass
class DeleteOneResult:
    deleted_count: int


class InMemoryCursor:
    def __init__(self, documents: Iterable[Dict[str, Any]]):
        self._documents = [copy.deepcopy(document) for document in documents]
        self._limit: Optional[int] = None

    def sort(self, field: str, direction: int):
        reverse = direction < 0
        self._documents.sort(key=lambda item: _get_value(item, field) or "", reverse=reverse)
        return self

    def limit(self, count: int):
        self._limit = count
        return self

    async def to_list(self, count: int) -> List[Dict[str, Any]]:
        cap = self._limit if self._limit is not None else count
        return [copy.deepcopy(item) for item in self._documents[:cap]]


class InMemoryCollection:
    def __init__(self, name: str):
        self.name = name
        self._documents: List[Dict[str, Any]] = []

    async def insert_one(self, document: Dict[str, Any]) -> InsertOneResult:
        stored = copy.deepcopy(document)
        self._documents.append(stored)
        return InsertOneResult(inserted_id=stored.get("id"))

    async def find_one(self, query: Dict[str, Any], projection: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        for document in self._documents:
            if _matches_query(document, query):
                return _apply_projection(document, projection)
        return None

    def find(self, query: Optional[Dict[str, Any]] = None, projection: Optional[Dict[str, Any]] = None) -> InMemoryCursor:
        query = query or {}
        matched = [
            _apply_projection(document, projection)
            for document in self._documents
            if _matches_query(document, query)
        ]
        return InMemoryCursor(matched)

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any], upsert: bool = False) -> UpdateOneResult:
        for document in self._documents:
            if _matches_query(document, query):
                if "$set" in update:
                    for path, value in update["$set"].items():
                        _set_value(document, path, copy.deepcopy(value))
                if "$inc" in update:
                    for path, value in update["$inc"].items():
                        current = _get_value(document, path) or 0
                        _set_value(document, path, current + value)
                return UpdateOneResult(matched_count=1, modified_count=1)

        if not upsert:
            return UpdateOneResult(matched_count=0, modified_count=0)

        created: Dict[str, Any] = {}
        for key, value in query.items():
            if not isinstance(value, dict):
                _set_value(created, key, copy.deepcopy(value))
        for path, value in update.get("$set", {}).items():
            _set_value(created, path, copy.deepcopy(value))
        self._documents.append(created)
        return UpdateOneResult(matched_count=0, modified_count=1, upserted_id=created.get("id"))

    async def delete_one(self, query: Dict[str, Any]) -> DeleteOneResult:
        for index, document in enumerate(self._documents):
            if _matches_query(document, query):
                self._documents.pop(index)
                return DeleteOneResult(deleted_count=1)
        return DeleteOneResult(deleted_count=0)

    async def count_documents(self, query: Dict[str, Any]) -> int:
        return sum(1 for document in self._documents if _matches_query(document, query))

    def aggregate(self, pipeline: List[Dict[str, Any]]) -> InMemoryCursor:
        documents: List[Dict[str, Any]] = [copy.deepcopy(document) for document in self._documents]
        for stage in pipeline:
            if "$match" in stage:
                documents = [document for document in documents if _matches_query(document, stage["$match"])]
            elif "$group" in stage:
                group_spec = stage["$group"]
                group_path = group_spec["_id"].lstrip("$")
                grouped: Dict[Any, int] = {}
                for document in documents:
                    grouped[_get_value(document, group_path)] = grouped.get(_get_value(document, group_path), 0) + 1
                documents = [{"_id": key, "count": value} for key, value in grouped.items()]
            elif "$sort" in stage:
                [(field, direction)] = stage["$sort"].items()
                reverse = direction < 0
                documents.sort(key=lambda item: item.get(field, 0), reverse=reverse)
        return InMemoryCursor(documents)


class InMemoryDatabase:
    def __init__(self):
        self._collections: Dict[str, InMemoryCollection] = {}

    def __getattr__(self, name: str) -> InMemoryCollection:
        if name.startswith("_"):
            raise AttributeError(name)
        if name not in self._collections:
            self._collections[name] = InMemoryCollection(name)
        return self._collections[name]


class DummyMotorClient:
    def close(self) -> None:
        return None


class FakeAIService:
    def __init__(self, model_key: str):
        self.model_key = model_key

    async def analyze_policy_document(self, document_text: str, controls: List[Dict[str, Any]]) -> Dict[str, Any]:
        return {
            "summary": document_text[:60],
            "controls_addressed": [controls[0]["control_name"]] if controls else [],
            "controls_missing": ["TPRM-01"],
            "compliance_score": 82,
            "gaps": ["incident response"],
            "recommendations": ["Add an incident response control"],
            "risk_areas": ["third-party monitoring"],
        }

    async def analyze_contract(self, contract_text: str) -> Dict[str, Any]:
        return {
            "ai_clauses": [{"clause": "AI services description", "analysis": contract_text[:40], "risk_level": "medium"}],
            "data_provisions": [{"provision": "Client retains ownership", "compliant": True}],
            "liability_terms": ["Liability cap present"],
            "compliance_requirements": ["EU AI Act"],
            "missing_protections": ["model-change notice"],
            "overall_risk": "medium",
            "recommendations": ["Clarify model-change notification duties"],
        }

    async def get_market_intelligence(self, sector: str, topics: Optional[List[str]] = None) -> Dict[str, Any]:
        return {
            "regulatory_updates": [{"regulation": f"{sector} AI Act", "status": "active", "deadline": None, "impact": "monitoring"}],
            "compliance_trends": topics or ["governance reviews"],
            "enforcement_actions": [{"action": "sample enforcement", "impact": "medium"}],
            "best_practices": ["inventory AI systems"],
            "risk_alerts": ["document model changes"],
            "recommendations": ["formalize oversight"],
        }

    async def auto_fill_from_document(self, document_text: str) -> Dict[str, Any]:
        return {
            "client_info": {
                "company_name": "Acme Healthcare Solutions",
                "sector": "Healthcare",
                "jurisdiction": "United States",
                "contact_name": "Dr. Sarah Johnson",
                "contact_email": "sjohnson@acmehealthcare.com",
                "contact_title": "Chief Medical Officer",
            },
            "ai_system_info": {
                "system_name": "DiagnostiAI",
                "system_type": "Clinical Decision Support System",
                "system_description": document_text[:80],
                "intended_use": "Assist radiologists",
                "data_sources": ["Patient imaging data", "clinical records"],
                "high_stakes": True,
                "decision_role": "Advisory",
            },
            "confidence_score": 91,
            "extracted_fields_count": 8,
        }

    async def generate_executive_summary(self, assessment_data: Dict[str, Any]) -> str:
        return f"Executive summary for score {assessment_data.get('score', 'N/A')}"

    async def generate_remediation_plan(self, assessment_data: Dict[str, Any], sector: str) -> Dict[str, List[str]]:
        return {
            "immediate_actions": [f"Stabilize {sector} controls"],
            "short_term_actions": ["Document missing controls"],
            "medium_term_actions": ["Review governance cadence"],
            "resource_requirements": ["assessor time"],
        }


def _patch_database(monkeypatch: pytest.MonkeyPatch, db: InMemoryDatabase, upload_dir: Path) -> None:
    from compassai.backend import config as config_module
    from compassai.backend import server as server_module
    from compassai.backend import utils as utils_module
    from compassai.backend.routers import admin as admin_module
    from compassai.backend.routers import ai_systems as ai_systems_module
    from compassai.backend.routers import auth as auth_module
    from compassai.backend.routers import clients as clients_module
    from compassai.backend.routers import governance_program as governance_program_module
    from compassai.backend.routers import pharos_method as pharos_method_module

    modules = [
        config_module,
        server_module,
        utils_module,
        admin_module,
        ai_systems_module,
        auth_module,
        clients_module,
        governance_program_module,
        pharos_method_module,
    ]

    for module in modules:
        monkeypatch.setattr(module, "db", db, raising=False)

    dummy_client = DummyMotorClient()
    monkeypatch.setattr(config_module, "client", dummy_client, raising=False)
    monkeypatch.setattr(server_module, "client", dummy_client, raising=False)
    monkeypatch.setattr(server_module, "UPLOAD_DIR", upload_dir, raising=False)

    monkeypatch.setattr(server_module.resend.Emails, "send", lambda *_args, **_kwargs: {"id": "test-email"}, raising=False)
    monkeypatch.setattr(utils_module.resend.Emails, "send", lambda *_args, **_kwargs: {"id": "test-email"}, raising=False)

    async def fake_get_ai_service(model: str = "gpt-5.2") -> FakeAIService:
        return FakeAIService(model)

    monkeypatch.setattr(server_module, "get_ai_service", fake_get_ai_service, raising=False)


def _seed_admin_user(db: InMemoryDatabase) -> None:
    from compassai.backend.utils import get_password_hash

    admin_doc = {
        "id": "admin-user-id",
        "email": "admin@compass.ai",
        "name": "Admin User",
        "role": "admin",
        "hashed_password": get_password_hash("Admin123!"),
        "is_active": True,
        "notification_email": "admin@compass.ai",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    db.users._documents.append(admin_doc)


@pytest.fixture
def client(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> TestClient:
    upload_dir = tmp_path / "uploads"
    upload_dir.mkdir(parents=True, exist_ok=True)

    db = InMemoryDatabase()
    _seed_admin_user(db)
    _patch_database(monkeypatch, db, upload_dir)

    from compassai.backend import server as server_module

    with TestClient(server_module.app) as test_client:
        yield test_client


@pytest.fixture
def admin_headers(client: TestClient) -> Dict[str, str]:
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@compass.ai", "password": "Admin123!"},
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def seeded_client_system_assessment(client: TestClient, admin_headers: Dict[str, str]) -> Dict[str, Any]:
    client_response = client.post(
        "/api/clients",
        headers=admin_headers,
        json={
            "company_name": "Seeded Client",
            "sector": "SaaS",
            "primary_contact": {
                "name": "Seeded Contact",
                "email": "seeded@example.com",
                "title": "CTO",
            },
            "jurisdiction": "United States",
        },
    )
    assert client_response.status_code == 200
    client_doc = client_response.json()

    system_response = client.post(
        "/api/ai-systems",
        headers=admin_headers,
        json={
            "client_id": client_doc["id"],
            "system_name": "Seeded System",
            "system_type": "Chatbot",
            "system_description": "Seeded test system",
            "decision_role": "Advisory",
            "user_type": "Internal",
            "high_stakes": False,
            "intended_use": "Testing",
            "data_sources": ["CRM"],
        },
    )
    assert system_response.status_code == 200
    system_doc = system_response.json()

    assessment_response = client.post(
        "/api/assessments",
        headers=admin_headers,
        json={
            "client_id": client_doc["id"],
            "ai_system_id": system_doc["id"],
            "queries": [],
            "governance": {"scope_locked": False},
            "strict_mode": True,
        },
    )
    assert assessment_response.status_code == 200

    return {
        "client": client_doc,
        "system": system_doc,
        "assessment": assessment_response.json(),
    }
