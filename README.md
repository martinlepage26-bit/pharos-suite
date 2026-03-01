# govern-ai (monorepo)

## Structure
- `frontend/`  - main UI
- `backend/`   - main API/service
- `CompassAI/` - imported app
- `AurorAI/`   - imported app
- `Agency/`    - imported app
- `tests/`     - test suites
- `test_reports/` - test outputs (should usually be ignored)
- `memory/`    - local/stateful data (should usually be ignored)

## Quickstart
See each app folder for run instructions. A root `dev.ps1` can start everything.

## Notes
- Do not commit secrets. Use `.env` files (ignored).
