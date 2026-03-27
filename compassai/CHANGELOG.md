# Changelog

## 2026-03-06
- Snapshot tag: `snapshot-2026-03-06-govern-suite`
- Commit: `8107f5940c6c564af9a75920d2a1e5838288572b`

### Added
- Canonical governance intake APIs for use-case registration
- Evidence ingestion APIs aligned to AurorAI handoff payloads
- Use-case assessment and audit trail support

### Changed
- Removed write-on-read benchmark seeding behavior from the read path
- Updated AI service client code to match the actual local LLM client shape
- Stabilized governance intake and evidence-handling flow for linkage with pharos-suite

### Verified
- Local API works at `http://127.0.0.1:9205/api/`
- Use-case intake works
- Evidence ingestion from AurorAI works
- Assessment works and returned `T2` with one ingested evidence item in the current verification pass

### Notes
- This repo is positioned as the governance engine behind pharos-suite
- Richer LLM-backed generation still depends on a valid OpenAI-compatible credential path
