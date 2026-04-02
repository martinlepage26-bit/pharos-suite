from __future__ import annotations

import asyncio
import io

import fitz
from docx import Document as WordDocument


def upload_binary_document(client, auth_headers, filename, body, mime_type):
    response = client.post(
        "/api/documents/upload",
        headers=auth_headers,
        files={"file": (filename, body, mime_type)},
    )
    assert response.status_code == 200
    return response.json()


def build_text_pdf_bytes(text: str) -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), text)
    payload = doc.tobytes()
    doc.close()
    return payload


def build_docx_bytes(*paragraphs: str) -> bytes:
    document = WordDocument()
    for paragraph in paragraphs:
        document.add_paragraph(paragraph)
    buffer = io.BytesIO()
    document.save(buffer)
    return buffer.getvalue()


def upload_text_document(client, auth_headers, filename="invoice.txt", body=b"Invoice INV-001\nAmount 1250.00\n"):
    return upload_binary_document(client, auth_headers, filename, body, "text/plain")


def test_root_and_pipeline_contract(client):
    root = client.get("/api/")
    pipeline = client.get("/api/idp/pipeline")

    assert root.status_code == 200
    assert pipeline.status_code == 200
    assert root.json()["message"] == "AurorAI IDP API"
    assert isinstance(root.json()["pipeline"], list)
    assert root.json()["capabilities"]["supported_upload_extensions"] == [".docx", ".pdf", ".txt"]
    assert pipeline.json()["golden_rules"]


def test_categories_and_empty_stats(client):
    categories = client.get("/api/categories")
    stats = client.get("/api/stats")

    assert categories.status_code == 200
    assert stats.status_code == 200
    assert "Academic Papers" in categories.json()["categories"]
    assert stats.json()["total_documents"] == 0
    assert any(item["category"] == "Invoices/Receipts" for item in stats.json()["stats"])


def test_auth_boundary_for_protected_routes(client):
    upload = client.post(
        "/api/documents/upload",
        files={"file": ("invoice.txt", b"Invoice INV-001\n", "text/plain")},
    )
    documents = client.get("/api/documents")
    reading_lists = client.get("/api/reading-lists")

    assert upload.status_code == 401
    assert documents.status_code == 401
    assert reading_lists.status_code == 401


def test_upload_rejects_unsupported_document_types(client, auth_headers):
    doc = client.post(
        "/api/documents/upload",
        headers=auth_headers,
        files={"file": ("draft.doc", b"fake-doc", "application/msword")},
    )
    csv = client.post(
        "/api/documents/upload",
        headers=auth_headers,
        files={"file": ("sheet.csv", b"a,b\n1,2\n", "text/csv")},
    )

    assert doc.status_code == 400
    assert "Legacy DOC upload is not supported" in doc.json()["detail"]
    assert csv.status_code == 400
    assert "not supported" in csv.json()["detail"]


def test_upload_accepts_pdf_with_text(client, auth_headers):
    payload = upload_binary_document(
        client,
        auth_headers,
        "report.pdf",
        build_text_pdf_bytes("Invoice INV-PDF\nAmount 250.00\n"),
        "application/pdf",
    )

    assert payload["text_preview"].startswith("Invoice INV-PDF")
    assert payload["ingestion_details"]["text_source"] == "pdf_text"
    assert payload["ingestion_details"]["ocr_status"] == "not_needed"


def test_upload_accepts_docx_and_keeps_pipeline_flow(client, auth_headers):
    uploaded = upload_binary_document(
        client,
        auth_headers,
        "invoice.docx",
        build_docx_bytes("Invoice INV-DOCX", "Amount 310.00"),
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )

    assert uploaded["text_preview"].startswith("Invoice INV-DOCX")
    assert uploaded["ingestion_details"]["text_source"] == "docx"

    categorize = client.post(f"/api/documents/{uploaded['id']}/categorize", headers=auth_headers)
    assert categorize.status_code == 200
    assert categorize.json()["document_type"] == "invoice"


def test_pdf_upload_uses_mocked_ocr_fallback_when_text_is_insufficient(client, auth_headers, aurorai_module, monkeypatch):
    monkeypatch.setattr(aurorai_module, "extract_pdf_text", lambda *_args, **_kwargs: ("x", 1))
    monkeypatch.setattr(
        aurorai_module,
        "run_pdf_ocr",
        lambda *_args, **_kwargs: {
            "text": "Invoice INV-OCR\nAmount 88.00",
            "ocr_used": True,
            "ocr_status": "performed",
            "ocr_reason": "available",
            "warnings": [],
            "text_quality": "usable",
        },
    )

    uploaded = upload_binary_document(
        client,
        auth_headers,
        "scan.pdf",
        b"%PDF-mocked",
        "application/pdf",
    )

    assert uploaded["text_preview"].startswith("Invoice INV-OCR")
    assert uploaded["ingestion_details"]["text_source"] == "pdf_ocr"
    assert uploaded["ingestion_details"]["ocr_status"] == "performed"


def test_pdf_upload_and_categorize_surface_ocr_unavailable_state(client, auth_headers, aurorai_module, monkeypatch):
    monkeypatch.setattr(aurorai_module, "extract_pdf_text", lambda *_args, **_kwargs: ("", 1))
    monkeypatch.setattr(
        aurorai_module,
        "run_pdf_ocr",
        lambda *_args, **_kwargs: {
            "text": "",
            "ocr_used": False,
            "ocr_status": "required_unavailable",
            "ocr_reason": "tesseract_binary_missing",
            "warnings": ["OCR required but unavailable: tesseract_binary_missing"],
            "text_quality": "none",
        },
    )

    uploaded = upload_binary_document(
        client,
        auth_headers,
        "scan-needs-ocr.pdf",
        b"%PDF-mocked",
        "application/pdf",
    )

    assert uploaded["current_state"] == "uploaded_requires_ocr"
    assert uploaded["ingestion_details"]["ocr_status"] == "required_unavailable"

    categorize = client.post(f"/api/documents/{uploaded['id']}/categorize", headers=auth_headers)
    assert categorize.status_code == 503
    assert "OCR is required" in categorize.json()["detail"]


def test_categorize_summary_and_citations_happy_path(client, auth_headers):
    uploaded = upload_text_document(client, auth_headers)
    document_id = uploaded["id"]

    categorize = client.post(f"/api/documents/{document_id}/categorize", headers=auth_headers)
    summary = client.post(f"/api/documents/{document_id}/summary", headers=auth_headers)
    citations = client.post(f"/api/documents/{document_id}/citations", headers=auth_headers)

    assert categorize.status_code == 200
    assert categorize.json()["suggested_category"] == "Invoices/Receipts"
    assert categorize.json()["confidence"] == 0.91

    assert summary.status_code == 200
    assert summary.json()["summary"] == "Summary for Invoice INV-001"

    assert citations.status_code == 200
    assert citations.json()["citations"] == ["Citation from Invoice INV-001"]


def test_upload_extract_evidence_and_handoff_flow(client, auth_headers):
    uploaded = upload_text_document(client, auth_headers)
    document_id = uploaded["id"]

    extract = client.post(f"/api/documents/{document_id}/extract", headers=auth_headers)
    assert extract.status_code == 200
    assert extract.json()["document_type"] == "invoice"
    assert extract.json()["data"]["fields"]["invoice_number"]["value"] == "INV-001"

    evidence = client.post(
        f"/api/documents/{document_id}/evidence-package",
        headers=auth_headers,
        json={"usecase_id": "usecase-123", "producer": "aurorai", "artifact_type": "evidence_package"},
    )
    assert evidence.status_code == 200
    assert evidence.json()["usecase_id"] == "usecase-123"
    assert evidence.json()["payload"]["evidence_package"]["document_metadata"]["original_filename"] == "invoice.txt"
    assert evidence.json()["payload"]["evidence_package"]["extraction_results"]["fields"]["invoice_number"]["value"] == "INV-001"

    handoff = client.post(
        f"/api/documents/{document_id}/handoff-to-compassai",
        headers=auth_headers,
        json={"usecase_id": "usecase-123", "producer": "aurorai", "artifact_type": "evidence_package"},
    )
    assert handoff.status_code == 200
    assert handoff.json()["compassai_response"]["accepted"] is True
    assert handoff.json()["compassai_response"]["usecase_id"] == "usecase-123"


def test_document_list_search_update_download_and_delete_flow(client, auth_headers):
    uploaded = upload_text_document(client, auth_headers, filename="thesis.txt", body=b"Invoice INV-777\nTotal 10.00\n")
    document_id = uploaded["id"]

    documents = client.get("/api/documents", headers=auth_headers)
    search = client.get("/api/documents?search=inv-777", headers=auth_headers)
    single = client.get(f"/api/documents/{document_id}", headers=auth_headers)
    update = client.patch(
        f"/api/documents/{document_id}",
        headers=auth_headers,
        json={"category": "My Writings & Publications", "tags": ["priority", "research"]},
    )
    download = client.get(f"/api/documents/{document_id}/download", headers=auth_headers)
    delete = client.delete(f"/api/documents/{document_id}", headers=auth_headers)
    missing = client.get(f"/api/documents/{document_id}", headers=auth_headers)

    assert documents.status_code == 200
    assert len(documents.json()["documents"]) == 1

    assert search.status_code == 200
    assert search.json()["documents"][0]["id"] == document_id

    assert single.status_code == 200
    assert single.json()["original_filename"] == "thesis.txt"

    assert update.status_code == 200
    assert update.json()["category"] == "My Writings & Publications"
    assert update.json()["is_academic"] is True
    assert update.json()["tags"] == ["priority", "research"]

    assert download.status_code == 200
    assert download.content == b"Invoice INV-777\nTotal 10.00\n"
    assert 'filename="thesis.txt"' in download.headers["content-disposition"]

    assert delete.status_code == 200
    assert delete.json()["id"] == document_id
    assert missing.status_code == 404


def test_bulk_categorize_handles_success_and_missing_documents(client, auth_headers):
    uploaded = upload_text_document(client, auth_headers)
    document_id = uploaded["id"]

    response = client.post(
        "/api/documents/bulk-categorize",
        headers=auth_headers,
        json={"document_ids": [document_id, "missing-doc"]},
    )

    assert response.status_code == 200
    results = response.json()["results"]
    assert results[0]["document_id"] == document_id
    assert results[0]["suggested_category"] == "Invoices/Receipts"
    assert results[1] == {"document_id": "missing-doc", "error": "Not found"}


def test_missing_document_errors_across_route_groups(client, auth_headers):
    categorize = client.post("/api/documents/missing/categorize", headers=auth_headers)
    summary = client.post("/api/documents/missing/summary", headers=auth_headers)
    citations = client.post("/api/documents/missing/citations", headers=auth_headers)
    get_document = client.get("/api/documents/missing", headers=auth_headers)
    delete_document = client.delete("/api/documents/missing", headers=auth_headers)
    get_reading_list = client.get("/api/reading-lists/missing", headers=auth_headers)

    assert categorize.status_code == 404
    assert summary.status_code == 404
    assert citations.status_code == 404
    assert get_document.status_code == 404
    assert delete_document.status_code == 404
    assert get_reading_list.status_code == 404


def test_ai_categorize_document_falls_back_to_heuristic_without_llm_key(monkeypatch):
    import server

    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.delenv("PHAROS_LLM_KEY", raising=False)

    result = asyncio.run(server.ai_categorize_document("Invoice INV-555\nTotal amount $45.00"))

    assert result["category"] == "Invoices/Receipts"
    assert result["document_type"] == "invoice"
    assert result["confidence"] == 0.42


def test_validation_errors_for_bulk_categorize_and_reading_lists(client, auth_headers):
    bulk = client.post("/api/documents/bulk-categorize", headers=auth_headers, json={})
    reading_list = client.post("/api/reading-lists", headers=auth_headers, json={"description": "Missing name"})

    assert bulk.status_code == 422
    assert reading_list.status_code == 422


def test_reading_list_crud_and_membership_flow(client, auth_headers):
    uploaded = upload_text_document(client, auth_headers)
    document_id = uploaded["id"]

    created = client.post(
        "/api/reading-lists",
        headers=auth_headers,
        json={"name": "Board packet", "description": "Q1 governance review"},
    )
    assert created.status_code == 200
    list_id = created.json()["id"]

    add_document = client.post(f"/api/reading-lists/{list_id}/documents/{document_id}", headers=auth_headers)
    lists = client.get("/api/reading-lists", headers=auth_headers)
    detail = client.get(f"/api/reading-lists/{list_id}", headers=auth_headers)
    remove_document = client.delete(f"/api/reading-lists/{list_id}/documents/{document_id}", headers=auth_headers)
    delete_list = client.delete(f"/api/reading-lists/{list_id}", headers=auth_headers)
    missing_after_delete = client.get(f"/api/reading-lists/{list_id}", headers=auth_headers)
    document_after_remove = client.get(f"/api/documents/{document_id}", headers=auth_headers)

    assert add_document.status_code == 200
    assert lists.status_code == 200
    assert lists.json()["reading_lists"][0]["document_count"] == 1

    assert detail.status_code == 200
    assert detail.json()["documents"][0]["id"] == document_id

    assert remove_document.status_code == 200
    assert delete_list.status_code == 200
    assert missing_after_delete.status_code == 404
    assert document_after_remove.status_code == 200
    assert document_after_remove.json()["reading_list_id"] is None
