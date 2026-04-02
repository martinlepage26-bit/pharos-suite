# pharos-suite

Pharos Suite monorepo for the PHAROS shell and module stack:
`pharos-ai.ca` + Aurora + CompassAI.

## Repository

- Repository URL: `https://github.com/martinlepage26-bit/pharos-suite`
- Default branch: `main`

## Layout

- `frontend/` - PHAROS public shell and portal frontend
- `backend/` - PHAROS API for bookings, services, and platform status
- `compassai/` - CompassAI governance application services and tests
- `aurorai/` - Aurora intake and document processing service
- `pharos_integrations/` - local OpenAI-compatible integration shim
- `docs/`, `infra/`, `scripts/` - operations, deployment, and tooling

## Quick Start

```bash
git clone https://github.com/martinlepage26-bit/pharos-suite.git
cd pharos-suite
```

Frontend:

```bash
cd frontend
npm install
npm run start
```

Backend (example):

```bash
cd backend
uv pip install -r requirements.txt
uv run uvicorn server:app --host 127.0.0.1 --port 9202
```

## Notes

- Keep secrets in local `.env` files only; never commit credentials.
- See `docs/pharos-product-boundaries.md` for naming and claim-boundary rules.
