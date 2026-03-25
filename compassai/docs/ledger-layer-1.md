# Ledger Layer 1 (SQLite) - CompassAI Backend

## Purpose

Layer 1 adds a local SQLite business ledger to the existing CompassAI backend so governance deliverables can be linked to:

- engagements
- run records
- deliverable file references
- time and expenses
- invoices and payments
- basic tax summaries

This layer is additive and does not replace the existing MongoDB governance engine.

## Files Added

- `compassai/backend/ledger_db.py`
- `compassai/backend/routers/ledger.py`

## Existing File Updated

- `compassai/backend/server.py`

Changes in `server.py`:

- includes `ledger_router` under `/api/ledger/*`
- initializes the SQLite schema at startup via `init_ledger_db()`

## Database Location

At runtime, SQLite is created under:

- `compassai/backend/ledger_data/consultbench.sqlite3`

Invoice PDFs are generated under:

- `compassai/backend/ledger_data/invoices/`

## Layer 1 Endpoints

All routes are mounted under `/api/ledger`:

- `GET /health`
- `POST /clients`
- `GET /clients`
- `POST /engagements`
- `GET /engagements`
- `POST /assessments/run`
- `GET /runs/{run_id}`
- `GET /engagements/{engagement_id}/runs`
- `GET /engagements/{engagement_id}/deliverables`
- `POST /time-entries`
- `POST /expenses`
- `GET /tax/profile`
- `PUT /tax/profile`
- `POST /invoices/generate`
- `POST /payments`
- `GET /reports/tax?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD`

## Notes

- Tax computation applies GST/QST only when registration toggles are enabled in `tax_profile`.
- `POST /invoices/generate` can pull unbilled time/expense rows and marks them with `billed_invoice_id`.
- Runs can include deliverable file references in the same request.

## Smoke-Test Status

Layer 1 route flow verified with `TestClient`:

1. health
2. create client
3. create engagement
4. create run log
5. generate invoice
6. tax report

All calls returned HTTP 200 in local test context.
