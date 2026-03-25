from __future__ import annotations

import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).resolve().parent
LEDGER_DIR = ROOT_DIR / "ledger_data"
LEDGER_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = LEDGER_DIR / "consultbench.sqlite3"


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def new_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"


@contextmanager
def get_conn():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_ledger_db() -> None:
    with get_conn() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS clients (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              email TEXT,
              phone TEXT,
              address_line1 TEXT,
              address_line2 TEXT,
              city TEXT,
              province TEXT DEFAULT 'QC',
              postal_code TEXT,
              country TEXT DEFAULT 'CA',
              notes TEXT,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS engagements (
              id TEXT PRIMARY KEY,
              client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
              title TEXT NOT NULL,
              sector TEXT,
              status TEXT NOT NULL DEFAULT 'active',
              start_date TEXT,
              end_date TEXT,
              package_code TEXT NOT NULL,
              base_price_cents INTEGER NOT NULL,
              currency TEXT NOT NULL DEFAULT 'CAD',
              m_sector REAL NOT NULL DEFAULT 1.0,
              m_urgency REAL NOT NULL DEFAULT 1.0,
              m_scope REAL NOT NULL DEFAULT 1.0,
              m_risk REAL NOT NULL DEFAULT 1.0,
              m_client_size REAL NOT NULL DEFAULT 1.0,
              urgency_level TEXT,
              scope_size TEXT,
              risk_level TEXT,
              client_size_band TEXT,
              notes TEXT,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              UNIQUE(client_id, title)
            );
            CREATE INDEX IF NOT EXISTS idx_engagements_client ON engagements(client_id);
            CREATE INDEX IF NOT EXISTS idx_engagements_status ON engagements(status);

            CREATE TABLE IF NOT EXISTS runs (
              id TEXT PRIMARY KEY,
              engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
              company_name TEXT,
              system_name TEXT,
              started_at TEXT NOT NULL,
              finished_at TEXT,
              score REAL,
              risk_tier TEXT,
              output_dir TEXT NOT NULL,
              source_assessment_id TEXT,
              engine_version TEXT,
              input_json TEXT,
              created_at TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_runs_engagement ON runs(engagement_id);
            CREATE INDEX IF NOT EXISTS idx_runs_started_at ON runs(started_at);

            CREATE TABLE IF NOT EXISTS deliverables (
              id TEXT PRIMARY KEY,
              engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
              run_id TEXT REFERENCES runs(id) ON DELETE SET NULL,
              kind TEXT NOT NULL,
              title TEXT,
              file_path TEXT NOT NULL,
              notes TEXT,
              created_at TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_deliverables_engagement ON deliverables(engagement_id);
            CREATE INDEX IF NOT EXISTS idx_deliverables_run ON deliverables(run_id);

            CREATE TABLE IF NOT EXISTS audit_events (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              occurred_at TEXT NOT NULL,
              event_type TEXT NOT NULL,
              payload_json TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS time_entries (
              id TEXT PRIMARY KEY,
              engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
              work_date TEXT NOT NULL,
              minutes INTEGER NOT NULL CHECK (minutes >= 0),
              category TEXT,
              description TEXT,
              billable INTEGER NOT NULL DEFAULT 1,
              hourly_rate_cents INTEGER,
              billed_invoice_id TEXT REFERENCES invoices(id) ON DELETE SET NULL,
              created_at TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_time_entries_engagement ON time_entries(engagement_id);
            CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries(work_date);

            CREATE TABLE IF NOT EXISTS expenses (
              id TEXT PRIMARY KEY,
              engagement_id TEXT REFERENCES engagements(id) ON DELETE SET NULL,
              spend_date TEXT NOT NULL,
              vendor TEXT,
              category TEXT NOT NULL,
              description TEXT,
              amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
              currency TEXT NOT NULL DEFAULT 'CAD',
              gst_cents INTEGER NOT NULL DEFAULT 0,
              qst_cents INTEGER NOT NULL DEFAULT 0,
              receipt_path TEXT,
              billed_invoice_id TEXT REFERENCES invoices(id) ON DELETE SET NULL,
              created_at TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(spend_date);
            CREATE INDEX IF NOT EXISTS idx_expenses_engagement ON expenses(engagement_id);

            CREATE TABLE IF NOT EXISTS invoices (
              id TEXT PRIMARY KEY,
              invoice_number TEXT NOT NULL UNIQUE,
              client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
              engagement_id TEXT REFERENCES engagements(id) ON DELETE SET NULL,
              issue_date TEXT NOT NULL,
              due_date TEXT,
              status TEXT NOT NULL DEFAULT 'draft',
              currency TEXT NOT NULL DEFAULT 'CAD',
              subtotal_cents INTEGER NOT NULL DEFAULT 0,
              discount_cents INTEGER NOT NULL DEFAULT 0,
              gst_rate REAL NOT NULL DEFAULT 0,
              qst_rate REAL NOT NULL DEFAULT 0,
              gst_cents INTEGER NOT NULL DEFAULT 0,
              qst_cents INTEGER NOT NULL DEFAULT 0,
              total_cents INTEGER NOT NULL DEFAULT 0,
              notes TEXT,
              pdf_path TEXT,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
            CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
            CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date);

            CREATE TABLE IF NOT EXISTS invoice_line_items (
              id TEXT PRIMARY KEY,
              invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
              kind TEXT NOT NULL,
              code TEXT,
              description TEXT NOT NULL,
              quantity REAL NOT NULL DEFAULT 1.0,
              unit_price_cents INTEGER NOT NULL DEFAULT 0,
              taxable INTEGER NOT NULL DEFAULT 1,
              line_total_cents INTEGER NOT NULL DEFAULT 0
            );
            CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_line_items(invoice_id);

            CREATE TABLE IF NOT EXISTS payments (
              id TEXT PRIMARY KEY,
              invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
              received_date TEXT NOT NULL,
              amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
              method TEXT,
              reference TEXT,
              created_at TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
            CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(received_date);

            CREATE TABLE IF NOT EXISTS tax_profile (
              id INTEGER PRIMARY KEY CHECK (id = 1),
              is_gst_registered INTEGER NOT NULL DEFAULT 0,
              is_qst_registered INTEGER NOT NULL DEFAULT 0,
              gst_number TEXT,
              qst_number TEXT,
              gst_rate REAL NOT NULL DEFAULT 0.05,
              qst_rate REAL NOT NULL DEFAULT 0.09975,
              effective_date TEXT,
              business_name TEXT,
              business_address TEXT,
              default_currency TEXT NOT NULL DEFAULT 'CAD',
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );
            """
        )

        # Seed single-row profile
        row = conn.execute("SELECT id FROM tax_profile WHERE id = 1").fetchone()
        if row is None:
            now = utc_now_iso()
            conn.execute(
                """
                INSERT INTO tax_profile (
                  id, is_gst_registered, is_qst_registered, gst_rate, qst_rate,
                  default_currency, created_at, updated_at
                ) VALUES (1, 0, 0, 0.05, 0.09975, 'CAD', ?, ?)
                """,
                (now, now),
            )
