from __future__ import annotations

import json
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas

from compassai.backend.ledger_db import get_conn, new_id, utc_now_iso

router = APIRouter(prefix="/ledger", tags=["Ledger"])


class LedgerClientCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    province: str = "QC"
    postal_code: Optional[str] = None
    country: str = "CA"
    notes: Optional[str] = None


class LedgerEngagementCreate(BaseModel):
    client_id: str
    title: str
    sector: Optional[str] = None
    status: str = "active"
    package_code: str = "starter"
    base_price_cents: int
    currency: str = "CAD"
    m_sector: float = 1.0
    m_urgency: float = 1.0
    m_scope: float = 1.0
    m_risk: float = 1.0
    m_client_size: float = 1.0
    urgency_level: Optional[str] = None
    scope_size: Optional[str] = None
    risk_level: Optional[str] = None
    client_size_band: Optional[str] = None
    notes: Optional[str] = None


class RunDeliverableInput(BaseModel):
    kind: str
    title: Optional[str] = None
    file_path: str
    notes: Optional[str] = None


class LedgerRunCreate(BaseModel):
    engagement_id: str
    company_name: Optional[str] = None
    system_name: Optional[str] = None
    score: Optional[float] = None
    risk_tier: Optional[str] = None
    output_dir: str
    source_assessment_id: Optional[str] = None
    engine_version: Optional[str] = None
    input_json: Optional[Dict[str, Any]] = None
    started_at: Optional[str] = None
    finished_at: Optional[str] = None
    deliverables: List[RunDeliverableInput] = Field(default_factory=list)


class LedgerTimeEntryCreate(BaseModel):
    engagement_id: str
    work_date: str
    minutes: int
    category: Optional[str] = None
    description: Optional[str] = None
    billable: bool = True
    hourly_rate_cents: Optional[int] = None


class LedgerExpenseCreate(BaseModel):
    engagement_id: Optional[str] = None
    spend_date: str
    vendor: Optional[str] = None
    category: str
    description: Optional[str] = None
    amount_cents: int
    currency: str = "CAD"
    gst_cents: int = 0
    qst_cents: int = 0
    receipt_path: Optional[str] = None


class InvoiceLineInput(BaseModel):
    kind: str  # PACKAGE|ADDON|TIME|EXPENSE|CUSTOM
    code: Optional[str] = None
    description: str
    quantity: float = 1.0
    unit_price_cents: int = 0
    taxable: bool = True


class LedgerInvoiceGenerate(BaseModel):
    client_id: str
    engagement_id: Optional[str] = None
    issue_date: str
    due_date: Optional[str] = None
    notes: Optional[str] = None

    include_engagement_price: bool = True
    include_unbilled_time: bool = False
    include_unbilled_expenses: bool = False

    time_from: Optional[str] = None
    time_to: Optional[str] = None
    expense_from: Optional[str] = None
    expense_to: Optional[str] = None

    line_items: List[InvoiceLineInput] = Field(default_factory=list)


class LedgerPaymentCreate(BaseModel):
    invoice_id: str
    received_date: str
    amount_cents: int
    method: Optional[str] = None
    reference: Optional[str] = None


class TaxProfileUpdate(BaseModel):
    is_gst_registered: Optional[bool] = None
    is_qst_registered: Optional[bool] = None
    gst_number: Optional[str] = None
    qst_number: Optional[str] = None
    gst_rate: Optional[float] = None
    qst_rate: Optional[float] = None
    effective_date: Optional[str] = None
    business_name: Optional[str] = None
    business_address: Optional[str] = None


def _row_to_dict(row: Any) -> Dict[str, Any]:
    return dict(row) if row is not None else {}


def _today_iso() -> str:
    return date.today().isoformat()


def _next_invoice_number(conn) -> str:
    current_year = datetime.now(timezone.utc).year
    row = conn.execute(
        "SELECT invoice_number FROM invoices WHERE invoice_number LIKE ? ORDER BY invoice_number DESC LIMIT 1",
        (f"INV-{current_year}-%",),
    ).fetchone()

    if not row:
        return f"INV-{current_year}-0001"

    invoice_number = row["invoice_number"]
    try:
        seq = int(invoice_number.split("-")[-1]) + 1
    except (ValueError, IndexError):
        seq = 1

    return f"INV-{current_year}-{seq:04d}"


def _money(cents: int) -> str:
    return f"${cents / 100:,.2f}"


def _render_invoice_pdf(invoice: Dict[str, Any], client: Dict[str, Any], line_items: List[Dict[str, Any]], tax_profile: Dict[str, Any]) -> str:
    invoice_dir = Path(__file__).resolve().parent.parent / "ledger_data" / "invoices"
    invoice_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = invoice_dir / f"{invoice['invoice_number']}.pdf"

    c = canvas.Canvas(str(pdf_path), pagesize=LETTER)
    width, height = LETTER

    y = height - 50
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, tax_profile.get("business_name") or "Consulting Services")
    y -= 18

    c.setFont("Helvetica", 10)
    business_address = tax_profile.get("business_address")
    if business_address:
        c.drawString(50, y, business_address)
        y -= 14

    y -= 6
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, f"Invoice {invoice['invoice_number']}")
    y -= 20

    c.setFont("Helvetica", 10)
    c.drawString(50, y, f"Issue date: {invoice['issue_date']}")
    y -= 14
    if invoice.get("due_date"):
        c.drawString(50, y, f"Due date: {invoice['due_date']}")
        y -= 14

    y -= 6
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "Bill to")
    y -= 14

    c.setFont("Helvetica", 10)
    c.drawString(50, y, client.get("name", "Client"))
    y -= 14
    if client.get("email"):
        c.drawString(50, y, client["email"])
        y -= 14

    y -= 18
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, "Description")
    c.drawString(430, y, "Amount")
    y -= 10
    c.line(50, y, 560, y)
    y -= 14

    c.setFont("Helvetica", 10)
    for item in line_items:
        c.drawString(50, y, item["description"][:78])
        c.drawRightString(560, y, _money(item["line_total_cents"]))
        y -= 14
        if y < 130:
            c.showPage()
            y = height - 60
            c.setFont("Helvetica", 10)

    y -= 10
    c.line(50, y, 560, y)
    y -= 16

    c.setFont("Helvetica-Bold", 10)
    c.drawRightString(560, y, f"Subtotal: {_money(invoice['subtotal_cents'])}")
    y -= 14
    if invoice["gst_cents"] > 0:
        c.drawRightString(560, y, f"GST: {_money(invoice['gst_cents'])}")
        y -= 14
    if invoice["qst_cents"] > 0:
        c.drawRightString(560, y, f"QST: {_money(invoice['qst_cents'])}")
        y -= 14

    c.setFont("Helvetica-Bold", 12)
    c.drawRightString(560, y, f"Total: {_money(invoice['total_cents'])}")

    c.setFont("Helvetica", 9)
    if tax_profile.get("gst_number"):
        c.drawString(50, 60, f"GST #: {tax_profile['gst_number']}")
    if tax_profile.get("qst_number"):
        c.drawString(220, 60, f"QST #: {tax_profile['qst_number']}")

    c.save()
    return str(pdf_path)


@router.get("/health")
def ledger_health():
    return {"status": "ok", "module": "ledger"}


@router.post("/clients")
def create_client(payload: LedgerClientCreate):
    now = utc_now_iso()
    client_id = new_id("cli")

    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO clients (id, name, email, phone, address_line1, address_line2, city, province, postal_code, country, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                client_id,
                payload.name,
                payload.email,
                payload.phone,
                payload.address_line1,
                payload.address_line2,
                payload.city,
                payload.province,
                payload.postal_code,
                payload.country,
                payload.notes,
                now,
                now,
            ),
        )
        row = conn.execute("SELECT * FROM clients WHERE id = ?", (client_id,)).fetchone()

    return _row_to_dict(row)


@router.get("/clients")
def list_clients(limit: int = Query(default=100, ge=1, le=1000)):
    with get_conn() as conn:
        rows = conn.execute("SELECT * FROM clients ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()
    return [_row_to_dict(r) for r in rows]


@router.post("/engagements")
def create_engagement(payload: LedgerEngagementCreate):
    now = utc_now_iso()
    engagement_id = new_id("eng")

    with get_conn() as conn:
        client = conn.execute("SELECT id FROM clients WHERE id = ?", (payload.client_id,)).fetchone()
        if not client:
            raise HTTPException(status_code=404, detail="client_id not found")

        conn.execute(
            """
            INSERT INTO engagements (
                id, client_id, title, sector, status, package_code, base_price_cents, currency,
                m_sector, m_urgency, m_scope, m_risk, m_client_size,
                urgency_level, scope_size, risk_level, client_size_band,
                notes, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                engagement_id,
                payload.client_id,
                payload.title,
                payload.sector,
                payload.status,
                payload.package_code,
                payload.base_price_cents,
                payload.currency,
                payload.m_sector,
                payload.m_urgency,
                payload.m_scope,
                payload.m_risk,
                payload.m_client_size,
                payload.urgency_level,
                payload.scope_size,
                payload.risk_level,
                payload.client_size_band,
                payload.notes,
                now,
                now,
            ),
        )
        row = conn.execute("SELECT * FROM engagements WHERE id = ?", (engagement_id,)).fetchone()

    return _row_to_dict(row)


@router.get("/engagements")
def list_engagements(limit: int = Query(default=200, ge=1, le=2000)):
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT e.*, c.name AS client_name
            FROM engagements e
            JOIN clients c ON c.id = e.client_id
            ORDER BY e.created_at DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
    return [_row_to_dict(r) for r in rows]


@router.post("/assessments/run")
def create_run(payload: LedgerRunCreate):
    run_id = new_id("run")
    now = utc_now_iso()
    started_at = payload.started_at or now
    finished_at = payload.finished_at or now

    with get_conn() as conn:
        engagement = conn.execute("SELECT id FROM engagements WHERE id = ?", (payload.engagement_id,)).fetchone()
        if not engagement:
            raise HTTPException(status_code=404, detail="engagement_id not found")

        conn.execute(
            """
            INSERT INTO runs (
                id, engagement_id, company_name, system_name, started_at, finished_at,
                score, risk_tier, output_dir, source_assessment_id, engine_version,
                input_json, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                run_id,
                payload.engagement_id,
                payload.company_name,
                payload.system_name,
                started_at,
                finished_at,
                payload.score,
                payload.risk_tier,
                payload.output_dir,
                payload.source_assessment_id,
                payload.engine_version,
                json.dumps(payload.input_json, ensure_ascii=False) if payload.input_json is not None else None,
                now,
            ),
        )

        for item in payload.deliverables:
            conn.execute(
                """
                INSERT INTO deliverables (id, engagement_id, run_id, kind, title, file_path, notes, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    new_id("deliv"),
                    payload.engagement_id,
                    run_id,
                    item.kind,
                    item.title,
                    item.file_path,
                    item.notes,
                    now,
                ),
            )

        conn.execute(
            "INSERT INTO audit_events (occurred_at, event_type, payload_json) VALUES (?, ?, ?)",
            (
                now,
                "RUN_CREATED",
                json.dumps(
                    {
                        "run_id": run_id,
                        "engagement_id": payload.engagement_id,
                        "score": payload.score,
                        "risk_tier": payload.risk_tier,
                    },
                    ensure_ascii=False,
                ),
            ),
        )

        row = conn.execute("SELECT * FROM runs WHERE id = ?", (run_id,)).fetchone()

    return _row_to_dict(row)


@router.get("/runs/{run_id}")
def get_run(run_id: str):
    with get_conn() as conn:
        run = conn.execute("SELECT * FROM runs WHERE id = ?", (run_id,)).fetchone()
        if not run:
            raise HTTPException(status_code=404, detail="run not found")

        deliverables = conn.execute(
            "SELECT * FROM deliverables WHERE run_id = ? ORDER BY created_at ASC",
            (run_id,),
        ).fetchall()

    output = _row_to_dict(run)
    output["deliverables"] = [_row_to_dict(r) for r in deliverables]
    return output


@router.get("/engagements/{engagement_id}/runs")
def list_runs_for_engagement(engagement_id: str, limit: int = Query(default=100, ge=1, le=1000)):
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM runs WHERE engagement_id = ? ORDER BY created_at DESC LIMIT ?",
            (engagement_id, limit),
        ).fetchall()
    return [_row_to_dict(r) for r in rows]


@router.get("/engagements/{engagement_id}/deliverables")
def list_deliverables_for_engagement(engagement_id: str, limit: int = Query(default=200, ge=1, le=1000)):
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM deliverables WHERE engagement_id = ? ORDER BY created_at DESC LIMIT ?",
            (engagement_id, limit),
        ).fetchall()
    return [_row_to_dict(r) for r in rows]


@router.post("/time-entries")
def create_time_entry(payload: LedgerTimeEntryCreate):
    time_id = new_id("time")
    now = utc_now_iso()

    with get_conn() as conn:
        engagement = conn.execute("SELECT id FROM engagements WHERE id = ?", (payload.engagement_id,)).fetchone()
        if not engagement:
            raise HTTPException(status_code=404, detail="engagement_id not found")

        conn.execute(
            """
            INSERT INTO time_entries (id, engagement_id, work_date, minutes, category, description, billable, hourly_rate_cents, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                time_id,
                payload.engagement_id,
                payload.work_date,
                payload.minutes,
                payload.category,
                payload.description,
                1 if payload.billable else 0,
                payload.hourly_rate_cents,
                now,
            ),
        )
        row = conn.execute("SELECT * FROM time_entries WHERE id = ?", (time_id,)).fetchone()

    return _row_to_dict(row)


@router.post("/expenses")
def create_expense(payload: LedgerExpenseCreate):
    expense_id = new_id("exp")
    now = utc_now_iso()

    with get_conn() as conn:
        if payload.engagement_id:
            engagement = conn.execute("SELECT id FROM engagements WHERE id = ?", (payload.engagement_id,)).fetchone()
            if not engagement:
                raise HTTPException(status_code=404, detail="engagement_id not found")

        conn.execute(
            """
            INSERT INTO expenses (id, engagement_id, spend_date, vendor, category, description, amount_cents, currency, gst_cents, qst_cents, receipt_path, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                expense_id,
                payload.engagement_id,
                payload.spend_date,
                payload.vendor,
                payload.category,
                payload.description,
                payload.amount_cents,
                payload.currency,
                payload.gst_cents,
                payload.qst_cents,
                payload.receipt_path,
                now,
            ),
        )
        row = conn.execute("SELECT * FROM expenses WHERE id = ?", (expense_id,)).fetchone()

    return _row_to_dict(row)


@router.get("/tax/profile")
def get_tax_profile():
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM tax_profile WHERE id = 1").fetchone()
    return _row_to_dict(row)


@router.put("/tax/profile")
def update_tax_profile(payload: TaxProfileUpdate):
    update = payload.model_dump(exclude_unset=True)
    if not update:
        raise HTTPException(status_code=400, detail="No fields to update")

    updates = []
    values = []
    for key, value in update.items():
        if key in {"is_gst_registered", "is_qst_registered"} and value is not None:
            value = 1 if value else 0
        updates.append(f"{key} = ?")
        values.append(value)

    updates.append("updated_at = ?")
    values.append(utc_now_iso())
    values.append(1)

    with get_conn() as conn:
        conn.execute(f"UPDATE tax_profile SET {', '.join(updates)} WHERE id = ?", values)
        row = conn.execute("SELECT * FROM tax_profile WHERE id = 1").fetchone()

    return _row_to_dict(row)


@router.post("/invoices/generate")
def generate_invoice(payload: LedgerInvoiceGenerate):
    invoice_id = new_id("inv")
    now = utc_now_iso()

    with get_conn() as conn:
        client = conn.execute("SELECT * FROM clients WHERE id = ?", (payload.client_id,)).fetchone()
        if not client:
            raise HTTPException(status_code=404, detail="client_id not found")

        if payload.engagement_id:
            engagement = conn.execute("SELECT * FROM engagements WHERE id = ?", (payload.engagement_id,)).fetchone()
            if not engagement:
                raise HTTPException(status_code=404, detail="engagement_id not found")
        else:
            engagement = None

        invoice_number = _next_invoice_number(conn)

        working_items: List[Dict[str, Any]] = []

        if payload.include_engagement_price and engagement:
            working_items.append(
                {
                    "kind": "PACKAGE",
                    "code": engagement["package_code"],
                    "description": f"{engagement['package_code'].title()} package ({engagement['title']})",
                    "quantity": 1.0,
                    "unit_price_cents": engagement["base_price_cents"],
                    "taxable": 1,
                    "line_total_cents": engagement["base_price_cents"],
                    "source_id": None,
                }
            )

        for item in payload.line_items:
            line_total = int(round(item.quantity * item.unit_price_cents))
            working_items.append(
                {
                    "kind": item.kind,
                    "code": item.code,
                    "description": item.description,
                    "quantity": item.quantity,
                    "unit_price_cents": item.unit_price_cents,
                    "taxable": 1 if item.taxable else 0,
                    "line_total_cents": line_total,
                    "source_id": None,
                }
            )

        if payload.include_unbilled_time and payload.engagement_id:
            date_from = payload.time_from or "0001-01-01"
            date_to = payload.time_to or _today_iso()
            time_rows = conn.execute(
                """
                SELECT * FROM time_entries
                WHERE engagement_id = ?
                  AND billable = 1
                  AND billed_invoice_id IS NULL
                  AND work_date >= ?
                  AND work_date <= ?
                ORDER BY work_date ASC
                """,
                (payload.engagement_id, date_from, date_to),
            ).fetchall()

            for row in time_rows:
                hourly_rate = row["hourly_rate_cents"] if row["hourly_rate_cents"] is not None else 20000
                hours = row["minutes"] / 60.0
                line_total = int(round(hours * hourly_rate))
                working_items.append(
                    {
                        "kind": "TIME",
                        "code": row["category"] or "time",
                        "description": f"{row['category'] or 'Billable time'} ({hours:.2f}h) {row['work_date']}",
                        "quantity": hours,
                        "unit_price_cents": hourly_rate,
                        "taxable": 1,
                        "line_total_cents": line_total,
                        "source_id": row["id"],
                        "source_type": "time",
                    }
                )

        if payload.include_unbilled_expenses:
            date_from = payload.expense_from or "0001-01-01"
            date_to = payload.expense_to or _today_iso()

            if payload.engagement_id:
                exp_rows = conn.execute(
                    """
                    SELECT * FROM expenses
                    WHERE engagement_id = ?
                      AND billed_invoice_id IS NULL
                      AND spend_date >= ?
                      AND spend_date <= ?
                    ORDER BY spend_date ASC
                    """,
                    (payload.engagement_id, date_from, date_to),
                ).fetchall()
            else:
                exp_rows = conn.execute(
                    """
                    SELECT * FROM expenses
                    WHERE billed_invoice_id IS NULL
                      AND spend_date >= ?
                      AND spend_date <= ?
                    ORDER BY spend_date ASC
                    """,
                    (date_from, date_to),
                ).fetchall()

            for row in exp_rows:
                description = f"Expense: {row['vendor'] or 'Vendor'}"
                if row["description"]:
                    description = f"{description} - {row['description']}"
                working_items.append(
                    {
                        "kind": "EXPENSE",
                        "code": row["category"],
                        "description": description,
                        "quantity": 1.0,
                        "unit_price_cents": row["amount_cents"],
                        "taxable": 1,
                        "line_total_cents": row["amount_cents"],
                        "source_id": row["id"],
                        "source_type": "expense",
                    }
                )

        if not working_items:
            raise HTTPException(status_code=400, detail="No invoice line items were generated")

        subtotal_cents = sum(int(item["line_total_cents"]) for item in working_items)
        taxable_cents = sum(int(item["line_total_cents"]) for item in working_items if item["taxable"] == 1)

        tax_profile = conn.execute("SELECT * FROM tax_profile WHERE id = 1").fetchone()
        gst_rate = float(tax_profile["gst_rate"]) if tax_profile["is_gst_registered"] else 0.0
        qst_rate = float(tax_profile["qst_rate"]) if tax_profile["is_qst_registered"] else 0.0

        gst_cents = int(round(taxable_cents * gst_rate))
        qst_cents = int(round(taxable_cents * qst_rate))
        total_cents = subtotal_cents + gst_cents + qst_cents

        conn.execute(
            """
            INSERT INTO invoices (
                id, invoice_number, client_id, engagement_id, issue_date, due_date, status,
                currency, subtotal_cents, discount_cents, gst_rate, qst_rate, gst_cents,
                qst_cents, total_cents, notes, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                invoice_id,
                invoice_number,
                payload.client_id,
                payload.engagement_id,
                payload.issue_date,
                payload.due_date,
                "draft",
                tax_profile["default_currency"],
                subtotal_cents,
                0,
                gst_rate,
                qst_rate,
                gst_cents,
                qst_cents,
                total_cents,
                payload.notes,
                now,
                now,
            ),
        )

        for item in working_items:
            line_id = new_id("item")
            conn.execute(
                """
                INSERT INTO invoice_line_items (
                    id, invoice_id, kind, code, description, quantity,
                    unit_price_cents, taxable, line_total_cents
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    line_id,
                    invoice_id,
                    item["kind"],
                    item.get("code"),
                    item["description"],
                    item["quantity"],
                    item["unit_price_cents"],
                    item["taxable"],
                    item["line_total_cents"],
                ),
            )

            if item.get("source_type") == "time" and item.get("source_id"):
                conn.execute("UPDATE time_entries SET billed_invoice_id = ? WHERE id = ?", (invoice_id, item["source_id"]))
            if item.get("source_type") == "expense" and item.get("source_id"):
                conn.execute("UPDATE expenses SET billed_invoice_id = ? WHERE id = ?", (invoice_id, item["source_id"]))

        invoice_row = conn.execute("SELECT * FROM invoices WHERE id = ?", (invoice_id,)).fetchone()
        line_rows = conn.execute(
            "SELECT * FROM invoice_line_items WHERE invoice_id = ? ORDER BY rowid ASC",
            (invoice_id,),
        ).fetchall()

        invoice_dict = _row_to_dict(invoice_row)
        client_dict = _row_to_dict(client)
        tax_profile_dict = _row_to_dict(tax_profile)
        line_dicts = [_row_to_dict(row) for row in line_rows]

        pdf_path = _render_invoice_pdf(invoice_dict, client_dict, line_dicts, tax_profile_dict)

        conn.execute(
            "UPDATE invoices SET pdf_path = ?, updated_at = ? WHERE id = ?",
            (pdf_path, utc_now_iso(), invoice_id),
        )

        if engagement:
            conn.execute(
                """
                INSERT INTO deliverables (id, engagement_id, run_id, kind, title, file_path, notes, created_at)
                VALUES (?, ?, NULL, ?, ?, ?, ?, ?)
                """,
                (
                    new_id("deliv"),
                    engagement["id"],
                    "INVOICE_PDF",
                    f"Invoice {invoice_number}",
                    pdf_path,
                    "Generated from ledger invoice endpoint",
                    utc_now_iso(),
                ),
            )

        conn.execute(
            "INSERT INTO audit_events (occurred_at, event_type, payload_json) VALUES (?, ?, ?)",
            (
                utc_now_iso(),
                "INVOICE_CREATED",
                json.dumps({"invoice_id": invoice_id, "invoice_number": invoice_number}, ensure_ascii=False),
            ),
        )

        final_invoice = conn.execute("SELECT * FROM invoices WHERE id = ?", (invoice_id,)).fetchone()

    out = _row_to_dict(final_invoice)
    out["line_items"] = line_dicts
    return out


@router.post("/payments")
def add_payment(payload: LedgerPaymentCreate):
    payment_id = new_id("pay")
    now = utc_now_iso()

    with get_conn() as conn:
        invoice = conn.execute("SELECT * FROM invoices WHERE id = ?", (payload.invoice_id,)).fetchone()
        if not invoice:
            raise HTTPException(status_code=404, detail="invoice_id not found")

        conn.execute(
            """
            INSERT INTO payments (id, invoice_id, received_date, amount_cents, method, reference, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payment_id,
                payload.invoice_id,
                payload.received_date,
                payload.amount_cents,
                payload.method,
                payload.reference,
                now,
            ),
        )

        paid_total = conn.execute(
            "SELECT COALESCE(SUM(amount_cents), 0) AS total FROM payments WHERE invoice_id = ?",
            (payload.invoice_id,),
        ).fetchone()["total"]

        if paid_total >= invoice["total_cents"]:
            conn.execute("UPDATE invoices SET status = 'paid', updated_at = ? WHERE id = ?", (utc_now_iso(), payload.invoice_id))

        row = conn.execute("SELECT * FROM payments WHERE id = ?", (payment_id,)).fetchone()

    return _row_to_dict(row)


@router.get("/reports/tax")
def tax_report(date_from: str, date_to: str):
    with get_conn() as conn:
        invoices = conn.execute(
            """
            SELECT
                COALESCE(SUM(subtotal_cents), 0) AS revenue_cents,
                COALESCE(SUM(gst_cents), 0) AS gst_collected_cents,
                COALESCE(SUM(qst_cents), 0) AS qst_collected_cents
            FROM invoices
            WHERE issue_date >= ?
              AND issue_date <= ?
              AND status != 'void'
            """,
            (date_from, date_to),
        ).fetchone()

        expenses = conn.execute(
            """
            SELECT
                COALESCE(SUM(amount_cents), 0) AS expenses_cents,
                COALESCE(SUM(gst_cents), 0) AS gst_paid_cents,
                COALESCE(SUM(qst_cents), 0) AS qst_paid_cents
            FROM expenses
            WHERE spend_date >= ?
              AND spend_date <= ?
            """,
            (date_from, date_to),
        ).fetchone()

    return {
        "currency": "CAD",
        "period": f"{date_from}..{date_to}",
        "revenue_cents": int(invoices["revenue_cents"]),
        "gst_collected_cents": int(invoices["gst_collected_cents"]),
        "qst_collected_cents": int(invoices["qst_collected_cents"]),
        "expenses_cents": int(expenses["expenses_cents"]),
        "gst_paid_cents": int(expenses["gst_paid_cents"]),
        "qst_paid_cents": int(expenses["qst_paid_cents"]),
    }
