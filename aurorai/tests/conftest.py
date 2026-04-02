from __future__ import annotations

import copy
import os
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

import pytest
from fastapi.testclient import TestClient


REPO_ROOT = Path(__file__).resolve().parents[2]
AURORAI_ROOT = Path(__file__).resolve().parents[1]
if str(AURORAI_ROOT) not in sys.path:
    sys.path.insert(0, str(AURORAI_ROOT))
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
os.environ.setdefault("DB_NAME", "aurorai_test")
os.environ.setdefault("AURORAI_API_TOKEN", "aurorai-local-dev-token")
os.environ.setdefault("COMPASSAI_INGEST_TOKEN", "compassai-local-ingest-token")


def _matches_query(document: Dict[str, Any], query: Dict[str, Any]) -> bool:
    if "$or" in query:
        branches = query["$or"]
        if not any(_matches_query(document, branch) for branch in branches):
            return False

    for key, expected in query.items():
        if key == "$or":
            continue
        actual = document.get(key)
        if isinstance(expected, dict):
            if "$regex" in expected:
                needle = expected["$regex"]
                haystack = str(actual or "")
                if expected.get("$options") == "i":
                    if needle.lower() not in haystack.lower():
                        return False
                elif needle not in haystack:
                    return False
                continue
        if document.get(key) != expected:
            return False
    return True


class InMemoryCursor:
    def __init__(self, documents: Iterable[Dict[str, Any]]):
        self._documents = [copy.deepcopy(document) for document in documents]
        self._limit: Optional[int] = None
        self._sort_field: Optional[str] = None
        self._sort_desc = False

    def sort(self, field: str, direction: int):
        self._sort_field = field
        self._sort_desc = direction < 0
        self._documents.sort(key=lambda item: item.get(field, ""), reverse=self._sort_desc)
        return self

    def limit(self, count: int):
        self._limit = count
        return self

    async def to_list(self, count: int) -> List[Dict[str, Any]]:
        limit = self._limit if self._limit is not None else count
        return [copy.deepcopy(item) for item in self._documents[:limit]]


class InMemoryCollection:
    def __init__(self, name: str):
        self.name = name
        self._documents: List[Dict[str, Any]] = []

    async def insert_one(self, document: Dict[str, Any]):
        self._documents.append(copy.deepcopy(document))
        return None

    async def find_one(self, query: Dict[str, Any], projection: Optional[Dict[str, Any]] = None):
        for document in self._documents:
            if _matches_query(document, query):
                stored = copy.deepcopy(document)
                if projection and projection.get("_id") == 0:
                    stored.pop("_id", None)
                return stored
        return None

    def find(self, query: Optional[Dict[str, Any]] = None, projection: Optional[Dict[str, Any]] = None):
        query = query or {}
        matched = []
        for document in self._documents:
            if _matches_query(document, query):
                stored = copy.deepcopy(document)
                if projection and projection.get("_id") == 0:
                    stored.pop("_id", None)
                matched.append(stored)
        return InMemoryCursor(matched)

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        for document in self._documents:
            if _matches_query(document, query):
                for key, value in update.get("$set", {}).items():
                    document[key] = copy.deepcopy(value)
                return None
        return None

    async def update_many(self, query: Dict[str, Any], update: Dict[str, Any]):
        for document in self._documents:
            if _matches_query(document, query):
                for key, value in update.get("$set", {}).items():
                    document[key] = copy.deepcopy(value)
        return None

    async def delete_one(self, query: Dict[str, Any]):
        for index, document in enumerate(self._documents):
            if _matches_query(document, query):
                self._documents.pop(index)
                return None
        return None

    async def count_documents(self, query: Dict[str, Any]) -> int:
        return sum(1 for document in self._documents if _matches_query(document, query))

    def aggregate(self, pipeline: List[Dict[str, Any]]):
        documents = [copy.deepcopy(document) for document in self._documents]
        for stage in pipeline:
            if "$group" in stage:
                spec = stage["$group"]
                group_key = spec["_id"].lstrip("$")
                grouped: Dict[Any, int] = {}
                for document in documents:
                    key = document.get(group_key)
                    grouped[key] = grouped.get(key, 0) + 1
                documents = [{"_id": key, "count": value} for key, value in grouped.items()]
            elif "$sort" in stage:
                [(field, direction)] = stage["$sort"].items()
                documents.sort(key=lambda item: item.get(field, 0), reverse=direction < 0)
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


@pytest.fixture()
def aurorai_module(monkeypatch: pytest.MonkeyPatch, tmp_path: Path):
    import importlib

    server_module = importlib.import_module("server")
    db = InMemoryDatabase()

    monkeypatch.setattr(server_module, "db", db)
    monkeypatch.setattr(server_module, "client", DummyMotorClient())
    monkeypatch.setattr(server_module, "UPLOAD_DIR", tmp_path / "uploads")
    server_module.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    async def fake_extract_fields(_: str):
        return {
            "document_type": "invoice",
            "fields": {
                "invoice_number": {"value": "INV-001", "confidence": 0.98},
                "total_amount": {"value": "1250.00", "confidence": 0.95},
            },
            "recommended_next_actions": ["Review totals"],
        }

    async def fake_categorize_document(text: str):
        lowered = text.lower()
        if "invoice" in lowered:
            return {
                "category": "Invoices/Receipts",
                "document_type": "invoice",
                "confidence": 0.91,
                "rationale": "Invoice markers detected in the text preview.",
            }
        return {
            "category": "Reports",
            "document_type": "report",
            "confidence": 0.82,
            "rationale": "Defaulted to report for non-invoice fixtures.",
        }

    async def fake_generate_summary(text: str):
        return f"Summary for {text.splitlines()[0].strip()}"

    async def fake_extract_citations(text: str):
        first_line = text.splitlines()[0].strip()
        return [f"Citation from {first_line}"]

    async def fake_post_json(url: str, payload: Dict[str, Any], headers: Dict[str, str]):
        return {
            "status_code": 200,
            "body": {
                "accepted": True,
                "target_url": url,
                "usecase_id": payload["usecase_id"],
                "authorized": headers.get("Authorization", "").startswith("Bearer "),
            },
        }

    monkeypatch.setattr(server_module, "ai_extract_fields", fake_extract_fields)
    monkeypatch.setattr(server_module, "ai_categorize_document", fake_categorize_document)
    monkeypatch.setattr(server_module, "ai_generate_summary", fake_generate_summary)
    monkeypatch.setattr(server_module, "ai_extract_citations", fake_extract_citations)
    monkeypatch.setattr(server_module, "post_json", fake_post_json)
    return server_module


@pytest.fixture()
def client(aurorai_module):
    with TestClient(aurorai_module.app) as test_client:
        yield test_client


@pytest.fixture()
def auth_headers():
    return {"Authorization": "Bearer aurorai-local-dev-token"}
