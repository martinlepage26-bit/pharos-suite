# Core Narrative Reintegration Note (2026-03-25)

## Integration judgment
All newly provided MASTER PACK and POST-RECURS stress-test artifacts are now reintegrated into the PHAROS method corpus as source packet materials, preserved as-is.

## Binding reintegration rule
- Reintegration mode is `as-is`.
- No normalization, polishing, structural cleanup, or stylistic rewriting is authorized during ingestion.
- Original filenames, directory semantics, and ordering cues are preserved where technically possible.
- Any future derivative (summary, synthesis, prompt, UI text, or method abstraction) must remain traceable back to the exact ingested artifact path.

## Scope now covered
- `docs/source-packets/archives/RECURSO_FOR_CODEX.zip` (full packet, preserved as original zip)
- `docs/source-packets/archives/master-pack-selected-2026-03-25.zip` (7-file selected packet)
- `docs/source-packets/archives/post-recurs-stress-tests-selected-2026-03-25.zip` (stress-test packet including the 2 Mobius files)
- `docs/source-packets/PACKET_REGISTRY.md` (single registry with packet scope + SHA-256 integrity hashes)

## Core narrative handling rule
When these materials are used in the core narrative:
- Treat them as packet evidence and method traces first, not as content to be cleaned.
- Mark any abstraction layer explicitly (source text vs derived interpretation).
- Do not collapse generated artifacts and source-bearing artifacts into one undifferentiated evidence pool.

## Auditability
Auditability is centralized in `docs/source-packets/PACKET_REGISTRY.md` plus `docs/source-packets/manifests/`, with SHA-256 hashes for replay and provenance checks.
